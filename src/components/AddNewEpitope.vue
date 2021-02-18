<template>

  <div>

      <v-container fluid grid-list-xl class="EpitopeMenu">
        <v-layout wrap align-center >

          <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
            <h2>Try New Epitope</h2>
          </v-flex>

          <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
            <h3 style="color:red"  v-if="epiSearchDis">{{requirement}}</h3>
          </v-flex>

          <v-flex class="no-horizontal-padding xs12 sm6 md4 lg4 d-flex EpitopeSelectors"
                              v-for="fieldEpi in newEpitopeFields" v-bind:key="fieldEpi.text">
            <div v-if="fieldEpi.field ==='epitope_name'">
              <v-card>
                <v-text-field
                  v-model="epitope_name"
                  label= "Epitope Name"
                  :disabled="epiSearchDis"
                ></v-text-field>
              </v-card>
            </div>
            <div v-else-if="fieldEpi.field==='product'">
                <ProteinSelectorNewEpitope
                :text="fieldEpi.text"
                :field="fieldEpi.field"></ProteinSelectorNewEpitope>
            </div>
            <div v-else-if="fieldEpi.field==='position_range'">
                <PositionSelectorNewEpitope
                :text="fieldEpi.text"
                :field="fieldEpi.field"></PositionSelectorNewEpitope>
            </div>

            <v-dialog width="500">
                <v-btn
                        slot="activator"
                        class="info-button"
                        small
                        flat icon color="blue">
                    <v-icon class="info-icon">info</v-icon>
                </v-btn>
                <v-card>
                    <v-card-title
                            class="headline grey lighten-2"
                            primary-title
                    >
                      {{fieldEpi.text}}
                    </v-card-title>
                    <v-card-text>
                      {{fieldEpi.description}}
                    </v-card-text>
                </v-card>
            </v-dialog>
          </v-flex>

          <h4 v-if="newSingleEpitope['position_range']" style="width: 100%"> Positions: </h4>

          <div v-for="(pos, index) in newSingleEpitope['position_range']"v-if="!epiSearchDis">
               <v-layout align-center style="margin: 0px">
                 <div class="singlePosition">
                    <span>
                        {{pos}}
                    </span>
                   <v-btn @click="deletePosition(index)" class="white--text" color="red" small flat icon>
                     <v-icon dark>remove_circle</v-icon>
                   </v-btn>
                 </div>
               </v-layout>
          </div>

        </v-layout>

        <v-layout wrap justify-center style="margin-top: 20px">
              <v-btn @click="openShowAminoacidVariantUserNewEpi()"
                         color="#D2691E"
                     style="color:white;"
                        :disabled="epiSearchDis || disableSelectorUserNewEpitopePart">
                Add conditions on amino acids (optional)</v-btn>
          <AminoacidVariantNewUserEpitope v-if="showAminoacidVariantUserNewEpi"></AminoacidVariantNewUserEpitope>
        </v-layout>

        <h3 v-if="epitopeAminoacidConditionsArrayUserNew.length>0"> Amino acid conditions: </h3>
        <div v-for="(aminoConditions, index) in epitopeAminoacidConditionsArrayUserNewToShow">
          <v-card style="background-color:  #857164">
             <v-layout wrap justify-center align-center style="margin-top: 20px">
               <v-flex sm2 class="text-xs-center">
                 <span style="border: solid black 2px; border-radius: 10%; padding: 5px"><b>{{index + 1}}</b></span>
               </v-flex>
               <v-flex sm6>
                 <span v-if="aminoConditions.length>0" v-for="(condition, index2) in aminoConditions" style="display: block;" >
                   <span v-if="index2 !== 0" style="display: block;" > <b> OR </b> </span>
                   <span v-for="(value2, key2) in condition" style="display: block;">
                      <b>- {{key2}} :</b> {{value2}}
                   </span>
                 </span>
                 <span v-else v-for="(value, key) in aminoConditions" style="display: block;">
                   <b>- {{key}} :</b> {{value}}
                 </span>
               </v-flex>
               <v-flex sm4 class="text-xs-center">
                 <v-btn @click="deleteAminoConditions(index)" class="white--text" color="red">DELETE CONDITION</v-btn>
               </v-flex>
             </v-layout>
          </v-card>
        </div>


        <v-layout wrap justify-center style="margin-top: 20px" v-if="!epiSearchDis">
          <span> NEW EPITOPE: {{this.newSingleEpitope}} </span>
        </v-layout>

        <v-layout wrap justify-center style="margin-top: 20px">
         <v-btn :disabled="epiSearchDis" @click="addEpitope()" class="white--text" color="green">ADD EPITOPE</v-btn>
         <v-btn :disabled="epiSearchDis" @click="clearEpitope()" class="white--text" color="orange">CLEAR EPITOPE</v-btn>
        </v-layout>

        <v-dialog
            persistent
          v-model="missingFields"
          width="300"
        >
          <v-card>
            <v-card-title class="headline" style="background-color:#800000; color: white">
              Missing Fields
              <v-spacer></v-spacer>
              <v-btn
                  style="background-color: red"
                  slot="activator"
                  flat icon
                  small
                color="white"
                @click="exitMissingFields()"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text class="text-xs-center">
              Need all the fields compiled to save the new epitope
            </v-card-text>

          </v-card>
        </v-dialog>

        <v-progress-linear v-if="newEpitopeLoading"
          indeterminate
          color="blue"
        ></v-progress-linear>
        <h2 v-if="epitopeAdded.length>0"> Epitopes: </h2>
        <div v-for="(epitope, index) in epitopeAddedReview">
          <v-card style="background-color:  #857164">
             <v-layout wrap justify-center align-center style="margin-top: 20px">
               <v-flex sm2 class="text-xs-center">
                 <span style="border: solid black 2px; border-radius: 10%; padding: 5px"><b>{{index + 1}}</b></span>
               </v-flex>
               <v-flex sm6>
                 <span v-for="(value, key) in epitope" style="display: block;"> <b>- {{key}} :</b> {{value}} </span>
               </v-flex>
               <v-flex sm4 class="text-xs-center">
                 <v-btn @click="moreInfo(index)" class="white--text" color="blue" style="width: 60%">MORE INFO</v-btn>
                 <v-btn @click="deleteEpitope(index)" class="white--text" color="red" style="width: 60%">DELETE EPITOPE</v-btn>
               </v-flex>
             </v-layout>
          </v-card>
        </div>

      </v-container>

      <EpitopeTableUserAdd></EpitopeTableUserAdd>

      <MoreInfoEpitopeUser></MoreInfoEpitopeUser>

  </div>

