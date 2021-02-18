<template>
  <v-container fluid grid-list-xl class="EpitopeMenu" >
    <v-layout wrap align-center>
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
       <v-btn @click="applyAminoacidConditions()" class="white--text" color="green">APPLY</v-btn>
       <v-btn @click="clearAminoEpiMenu()" class="white--text" color="orange">CLEAR</v-btn>
       <v-btn @click="closeAminoEpiMenu()"
                       class="white--text" color="red">CLEAR & CLOSE</v-btn>
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
  },
  watch: {
    compound_query(){
      this.closeAminoEpiMenu();
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
</style>