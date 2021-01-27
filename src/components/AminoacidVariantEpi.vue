<template>
  <v-container fluid grid-list-xl class="EpitopeMenu" >
    <v-layout justify-center>
      <v-flex class="no-horizontal-padding xs12 sm6 md6 lg3 d-flex EpitopeSelectors"
                  v-for="fieldEpi in epitopeAminoacidFields" v-bind:key="fieldEpi.text">
                  <EpitopeSelectorText
                      v-if="!fieldEpi.is_numerical && !fieldEpi.is_percentage "
                      :text="fieldEpi.text"
                      :field="fieldEpi.field">
                  </EpitopeSelectorText>
                  <EpitopeSelectorNum
                      v-if="fieldEpi.is_numerical"
                      :text="fieldEpi.text"
                      :field="fieldEpi.field">
                  </EpitopeSelectorNum>

      </v-flex>
    </v-layout>
    <v-layout justify-center style="margin-top: 20px">
       <v-btn @click="clearAminoEpiMenu()" color="error">CLEAR</v-btn>
       <v-btn @click="closeAminoEpiMenu()"
                       color="error">CLEAR & CLOSE</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import axios from "axios";
import EpitopeSelectorText from "./EpitopeSelectorText";
import EpitopeSelectorNum from "./EpitopeSelectorNum";

export default {
  name: "AminoacidVariantEpi",
  components: {EpitopeSelectorNum, EpitopeSelectorText},
  data() {
    return {
      epitopeAminoacidFields: [],
    }
  },
  computed: {
    ...mapState([
      'showAminoacidVariantEpi', 'epiQuerySel', 'query'
    ]),
  },
  methods:{
    ...mapMutations([
        'setTrueShowAminoacidVariantEpi', 'setFalseShowAminoacidVariantEpi', 'set'
    ]),
    ...mapActions(['setEpiDropDownSelected']),
    closeAminoEpiMenu(){
      this.setFalseShowAminoacidVariantEpi();
      this.clearAminoEpiMenu();
    },
    clearAminoEpiMenu(){
      this.setEpiDropDownSelected({field: 'variant_aa_type', list: []});
      this.setEpiDropDownSelected({field: 'sequence_aa_original', list: []});
      this.setEpiDropDownSelected({field: 'sequence_aa_alternative', list: []});
      this.setEpiDropDownSelected({field: 'startExtVariant', list: []});
      this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});
    }
  },
  watch: {
  },
  created() {
    const url = `epitope/fieldAminoEpi `;

    this.epitopeAminoacidFields = [];

    axios.get(url)
      .then((res) => {
          return res.data;
      })
      .then((res) => {
          this.epitopeAminoacidFields = res.fields;
      });
  }
}
</script>

<style scoped>
  .EpitopeMenu{
    border : 1px solid black;
    background-color: #d5dbe0;
    max-width: 70%;
    border-radius: 15px !important;
    margin-top: 20px;
    margin-bottom: 20px;
    }
</style>