</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import EpitopeTableUserAdd from "./EpitopeTableUserAdd";
import axios from "axios";
import ProteinSelectorNewEpitope from "./ProteinSelectorNewEpitope";
import PositionSelectorNewEpitope from "./PositionSelectorNewEpitope";
import MoreInfoEpitopeUser from "./MoreInfoEpitopeUser";
import AminoacidVariantNewUserEpitope from "./AminoacidVariantNewUserEpitope";

export default {
  name: "AddNewEpitope",
  components: {
    AminoacidVariantNewUserEpitope,
    MoreInfoEpitopeUser, PositionSelectorNewEpitope, ProteinSelectorNewEpitope, EpitopeTableUserAdd},
  data() {
    return {
      requirement: 'A single Host and a single Virus are required',
      missingFields: false,
      newEpitopeFields: [],
      epitope_name: '',
      is_control: false,
      finish_count_seq: false,
      finish_count_var: false,
      epitopeToAdd: null,
      precision_float_table: 5,
    }
  },
  computed: {
    ...mapState(['epitopeAdded', 'newSingleEpitope', 'newEpitopeLoading', 'showMoreInfoEpitopeUser',
      'countSeq2', 'showAminoacidVariantUserNewEpi',
      'disableSelectorUserNewEpitopePart', 'newSingleAminoAcidConditionUser', 'epitopeAminoacidConditionsArrayUserNew']),
    ...mapGetters({
      epiSearchDis: 'epiSearchDisabled',
      compound_query: 'build_query',
    }),
    epitopeAminoacidConditionsArrayUserNewToShow(){
      let copy = JSON.parse(JSON.stringify(this.epitopeAminoacidConditionsArrayUserNew));
      let len = copy.length;

      let i = 0;
      let arrayToShow = [];
      while(i<len) {
        let line = {};
        let single = copy[i];
        if (single.length === undefined || single.length === null) {
          Object.keys(single).forEach(function (key) {
            if (key === 'product') {
              line['protein'] = single[key][0];
            } else if (key === 'variant_aa_type') {
              line['variant_type'] = single[key][0];
            } else if (key === 'sequence_aa_original') {
              line['original_amino_acid'] = single[key][0];
            } else if (key === 'sequence_aa_alternative') {
              line['new_amino_acid'] = single[key][0];
            } else if (key === 'start_aa_original') {
              let pos = single[key]['min_val'] + '-' + single[key]['max_val'];
              line['position_range'] = pos;
            }
          })
          arrayToShow.push(line);
        }
        else {
          let j = 0;
          let length = single.length;
          let arrayToAddArray = [];
          while (j < length) {
            let line2 = {};
            let single2 = single[j];
            Object.keys(single2).forEach(function (key) {
              if (key === 'product') {
                line2['protein'] = single2[key][0];
              } else if (key === 'variant_aa_type') {
                line2['variant_type'] = single2[key][0];
              } else if (key === 'sequence_aa_original') {
                line2['original_amino_acid'] = single2[key][0];
              } else if (key === 'sequence_aa_alternative') {
                line2['new_amino_acid'] = single2[key][0];
              } else if (key === 'start_aa_original') {
                let pos = single2[key]['min_val'] + '-' + single2[key]['max_val'];
                line2['position_range'] = pos;
              }
            })
            arrayToAddArray.push(line2);
            j++;
          }
          arrayToShow.push(arrayToAddArray);
        }
        i++;
      }
      return arrayToShow;
    },
    epitopeAddedReview(){
      let val = JSON.parse(JSON.stringify(this.epitopeAdded));
      let arrayToReturn = [];
      let len = val.length;
      let i=0;
      while(i<len){
        let line = {};
        line['epitope_name'] = val[i].epitope_name;
        line['product'] = val[i].product;
        line['position_range'] = val[i].position_range_to_show;
        line['taxon_name'] = val[i].taxon_name;
        line['host_taxon_name'] = val[i].host_taxon_name;
        line['num_seq'] = val[i].num_seq;
        line['num_var'] = val[i].num_var;
        arrayToReturn.push(line);
        i++;
      }
      return arrayToReturn;
    }
  },
   methods: {
     ...mapMutations(['addNewEpitopeToList', 'removeNewEpitopeFromList', 'setCountEpi', 'removePositionFromNewEpitope',
     'setFalseNewEpitopeLoading', 'setTrueNewEpitopeLoading', 'showMoreInfo', 'setUserEpitopeSelected',
     'setTrueShowAminoacidVariantUserNewEpi', 'setTrueDisableSelectorUserNewEpitopePart',
       'setTrueDisableSelectorEpitopePart', 'removeEpitopeAminoacidConditionsArrayUserNew',
     'resetEpitopeAminoacidConditionsArrayUserNew']),
     ...mapActions(['setNewSingleEpitopeSelected', 'setNewSingleAminoAcidConditionUserAction']),
     openShowAminoacidVariantUserNewEpi(){
       this.setNewSingleAminoAcidConditionUserAction({field: 'product', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'variant_aa_type', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_original', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_alternative', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'start_aa_original', list: ''});
       this.setTrueDisableSelectorEpitopePart();
      this.setTrueShowAminoacidVariantUserNewEpi();
      this.setTrueDisableSelectorUserNewEpitopePart();
    },
     addEpitope(){
       if(this.allFieldsCompiled()) {
         this.setNewSingleEpitopeSelected({field: 'taxon_name', list: this.compound_query['gcm'].taxon_name[0]})
         this.setNewSingleEpitopeSelected({field: 'host_taxon_name', list: this.compound_query['gcm'].host_taxon_name[0]})
         let val = JSON.parse(JSON.stringify(this.newSingleEpitope));

         val['compound_query'] = JSON.parse(JSON.stringify(this.compound_query));

         val['compound_query']['kv'] = this.addKvPart(val);

         let listPosition = val['position_range'];
         let len = listPosition.length;
         let i = 0;
         let newListPositionString = '';
         while(i<len){
           if(i===0) {
             val['position_range'] = listPosition[i][0];
           }
           let min = listPosition[i][0];
           let max = listPosition[i][1];
           newListPositionString += min + "-" + max;
           i++;
           if(i<len){
             newListPositionString += ", \n"
           }
         }
         val['position_range_to_show'] = newListPositionString;

         this.epitopeToAdd = val;
         this.countNumSeq(val);
         this.countNumVar(val);
         this.resetEpitopeAminoacidConditionsArrayUserNew();

         this.clearEpitope();
       }
       else{
         this.missingFields = true;
       }
     },
     allFieldsCompiled(){
       if(this.newSingleEpitope['taxon_name'] && this.newSingleEpitope['host_taxon_name']
       && this.newSingleEpitope['epitope_name'] && this.newSingleEpitope['product']
       && this.newSingleEpitope['position_range'] ){
         return true;
       }
       else{
         return false;
       }
     },
     clearEpitope(){
       this.epitope_name = '';
       this.setNewSingleEpitopeSelected({field: "epitope_name", list: ''});
       this.setNewSingleEpitopeSelected({field: "product", list: ''});
       this.setNewSingleEpitopeSelected({field: "position_range", list: ''});
       this.setNewSingleEpitopeSelected({field: "num_seq", list: ''});
       this.resetEpitopeAminoacidConditionsArrayUserNew();
     },
     deleteEpitope(index){
        this.removeNewEpitopeFromList(index);
     },
     deleteAminoConditions(index){
       this.removeEpitopeAminoacidConditionsArrayUserNew(index);
     },
     moreInfo(index){
       this.setUserEpitopeSelected(index);
       this.showMoreInfo();
     },
     deletePosition(index){
       this.removePositionFromNewEpitope(index);
        if(this.newSingleEpitope['position_range'] && this.newSingleEpitope['position_range'].length === 0){
          this.setNewSingleEpitopeSelected({field: "position_range", list: ''});
        }
     },
     exitMissingFields(){
       this.missingFields = false;
     },
     addKvPart(val){
       let kv = {};
       kv['aa_0'] = {};
       kv['aa_0']['type_query'] = 'aa';
       kv['aa_0']['exact'] = false;

       let array_conditions = [];

       let len = val['position_range'].length;
       let i = 0;
       while(i<len){
         let product = val['product'];
         let position = val['position_range'][i];
         let min = position[0];
         let max = position[1];
         let line = {};
         line['product'] = [product];
         line['start_aa_original'] = {'min_val': min, 'max_val': max};
         array_conditions.push(line);
         i++;
       }

       kv['aa_0']['query'] = array_conditions;

       let copy = JSON.parse(JSON.stringify(this.epitopeAminoacidConditionsArrayUserNew));
       let length = copy.length;
       let j = 0;
       while(j < length){
         let single = copy[j];
         j++;
         let name = 'aa_' + j;
         kv[name] = {};
         kv[name]['type_query'] = 'aa';
         kv[name]['exact'] = false;
         if(single.length === undefined || single.length === null) {
            kv[name]['query'] = [single];
         }
         else{
            kv[name]['query'] = single;
         }
       }

       return kv;

     },
     countNumSeq(val){
       let to_send = val['compound_query'];
      this.isLoading = true;
      this.finish_count_seq = false;
      this.setTrueNewEpitopeLoading();

      let count_url = `query/count?is_control=${this.is_control}`;

      axios.post(count_url, to_send)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              val['num_seq'] = res;
              this.epitopeToAdd['num_seq'] = res;
              this.finish_count_seq = true;
              //this.addNewEpitopeToList(val);
              //this.setFalseNewEpitopeLoading();
          });
     },
     countNumVar(val){
       let to_send = val['compound_query'];
      this.isLoading = true;
      this.finish_count_var = false;
      this.setTrueNewEpitopeLoading();

      if(to_send['kv']['aa_1']){
         val['num_var'] = 0;
        this.epitopeToAdd['num_var'] = 'N/D';
        this.finish_count_var = true;
       }
       else {

        let count_url = `epitope/countVariantsEpitopeUser`;

        axios.post(count_url, to_send)
            .then((res) => {
              return res.data;
            })
            .then((res) => {
              if (res[0].count === null || res[0].count === undefined) {
                val['num_var'] = 0;
                this.epitopeToAdd['num_var'] = 0;
              } else {
                val['num_var'] = res[0].count;
                this.epitopeToAdd['num_var'] = res[0].count;
              }
              this.finish_count_var = true;
              //this.addNewEpitopeToList(val);
              //this.setFalseNewEpitopeLoading();
            });
      }
     },
     addFrequencies(){
       if(this.epitopeToAdd['num_seq'] === 0){
          this.epitopeToAdd['mutated_freq'] = 0;
        }
        else {
          this.epitopeToAdd['mutated_freq'] = this.epitopeToAdd['num_var'] / this.epitopeToAdd['num_seq'];
        }
        this.epitopeToAdd['mutated_freq'] = this.epitopeToAdd['mutated_freq'].toPrecision(this.precision_float_table);
        this.epitopeToAdd['mutated_seq_ratio'] = (this.epitopeToAdd['num_seq'] / this.countSeq2) * 100;
        if (this.epitopeToAdd['mutated_seq_ratio'] >= 10) {
          this.epitopeToAdd['mutated_seq_ratio'] = this.epitopeToAdd['mutated_seq_ratio'].toPrecision(this.precision_float_table + 1);
        } else {
          this.epitopeToAdd['mutated_seq_ratio'] = this.epitopeToAdd['mutated_seq_ratio'].toPrecision(this.precision_float_table);
        }
        this.epitopeToAdd['mutated_seq_ratio'] += ' %';
        this.epitopeToAdd['total_num_of_seq_metadata'] = this.countSeq2;
     },
   },
  created() {
      if(this.compound_query['gcm'].taxon_name) {
        this.setNewSingleEpitopeSelected({field: 'taxon_name', list: this.compound_query['gcm'].taxon_name[0]})
      }
      if(this.compound_query['gcm'].host_taxon_name) {
        this.setNewSingleEpitopeSelected({
          field: 'host_taxon_name',
          list: this.compound_query['gcm'].host_taxon_name[0]
        })
      }
      const url = `epitope/newEpitopeFields`;

      this.newEpitopeFields = [];

      axios.get(url)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.newEpitopeFields = res.fields;
          });
  },
  watch:{
    epitope_name(){
      this.epitope_name = this.epitope_name.charAt(0).toUpperCase() + this.epitope_name.slice(1);
      this.setNewSingleEpitopeSelected({field: 'epitope_name', list: this.epitope_name})
    },
    compound_query(){
      if(this.compound_query['gcm'].taxon_name) {
        this.setNewSingleEpitopeSelected({field: 'taxon_name', list: this.compound_query['gcm'].taxon_name[0]})
      }
      if(this.compound_query['gcm'].host_taxon_name) {
        this.setNewSingleEpitopeSelected({
          field: 'host_taxon_name',
          list: this.compound_query['gcm'].host_taxon_name[0]
        })
      }
    },
    epitopeAdded(){
      this.setCountEpi(this.epitopeAdded.length);
    },
    finish_count_seq(){
      if(this.finish_count_seq === true && this.finish_count_var === true){

        this.addFrequencies();
        this.addNewEpitopeToList(this.epitopeToAdd);
        this.setFalseNewEpitopeLoading();
        this.epitopeToAdd = null;
      }
    },
    finish_count_var(){
      if(this.finish_count_seq === true && this.finish_count_var === true){

        this.addFrequencies();
        this.addNewEpitopeToList(this.epitopeToAdd);
        this.setFalseNewEpitopeLoading();
        this.epitopeToAdd = null;
      }
    }
  }
}
</script>

<style scoped>

  .EpitopeMenu{
    border : 1px solid black;
    background-color: #B7A595;
    max-width: 80%;
    margin-bottom: 50px;
    border-radius: 15px !important;
    margin-top: 50px;
    padding-bottom: 50px;
    }

    .EpitopeSelectors{
    margin-bottom: 10px;
  }

   .info-icon {
     font-size: 15px
   }

  .info-button {
    width: 10px
  }

  .singlePosition{
    background-color:  #857164;
    border: black solid 1px;
    padding-left: 5px;
    padding-right: 5px;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: 20%;
  }

</style>