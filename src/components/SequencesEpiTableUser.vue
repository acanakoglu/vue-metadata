<template>
  <div class="text-center">
    <v-dialog
        persistent
        scrollable
      v-model="dialog2"
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
  name: "SequencesEpiTableUser",
  components: {MetadataTableForEpi},
  props: {
  },
  data(){
    return{
      dialog2: false,
      sequences: [],
    }
  },
  computed: {
    ...mapState([
      'showSequenceEpiTableUser', 'chosenEpitope', 'query', 'epiQuerySel'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
    }),
  },
  methods: {
    ...mapMutations([
      'showSeqEpiTableUser', 'setChosenEpitope'
    ]),
    exit(){
      this.showSeqEpiTableUser();
      this.setChosenEpitope(null);
    }
  },
  watch: {
    showSequenceEpiTableUser() {
      this.dialog2 = this.showSequenceEpiTableUser;
    },
  },
}
</script>

<style scoped>

</style>