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
       <v-btn @click="applyAminoacidConditions()" color="green">APPLY</v-btn>
       <v-btn @click="clearAminoEpiMenu()" color="orange">CLEAR</v-btn>
       <v-btn @click="closeAminoEpiMenu()"
                       color="red">CLEAR & CLOSE</v-btn>
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
    }
  },
  computed: {
    ...mapState([
      'showAminoacidVariantEpi', 'epiQuerySel', 'query', 'epitopeAminoacidFields', 'aminoacidConditions'
    ]),
  },
  methods:{
    ...mapMutations([
        'setTrueShowAminoacidVariantEpi', 'setFalseShowAminoacidVariantEpi', 'setEpitopeAminoacidFields', 'setFalseDisableSelectorEpitopePart'
    ]),
    ...mapActions(['setEpiDropDownSelected', 'setAminoacidConditionsSelected']),
    closeAminoEpiMenu(){
      this.setFalseShowAminoacidVariantEpi();
      this.clearAminoEpiMenu();
      this.setFalseDisableSelectorEpitopePart();
    },
    clearAminoEpiMenu(){
      this.epitopeAminoacidFields.forEach(elem => {
            this.setEpiDropDownSelected({field: elem.field, list: []});
            this.setAminoacidConditionsSelected({field: elem.field, list: []});
          }
      )
      this.setEpiDropDownSelected({field: 'startExtVariant', list: []});
      this.setAminoacidConditionsSelected({field: 'startExtVariant', list: []});
      this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});
      this.setAminoacidConditionsSelected({field: 'stopExtVariant', list: []});
    },
    applyAminoacidConditions(){
      Object.entries(this.aminoacidConditions).forEach(item =>{
        this.setEpiDropDownSelected({field: item[0], list:item[1]});
      })
    },
  },
  watch: {
  },
  created() {
    const url = `epitope/fieldAminoEpi `;

    this.setEpitopeAminoacidFields([]);

    axios.get(url)
      .then((res) => {
          return res.data;
      })
      .then((res) => {
          let vals = res.fields;
          this.setEpitopeAminoacidFields(vals);
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