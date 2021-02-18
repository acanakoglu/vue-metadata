<template>
  <v-card class="EpitopeCard">

      <v-tabs color="#ebebeb" v-model="selectedTab">
        <v-tabs-slider color="rgb(201, 53, 53)"  style="height: 5px"></v-tabs-slider>
          <v-tab>
              Use IEDB epitopes
          </v-tab>
          <v-tab>
               Try new epitope
          </v-tab>

          <v-tab-item>
                  <v-container fluid grid-list-xl class="EpitopeMenu">
                    <v-layout wrap align-center >

                      <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
                        <h2>Epitope Search</h2>
                      </v-flex>

                      <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
                        <h3 style="color:red"  v-if="epiSearchDis">{{requirement}}</h3>
                      </v-flex>

                      <v-flex class="no-horizontal-padding xs12 sm6 md4 lg2 d-flex EpitopeSelectors"
                              v-for="fieldEpi in epitopeFields" v-bind:key="fieldEpi.text">
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
                              <EpitopeSelectorPercentage
                                  v-if="fieldEpi.is_percentage"
                                  :text="fieldEpi.text"
                                  :field="fieldEpi.field">
                              </EpitopeSelectorPercentage>
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
                    <v-layout wrap  style="margin-top: 20px">
                      <v-spacer></v-spacer>
                     <v-btn :disabled="disableSelectorEpitopePart || epiSearchDis"
                         @click="resetEpiQuery"
                            color="rgb(122, 139, 157)" style="color: white">CLEAR EPITOPE QUERY</v-btn>
                  </v-layout>
                  </v-container>

                  <EpitopeTable></EpitopeTable>
          </v-tab-item>
          <v-tab-item>
            <AddNewEpitope></AddNewEpitope>
          </v-tab-item>
      </v-tabs>

  </v-card>
</template>

<script>
import axios from "axios";
import {mapGetters, mapMutations, mapState} from "vuex";
import EpitopeSelectorText from "./EpitopeSelectorText"
import EpitopeSelectorNum from "./EpitopeSelectorNum"
import EpitopeSelectorPercentage from "./EpitopeSelectorPercentage"
import EpitopeTable from "./EpitopeTable";
import AddNewEpitope from "./AddNewEpitope";
import {poll} from "../utils";

export default {
  name: "Epitope",
  components: {
    AddNewEpitope,
    EpitopeTable,
    EpitopeSelectorText,
    EpitopeSelectorNum,
    EpitopeSelectorPercentage,
  },
  data() {
    return {
      /*epitopeFields :[{text:'Protein Name', field:'protein_ncbi_id', is_numerical: false, is_percentage: false, description: 'a'},
                      {text:'Assay (T/B Cell)', field:'cell_type', is_numerical: false, is_percentage: false, description: 'b'},
                      {text:'HLA restriction', field:'mhc_class', is_numerical: false, is_percentage: false,  description: 'c'},
                      {text:'Linear / Non Linear', field:'is_linear', is_numerical: false, is_percentage: false, description: 'd'},
                      {text:'Response Freq', field:'response_frequency', is_numerical:false, is_percentage: true, description: 'e'},
                      {text:'Position Range', field:'position_range', is_numerical: true , is_percentage: false, description: 'f'},
      ],*/
      epitopeFields: [],
      requirement: 'A single Host and a single Virus are required',
      selectedTab: 0
    }
  },
  computed: {
    ...mapState(['disableSelectorEpitopePart', 'countEpi', 'epitopeAdded',
      'epiQuerySel', 'disableSelectorUserNewEpitopePart', 'disableSelectorEpitopePart']),
    ...mapGetters({
      epiSearchDis: 'epiSearchDisabled',
      compound_query: 'build_query'
    }),
  },
   methods: {
     ...mapMutations(['resetEpiQuery', 'setCountEpi', 'setFalseDisableSelectorUserNewEpitopePart',
       'setFalseShowAminoacidVariantUserNewEpi', 'setFalseDisableSelectorEpitopePart', 'setFalseShowAminoacidVariantEpi']),
     toSend(){
      let res = {};
      Object.assign(res,{"compound_query": this.compound_query},
                        {"epi_query": this.epiQuerySel});
      return res;
    },
   },
  watch:{
    countEpi(){
      if(this.selectedTab === 1){
        this.setCountEpi(this.epitopeAdded.length);
      }
    },
    selectedTab(){
      if(this.selectedTab === 1){

        if(this.disableSelectorEpitopePart){
          this.setFalseDisableSelectorEpitopePart();
          this.setFalseShowAminoacidVariantEpi();
        }

        this.setCountEpi(this.epitopeAdded.length);
      }
      else{

        if(this.disableSelectorUserNewEpitopePart){
          this.setFalseDisableSelectorUserNewEpitopePart();
          this.setFalseDisableSelectorEpitopePart();
          this.setFalseShowAminoacidVariantUserNewEpi();
        }

        if(!this.epiSearchDis) {
          let to_send = this.toSend();
          this.setCountEpi(null);
          let count_url = 'epitope/count';

          axios.post(count_url, to_send)
              .then((res) => {
                return res.data
              })
              .then((res) => {
                poll(res.result, (res) => {
                  if (res != null) {
                    this.setCountEpi(res[0].count);
                  }
                })
              })
        }
        else{
          this.setCountEpi(0);
        }
      }
    }
  },
  created() {
      const url = `epitope`;

      this.epitopeFields = [];

      axios.get(url)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.epitopeFields = res.fields;
          });
  }
}
</script>

<style scoped>

  .EpitopeMenu{
    border : 1px solid black;
    background-color: #ebebeb;
    max-width: 80%;
    margin-bottom: 50px;
    border-radius: 15px !important;
    margin-top: 50px;
    }

  .EpitopeSelectors{
    margin-bottom: 10px;
  }

  .info-icon {
    font-size: 15px;
  }

  .info-button {
    width: 10px;
  }

  .EpitopeCard{
    background:#fafafa;
    padding-bottom: 100px;
  }

</style>