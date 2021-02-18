<template>
  <v-container fluid grid-list-xl class="EpitopeMenu" >
    <h2 style="margin-bottom: 10px">Add Amino Acid Conditions</h2>
    <v-layout wrap align-center justify-space-around style="margin-bottom: 10px">
      <v-flex class="no-horizontal-padding xs12 sm6 md2 lg2 d-flex EpitopeSelectors"
                  v-for="fieldEpi in aminoAcidFields" v-bind:key="fieldEpi.text">

        <div v-if="fieldEpi.field==='position_range'">
          <PositionSelectorAminoAcidNewEpitope
            :text="fieldEpi.text"
            :field="fieldEpi.field"></PositionSelectorAminoAcidNewEpitope>
        </div>
        <div v-else>
          <TextSelectorAminoAcidNewEpitope
              :text="fieldEpi.text"
            :field="fieldEpi.field"></TextSelectorAminoAcidNewEpitope>
        </div>

      </v-flex>
    </v-layout>

    <span><b>NEW CONDITION: </b>{{newSingleAminoAcidConditionUser}}</span>

    <span style="display: block" v-if="epitopeAminoacidConditionsArrayUserNewInOR.length>0"> <b>CONDITIONS IN OR:</b>
      <span v-for="(condition, index) in epitopeAminoacidConditionsArrayUserNewInOR">
        <span v-if="index > 0"> OR </span> {{condition}}
      </span>
    </span>


    <v-layout wrap justify-center style="margin-top: 20px">
        <v-btn @click="clearAminoEpiMenu()" class="white--text" color="orange">CLEAR</v-btn>
        <v-btn @click="closeAminoEpiMenu()"
                       class="white--text" color="red">CLEAR & CLOSE</v-btn>
        <v-btn @click="addAminoacidConditionsInOR()" class="white--text" color="light-green">ADD IN OR</v-btn>
        <v-btn @click="applyAminoacidConditions()" class="white--text" color="green">ADD</v-btn>
    </v-layout>

  </v-container>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import axios from "axios";
import EpitopeSelectorText from "./EpitopeSelectorText";
import EpitopeSelectorNum from "./EpitopeSelectorNum";
import ProteinSelectorNewEpitope from "./ProteinSelectorNewEpitope";
import PositionSelectorNewEpitope from "./PositionSelectorNewEpitope";
import PositionSelectorAminoAcidNewEpitope from "./PositionSelectorAminoAcidNewEpitope";
import TextSelectorAminoAcidNewEpitope from "./TextSelectorAminoAcidNewEpitope";

export default {
  name: "AminoacidVariantNewUserEpitope",
  components: {
    TextSelectorAminoAcidNewEpitope,
    PositionSelectorAminoAcidNewEpitope, PositionSelectorNewEpitope, ProteinSelectorNewEpitope},
  data() {
    return {
      singleCondition: [],
      aminoAcidFields: null,
    }
  },
  computed: {
    ...mapState([
        'disableSelectorUserNewEpitopePart', 'newSingleAminoAcidConditionUser', 'epitopeAminoacidConditionsArrayUserNewInOR'
    ]),
    ...mapGetters({
        compound_query: 'build_query',
    }),
  },
  methods:{
    ...mapMutations([
       'setFalseDisableSelectorUserNewEpitopePart',
      'setFalseShowAminoacidVariantUserNewEpi', 'setFalseDisableSelectorEpitopePart',
        'addEpitopeAminoacidConditionsArrayUserNew', 'addEpitopeAminoacidConditionsArrayUserNewInOR',
        'resetEpitopeAminoacidConditionsArrayUserNewInOR', 'resetNewSingleAminoAcidConditionUser'
    ]),
    ...mapActions(['setNewSingleAminoAcidConditionUserAction']),
    closeAminoEpiMenu(){
      this.setFalseDisableSelectorEpitopePart();
      this.setFalseShowAminoacidVariantUserNewEpi();
      this.clearAminoEpiMenu();
      this.setFalseDisableSelectorUserNewEpitopePart();
    },
    clearAminoEpiMenu(){
      this.setNewSingleAminoAcidConditionUserAction({field: 'product', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'variant_aa_type', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_original', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_alternative', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'start_aa_original', list: ''});
      this.resetEpitopeAminoacidConditionsArrayUserNewInOR();
    },
    applyAminoacidConditions(){
      let copy = JSON.parse(JSON.stringify(this.newSingleAminoAcidConditionUser));
      let copyOR = JSON.parse(JSON.stringify(this.epitopeAminoacidConditionsArrayUserNewInOR));
      let all;
      if(Object.keys(copy).length === 0 && copyOR.length === 0) {
        console.log("NOTHING TO ADD");
      }
      else {
        if (copyOR.length > 0) {
          all = copyOR;
          if(Object.keys(copy).length>0){
            all.push(copy);
          }
        } else {
          all = copy;
        }
        this.addEpitopeAminoacidConditionsArrayUserNew(all);
        this.closeAminoEpiMenu();
      }
    },
    addAminoacidConditionsInOR(){
      if(Object.keys(this.newSingleAminoAcidConditionUser).length > 0) {
        let copy = JSON.parse(JSON.stringify(this.newSingleAminoAcidConditionUser));
        this.addEpitopeAminoacidConditionsArrayUserNewInOR(copy);
        this.setNewSingleAminoAcidConditionUserAction({field: 'product', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'variant_aa_type', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_original', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_alternative', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'start_aa_original', list: ''});
      }
    }
  },
  watch: {
    disableSelectorUserNewEpitopePart(){
      if(this.disableSelectorUserNewEpitopePart){
        this.singleCondition = [];
      }
    }

  },
  created() {
    const url = `epitope/fieldAminoNewEpiUser `;

    axios.get(url)
      .then((res) => {
          return res.data;
      })
      .then((res) => {
          let vals = res.fields;
          this.aminoAcidFields = vals;
      });
  }
}
</script>

<style scoped>
  .EpitopeMenu{
    border : 1px solid black;
    background-color:  #857164 !important;
    max-width: 70%;
    border-radius: 15px !important;
    margin-top: 20px;
    margin-bottom: 20px;
    }

  .EpitopeSelectors{
    margin-bottom: 10px;
  }
</style>