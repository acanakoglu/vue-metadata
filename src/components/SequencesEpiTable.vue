<template>
  <div class="text-center">
    <v-dialog
        persistent
        scrollable
      v-model="dialog"
      width="1000"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Sequence Table
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="exit()"
          >
            CLOSE
          </v-btn>
        </v-card-title>

        <v-card-text>
          <MetadataTableForEpi></MetadataTableForEpi>
        </v-card-text>

      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import axios from "axios";
import {poll} from "../utils";
import MetadataTableForEpi from "./MetadataTableForEpi";

export default {
  name: "SequencesEpiTable",
  components: {MetadataTableForEpi},
  props: {
  },
  data(){
    return{
      dialog: false,
      sequences: [],
    }
  },
  computed: {
    ...mapState([
      'showSequenceEpiTable', 'chosenEpitope', 'query', 'epiQuerySel'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
    }),
  },
  methods: {
    ...mapMutations([
      'showSeqEpiTable', 'setChosenEpitope'
    ]),
    toSend(){
      let res = {};
      Object.assign(res,{"compound_query": this.compound_query},
                        {"epi_query": this.epiQuerySel});
      return res;
    },
    exit(){
      this.showSeqEpiTable();
      this.setChosenEpitope(null);
    }
  },
  watch: {
    showSequenceEpiTable() {
      this.dialog = this.showSequenceEpiTable;
    },
  },
}
</script>

<style scoped>

</style>