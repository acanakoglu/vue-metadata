<template>
  <v-container fluid grid-list-xl class="EpitopeMenu" >
    <h2 style="margin-bottom: 10px">Add Amino Acid Condition</h2>
    <v-layout wrap align-center>
      <v-flex xs12 lg12 class="no-horizontal-padding" v-if="Object.keys(aminoacidConditions).length > 0" style="margin-top: 10px; margin-bottom: 30px; margin-left: 20px; margin-right: 20px" >
          <span class="label">
            Amino Acid Variant
          </span>
          <span style="font-family:monospace; font-size:120%;">
              {{ queryToShow }}
          </span>
        </v-flex>
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
                  <v-dialog width="500">
                    <v-btn
                            slot="activator"
                            class="info-button"
                            small
                            flat icon color="grey">
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
    </v-layout>
    <v-layout wrap justify-center style="margin-top: 20px">
      <v-btn @click="closeAminoEpiMenu()"
                       class="white--text" color="#696969">CLEAR & CLOSE</v-btn>
       <v-btn @click="clearAminoEpiMenu()" class="white--text" color="rgb(122, 139, 157)">CLEAR</v-btn>
      <v-btn @click="applyAminoacidConditions()" class="white--text" color="#00008B">APPLY</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
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
      'showAminoacidVariantEpi', 'epiQuerySel', 'query', 'epitopeAminoacidFields', 'aminoacidConditions', 'epitopeAminoacidFields'
    ]),
    ...mapGetters({
        compound_query: 'build_query',
    }),
    queryToShow() {
      let inner_list = [];
      Object.keys(this.aminoacidConditions).forEach(key => {
        const value2 = [];
        const value = this.aminoacidConditions[key];

        let modifiedKey = this.modifyKey(key);

        if (Array.isArray(value)) {
          value.forEach(val => {
            if (val === null)
              value2.push("N/D");
            else
              value2.push(val);
          });
          inner_list.push(modifiedKey + ': ' + JSON.stringify(value2));
        } else {
          inner_list.push(modifiedKey + ': ' + JSON.stringify(value));
        }
      });
      return inner_list.join(", ");
    }
  },
  methods:{
    ...mapMutations([
        'setTrueShowAminoacidVariantEpi', 'setFalseShowAminoacidVariantEpi', 'setEpitopeAminoacidFields', 'setFalseDisableSelectorEpitopePart'
    ]),
    ...mapActions(['setEpiDropDownSelected', 'setAminoacidConditionsSelected']),
    closeAminoEpiMenu(){
      this.setFalseShowAminoacidVariantEpi();
      this.clearAminoEpiMenu();
      this.clearEpiQueryFromAmino();
      this.setFalseDisableSelectorEpitopePart();
    },
    clearAminoEpiMenu(){
      this.epitopeAminoacidFields.forEach(elem => {
            //this.setEpiDropDownSelected({field: elem.field, list: []});
            this.setAminoacidConditionsSelected({field: elem.field, list: []});
          }
      )
      //this.setEpiDropDownSelected({field: 'startExtVariant', list: []});
      this.setAminoacidConditionsSelected({field: 'startExtVariant', list: []});
      //this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});
      this.setAminoacidConditionsSelected({field: 'stopExtVariant', list: []});
    },
    clearEpiQueryFromAmino(){
      this.epitopeAminoacidFields.forEach(elem => {
            this.setEpiDropDownSelected({field: elem.field, list: []});
          }
      )
      this.setEpiDropDownSelected({field: 'startExtVariant', list: []});
      this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});
    },
    applyAminoacidConditions(){
      Object.entries(this.aminoacidConditions).forEach(item => {
          this.setEpiDropDownSelected({field: item[0], list:item[1]});
      });
      this.epitopeAminoacidFields.forEach(elem => {
        if(Object.entries(this.aminoacidConditions).some(item => item[0] === elem.field)){
        }
        else{
          this.setEpiDropDownSelected({field: elem.field, list: []});
        }
      });
      if(!this.aminoacidConditions['startExtVariant']){
        this.setEpiDropDownSelected({field: 'startExtVariant', list: []});
      }
      if(!this.aminoacidConditions['stopExtVariant']){
        this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});
      }
    },
    modifyKey(key){
       let modifiedKey = '';
       if(key === 'variant_aa_type'){
         modifiedKey = 'variant_type';
       }
       else if(key === 'sequence_aa_original'){
         modifiedKey = 'original_amino_acid';
       }
       else if(key === 'sequence_aa_alternative'){
         modifiedKey = 'alternative_amino_acid';
       }
       else if(key === 'startExtVariant'){
         modifiedKey = 'variant_pos_range_start';
       }
       else if(key === 'stopExtVariant'){
         modifiedKey = 'variant_pos_range_stop';
       }
       else{
         modifiedKey = key;
       }

       return modifiedKey;
     },
  },
  watch: {
    compound_query(){
      //this.closeAminoEpiMenu();
    }
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
    background-color: #ebebeb;
    max-width: 70%;
    border-radius: 15px !important;
    margin-top: 20px;
    margin-bottom: 20px;
    }

  .EpitopeSelectors{
    margin-bottom: 10px;
  }

  .label {
    font-size: 1.3em;
    font-weight: bold;
    padding: 12px;
  }

</style>