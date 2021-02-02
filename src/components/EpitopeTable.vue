<template>
  <div>
    <v-container fluid grid-list-xs>
      <v-layout justify-space-between row>
          <v-flex sm3 align-self-center>
            <v-btn @click="openShowAminoacidVariantEpi()"
                       color="info"
                      :disabled="epiSearchDis">
              Add condition on amino acids</v-btn>
          </v-flex>
          <v-flex sm2 align-self-center></v-flex>
          <v-flex sm3 align-self-center></v-flex>
      </v-layout>
      <AminoacidVariantEpi v-if="showAminoacidVariantEpi"></AminoacidVariantEpi>
    </v-container>

    <v-container fluid grid-list-xs>
      <v-layout justify-space-between row>
          <v-flex sm3 align-self-center>
            <v-btn @click="downloadTable()"
                   class="white--text"
                       small color="blue lighten-2"
                      :disabled="epiSearchDis || isLoading">
              Download Table</v-btn>
          </v-flex>
          <v-flex sm2 align-self-center></v-flex>
          <v-flex sm3 align-self-center>
              <v-dialog width="500" v-model="dialogOrder">
                  <v-card>
                      <v-card-title
                              class="headline blue lighten-4"
                              primary-title
                      >
                          Field order
                          <v-spacer></v-spacer>
                          <v-checkbox v-model="sortCheckbox" @change="selectAllHeaders()"
                                      :label="sortCheckBoxLabel"></v-checkbox>
                          <v-btn
                                  color="primary"
                                  flat
                                  @click="dialogOrder = false"
                          >
                              Close
                          </v-btn>
                          <v-btn color="primary"
                                 flat
                                 @click="resetHeadersOrder()"
                          >
                              Reset
                          </v-btn>
                      </v-card-title>
                      <v-card-text>
                          <p>Drag and drop field names in the desired position.
                              Check or uncheck fields to re-define table content.
                              Press APPLY to go back to the result window.</p>
                          <draggable v-model="headers_can_be_shown" @start="drag=true" @end="drag=false">
                              <v-list v-for="element in headers_can_be_shown" :key="element.value">
                                  <v-checkbox :label=element.text v-model=element.show></v-checkbox>
                              </v-list>
                          </draggable>
                      </v-card-text>
                      <v-divider></v-divider>
                  </v-card>
                  <v-btn dark
                         slot="activator"
                         small color="blue lighten-2"
                  >
                      Select/Sort fields
                  </v-btn>
              </v-dialog>
          </v-flex>
      </v-layout>
    </v-container>


    <v-card>
      <h3 style="color:red" v-if="epiSearchDis">{{requirement}}</h3>
      <v-layout wrap align-center >
        <v-data-table
                :headers="selected_headers"
                :items="result"
                :loading="isLoading"
                class="data-table"
        >
      <!--:pagination.sync="pagination"
                :rows-per-page-items="pagination.rowsPerPageItems"
                :total-items="pagination.totalItems" -->
            <template slot="items" slot-scope="props">
                <td style="white-space:pre-wrap; word-wrap:break-word" v-for="header in selected_headers"
                    :key="header.value" v-show="header.show"  v-if="!epiSearchDis">

                    <span v-if="header.value === 'num_seq'">
                        <a @click="sendDataToSeqEpiTable(props.item['epitope_id'])" target="_blank">{{props.item[header.value]}}</a>
                    </span>

                    <span v-else-if="header.value === 'position_range'">{{props.item['position_range_to_show']}}</span>

                    <span v-else>{{props.item[header.value]}}</span>

                </td>
            </template>
            <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading">
                  Sorry, nothing to display here :(
              </v-alert>
              <v-alert slot="no-data" :value="true" color="info" icon="info" v-else>
                  Loading
              </v-alert>
        </v-data-table>

      </v-layout>

      <SequencesEpiTable></SequencesEpiTable>

    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import {mapGetters, mapMutations, mapState} from "vuex";
import draggable from 'vuedraggable'
import {poll} from "../utils";
import SequencesEpiTable from "./SequencesEpiTable";
import AminoacidVariantEpi from "./AminoacidVariantEpi";

const itemSourceIdName = 'epitope_id';

export default {
  name: "EpitopeTable",
  components: {
    AminoacidVariantEpi,
    SequencesEpiTable,
    draggable},
  data() {
    return {
      isLoading : true,
      result: [],
      requirement: 'A single Host and a single Virus are required',
      is_control : false,
      precision_float_table: 5,
      sortCheckbox: false,
      headers: this.getHeaders(),
      dialogOrder: false,
      sortable: true,
      headers_can_be_shown: this.getShownHeaders(),
      received_count_seq: true,
      pagination: {
          descending: false,
          page: 1,
          rowsPerPage: 10,
          sortBy: itemSourceIdName,
          totalItems: 0,
          rowsPerPageItems: [10, 100, 1000] //mani che si alzano
      },
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel', 'countSeq', 'countSeq2', 'countSeq3', 'countSeq4' ,'countEpi', 'showSequenceEpiTable',
      'chosenEpitope', 'showAminoacidVariantEpi', 'aminoacidConditions', 'epitopeAminoacidFields'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      epiSearchDis: 'epiSearchDisabled',
      panels:'panels',
    }),
    selected_headers: {
      get() {
        var x;
        var res = [];
        for (x in this.headers_can_be_shown) {
          if (this.headers_can_be_shown[x].show) {
            res.push(this.headers_can_be_shown[x]);
          }
        }
        return res;
      },
      set(value) {
        if (value.length > 0) {
            this.selected_headers = [...this.headers_can_be_shown.filter(item => item.show === true)]
        } else this.selected_headers = []
      }
    },
    sortCheckBoxLabel() {
      if (this.sortCheckbox)
          return "Deselect all";
      else return "Select all"
    },
  },
  methods: {
    ...mapMutations([
        'setCountEpi', 'setCountSeq', 'setCountSeq2', 'setCountSeq3', 'setCountSeq4',
      'showSeqEpiTable', 'setChosenEpitope', 'setTrueShowAminoacidVariantEpi',
      'setFalseShowAminoacidVariantEpi', 'setTrueDisableSelectorEpitopePart'
    ]),
    getHeaders() {
      const predefinedHeaders = [
          {text: 'Epitope ID', value: 'epitope_id', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Virus Name', value: 'taxon_name', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Host Name', value: 'host_taxon_name', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Protein', value: 'product', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Assay', value: 'cell_type', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'HLA restriction', value: 'mhc_allele', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'MHC class', value: 'mhc_class', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Resp. Freq.', value: 'response_frequency_pos', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Epitope Seq.', value: 'epi_fragment_sequence', sortable: false, show: true, to_send: true, can_be_shown: true},
          /*{text: 'Variant Position', value: 'start_aa_original', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Variant Type', value: 'variant_aa_type', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Variant Length', value: 'variant_aa_length', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Original Aminoacid Sequence', value: 'sequence_aa_original', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Alternative Aminoacid Sequence', value: 'sequence_aa_alternative', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},*/
          {text: 'Epitope Start', value: 'epi_annotation_start', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Epitope Stop', value: 'epi_annotation_stop', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Epitope Start', value: 'epi_frag_annotation_start', sortable: false, show: false, to_send: true, can_be_shown: false},
          {text: 'Epitope Stop', value: 'epi_frag_annotation_stop', sortable: false, show: false, to_send: true, can_be_shown: false},
          //{text: 'All Epitope Fragments', value: 'all_fragment_position', sortable: false, show: false, to_send: true, can_be_shown: false}, //ONLY FOR VERSION 2 TABLE
          {text: 'Position Range', value: 'position_range', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Is Linear', value: 'is_linear', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Num Seq', value: 'num_seq', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Num Var', value: 'num_var', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Mutated Freq.', value: 'mutated_freq', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Mutated Seq Ratio (meta)', value: 'mutated_seq_ratio2', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          //{text: 'Mutated Seq Ratio meta+epi', value: 'mutated_seq_ratio4', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          //{text: 'Mutated Seq Ratio meta+amino', value: 'mutated_seq_ratio3', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          //{text: 'Mutated Seq Ratio meta+epi+amino', value: 'mutated_seq_ratio', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
      ];
      return predefinedHeaders;
    },
    toSend(){
      let table_headers_to_send = [];
      this.headers.forEach(item => {
        if(item['to_send']) {
          table_headers_to_send.push(item['value']);
        }
      })
      let res = {};
      Object.assign(res,{"compound_query": this.compound_query},
                        {"epi_query": this.epiQuerySel},
                        {"table_headers": table_headers_to_send});
      return res;
    },
    loadTable(){
      if(!this.epiSearchDis) {

        let orderDir = "";
        if (this.pagination.descending)
            orderDir = "DESC";
        else
            orderDir = "ASC";

        this.result = [];
        this.isLoading = true;
        //console.log("RELOAD table");
        let to_send = this.toSend();
        const url2 = `epitope/epiTableResLimit?page=${this.pagination.page}&num_elems=${this.pagination.rowsPerPage}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}`
        const url = `epitope/epiTableRes1`
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              poll(res.result, (res) => {
                let vals = res.values;
                vals.forEach(item => {
                  for (let k in item) {
                    if (item.hasOwnProperty(k)) {
                      let key = k;
                      let values = item[k];
                      if (values.length !== undefined && key !== 'epi_frag_annotation_start' && key !== 'epi_frag_annotation_stop' && key !== 'epi_fragment_sequence') {
                        if (values.length === 1) {
                          if (item[k][0] != null) {
                            if (key === "mhc_allele") {
                              let str = item[k][0];
                              let regex = /[,]/g;
                              let subst = "$&\n";
                              let result_str = str.replace(regex, subst);
                              item[k] = result_str;
                            } else {
                              item[k] = item[k][0];
                            }
                          } else {
                            item[k] = "N/D";
                          }
                        } else {
                          let to_replace = "";
                          let i = 0;
                          while (i < values.length) {
                            to_replace += item[k][i];
                            i++;
                            if (i !== values.length) {
                              to_replace += ",\n";
                            }
                          }
                          item[k] = to_replace;
                        }
                      } else if (key === 'epi_fragment_sequence') {

                        let position = "";
                        let sequence = "";
                        let str_sequence = item[k];
                        let str_start_epi = item['epi_frag_annotation_start'];
                        let str_stop_epi = item['epi_frag_annotation_stop'];

                        let array_sequence = this.getArrayFromTupleTable(str_sequence);
                        let array_start = this.getArrayFromTupleTable(str_start_epi);
                        let array_stop = this.getArrayFromTupleTable(str_stop_epi);

                        let len = array_sequence.length;
                        let i = 0;
                        while (i < len) {
                          if (i === 0) {
                            item['position_range'] = array_start[i];
                          }
                          position += array_start[i];
                          position += "-";
                          position += array_stop[i];
                          sequence += array_sequence[i];
                          i++;
                          if (i !== len) {
                            position += ",\n";
                            sequence += ",\n";
                          }
                        }
                        item['position_range_to_show'] = position;
                        item[k] = sequence;
                      }
                    }
                  }
                  item['mutated_freq'] = item['num_var'] / item['num_seq'];
                  item['mutated_freq'] = item['mutated_freq'].toPrecision(this.precision_float_table);
                  //item['mutated_seq_ratio'] = (item['num_seq'] / this.countSeq) * 100;
                  item['mutated_seq_ratio2'] = (item['num_seq'] / this.countSeq2) * 100;
                  //item['mutated_seq_ratio3'] = (item['num_seq'] / this.countSeq3) * 100;
                  //item['mutated_seq_ratio4'] = (item['num_seq'] / this.countSeq4) * 100;
                  /*if (item['mutated_seq_ratio'] >= 10) {
                    item['mutated_seq_ratio'] = item['mutated_seq_ratio'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio'] = item['mutated_seq_ratio'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio'] += ' %';*/
                  if (item['mutated_seq_ratio2'] >= 10) {
                    item['mutated_seq_ratio2'] = item['mutated_seq_ratio2'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio2'] = item['mutated_seq_ratio2'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio2'] += ' %';
                  /*if (item['mutated_seq_ratio3'] >= 10) {
                    item['mutated_seq_ratio3'] = item['mutated_seq_ratio3'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio3'] = item['mutated_seq_ratio3'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio3'] += ' %';
                  if (item['mutated_seq_ratio4'] >= 10) {
                    item['mutated_seq_ratio4'] = item['mutated_seq_ratio4'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio4'] = item['mutated_seq_ratio4'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio4'] += ' %';*/

                })
                if (this.received_count_seq) {
                  this.result = vals;
                  this.isLoading = false;
                } else {
                  this.result = [];
                  this.isLoading = true;
                }
              })
            })
      }
    },
    loadTable2(){
      if(!this.epiSearchDis) {

        let orderDir = "";
        if (this.pagination.descending)
            orderDir = "DESC";
        else
            orderDir = "ASC";

        this.result = [];
        this.isLoading = true;
        //console.log("RELOAD table");
        let to_send = this.toSend();
        const url = `epitope/epiTableRes2`
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              poll(res.result, (res) => {
                let vals = res.values;
                vals.forEach(item => {
                  for (let k in item) {
                    if (item.hasOwnProperty(k)) {
                      let key = k;
                      let values = item[k];
                      if (values.length !== undefined && key !== 'epi_frag_annotation_start' && key !== 'epi_frag_annotation_stop' && key !== 'epi_fragment_sequence' && key !== 'all_fragment_position') {
                        if (values.length === 1) {
                          if (item[k][0] != null) {
                            if (key === "mhc_allele") {
                              let str = item[k][0];
                              let regex = /[,]/g;
                              let subst = "$&\n";
                              let result_str = str.replace(regex, subst);
                              item[k] = result_str;
                            } else {
                              item[k] = item[k][0];
                            }
                          } else {
                            item[k] = "N/D";
                          }
                        } else {
                          let to_replace = "";
                          let i = 0;
                          while (i < values.length) {
                            to_replace += item[k][i];
                            i++;
                            if (i !== values.length) {
                              to_replace += ",\n";
                            }
                          }
                          item[k] = to_replace;
                        }
                      } else if (key === 'all_fragment_position') {
                        let position = "";
                        let sequence = "";
                        let array_all = item[key][0];
                        let array_len = array_all.length;
                        let array_sequence = [];
                        let array_start = [];
                        let array_stop = [];
                        array_all.forEach(item => {
                          let len = item.length;
                          item = item.substring(1,len-1);
                          let arr = item.split(',');
                          array_sequence.push(arr[1])
                          array_start.push(arr[2])
                          array_stop.push(arr[3])
                        })
                        let i = 0;
                        while(i < array_len){
                          sequence += array_sequence[i];
                          position += array_start[i];
                          position += "-";
                          position += array_stop[i];
                          i++;
                          if(i !== array_len){
                            position += ",\n";
                            sequence += ",\n";
                          }
                        }
                        item['position_range_to_show'] = position;
                        item['epi_fragment_sequence'] = sequence;
                      }
                    }
                  }
                  item['mutated_freq'] = item['num_var'] / item['num_seq'];
                  item['mutated_freq'] = item['mutated_freq'].toPrecision(this.precision_float_table);
                  //item['mutated_seq_ratio'] = (item['num_seq'] / this.countSeq) * 100;
                  item['mutated_seq_ratio2'] = (item['num_seq'] / this.countSeq2) * 100;
                  //item['mutated_seq_ratio3'] = (item['num_seq'] / this.countSeq3) * 100;
                  //item['mutated_seq_ratio4'] = (item['num_seq'] / this.countSeq4) * 100;
                  /*if (item['mutated_seq_ratio'] >= 10) {
                    item['mutated_seq_ratio'] = item['mutated_seq_ratio'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio'] = item['mutated_seq_ratio'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio'] += ' %';*/
                  if (item['mutated_seq_ratio2'] >= 10) {
                    item['mutated_seq_ratio2'] = item['mutated_seq_ratio2'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio2'] = item['mutated_seq_ratio2'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio2'] += ' %';
                  /*if (item['mutated_seq_ratio3'] >= 10) {
                    item['mutated_seq_ratio3'] = item['mutated_seq_ratio3'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio3'] = item['mutated_seq_ratio3'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio3'] += ' %';
                  if (item['mutated_seq_ratio4'] >= 10) {
                    item['mutated_seq_ratio4'] = item['mutated_seq_ratio4'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio4'] = item['mutated_seq_ratio4'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio4'] += ' %';*/

                })
                if (this.received_count_seq) {
                  this.result = vals;
                  this.isLoading = false;
                } else {
                  this.result = [];
                  this.isLoading = true;
                }
              })
            })
      }
    },
    getArrayFromTupleTable(str){
      let arr_final = [];
      let len = str.length;
      str = str.substring(2, len-2);
      let arr = str.split('","')

      arr.forEach(item => {
        let len2 = item.length;
        item = item.substring(1,len2-1);
        let arr2 = item.split(',');
        arr_final.push(arr2[1]);
      })
      return arr_final;
    },
    /*loadCountSeq(){       //meta+epi+amino
      this.received_count_seq = false;
      this.setCountSeq(null);

      let to_send = JSON.parse(JSON.stringify(this.compound_query));

      let epitope_conditions = JSON.parse(JSON.stringify(this.epiQuerySel));

      //let aminoacid_conditions = JSON.parse(JSON.stringify(this.aminoacidConditions)); // FOR APPLY
      if(this.chosenEpitope != null) {
        epitope_conditions['epitope_id'] = this.chosenEpitope;
      }

      //let epitope_and_aminoacid_conditions = Object.assign(aminoacid_conditions, epitope_conditions);   FOR APPLY

      if(!jQuery.isEmptyObject(epitope_conditions)) {     //FOR APPLY instead epitope_and_aminoacid_conditions
        to_send['epitope'] = epitope_conditions;
      }
        let count_url = `query/count?is_control=${this.is_control}`;
        axios.post(count_url, to_send)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.setCountSeq(res);
              this.received_count_seq = true;
          });
    },*/
    loadCountSeq2(){        //only meta
      this.received_count_seq = false;
      this.setCountSeq2(null);

      //let to_send = {};
      //Object.assign(to_send,{"compound_query": this.compound_query});
     let to_send = JSON.parse(JSON.stringify(this.compound_query));

      let count_url = `query/count?is_control=${this.is_control}`;
      axios.post(count_url, to_send)
        .then((res) => {
            return res.data;
        })
        .then((res) => {
            this.setCountSeq2(res);
            this.received_count_seq = true;
        });

      /*let count_url = 'epitope/countSeq';

        axios.post(count_url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              poll(res.result, (res) => {
                if (res != null) {
                  this.setCountSeq2(res[0].count);
                  this.received_count_seq = true;
                }
              })
            })*/
    },
    /*loadCountSeq3(){            //meta+amino
      this.received_count_seq = false;
      this.setCountSeq3(null);

      let to_send = JSON.parse(JSON.stringify(this.compound_query));

      let epitope_conditions = JSON.parse(JSON.stringify(this.aminoacidConditions));

      if(!jQuery.isEmptyObject(epitope_conditions)) {     //FOR APPLY instead epitope_and_aminoacid_conditions
        to_send['epitope'] = epitope_conditions;
      }
        let count_url = `query/count?is_control=${this.is_control}`;
        axios.post(count_url, to_send)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.setCountSeq3(res);
              this.received_count_seq = true;
          });
    },
    loadCountSeq4(){            //meta+epi
      this.received_count_seq = false;
      this.setCountSeq4(null);

      let to_send = JSON.parse(JSON.stringify(this.compound_query));

      let epitope_conditions = JSON.parse(JSON.stringify(this.epiQuerySel));

      for(var k in epitope_conditions) {
        if(this.epitopeAminoacidFields.some(elem => elem.field === k) || k==='startExtVariant' || k==='stopExtVariant'){
          delete epitope_conditions[k];
        }
      }

      if(this.chosenEpitope != null) {
        epitope_conditions['epitope_id'] = this.chosenEpitope;
      }

      if(!jQuery.isEmptyObject(epitope_conditions)) {     //FOR APPLY instead epitope_and_aminoacid_conditions
        to_send['epitope'] = epitope_conditions;
      }
        let count_url = `query/count?is_control=${this.is_control}`;
        axios.post(count_url, to_send)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.setCountSeq4(res);
              this.received_count_seq = true;
          });
    },*/
    loadCountEpi() {
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
                  this.pagination.totalItems = res[0].count;
                  this.pagination.page = 1;
                  this.setCountEpi(res[0].count);
                }
              })
            })
      }
      else{
        this.setCountEpi(0);
      }
    },
    loadEveything(){
      //this.loadCountSeq();
      this.loadCountSeq2();
      //this.loadCountSeq3();
      //this.loadCountSeq4();
      this.loadCountEpi();
      this.loadTable();
      //this.loadTable2();
    },
    sendDataToSeqEpiTable(item){
      this.showSeqEpiTable();
      this.setChosenEpitope(item);
    },
    selectAllHeaders() {
      if (this.sortCheckbox) {
          for (let i in this.headers_can_be_shown) {
              this.headers_can_be_shown[i].show = true
          }
      } else {
          for (let i in this.headers_can_be_shown) {
              this.headers_can_be_shown[i].show = false
          }
      }
    },
    resetHeadersOrder() {
        this.headers_can_be_shown= this.getShownHeaders();
    },
    getShownHeaders(){
        let headers = this.getHeaders();
        let x;
        let res = [];
        for (x in headers) {
          if (headers[x].can_be_shown) {
            res.push(headers[x]);
          }
        }
        return res;
    },
    openShowAminoacidVariantEpi(){
      this.setTrueShowAminoacidVariantEpi();
      this.setTrueDisableSelectorEpitopePart();
    },
    json2csv(input, selected_headers) {
        var json = input;
        var fields = [];
        var fields2 = [];
        if(!selected_headers.some(item => item.value === 'epitope_id')){
              fields.push('Epitope ID');
              fields2.push('epitope_id');
        }
        selected_headers.forEach(function (el) {
                fields.push(el.text);
        });
        selected_headers.forEach(function (el) {
                fields2.push(el.value);
        });
        var csv = json.map(function (row) {
            return fields2.map(function (fieldName) {
                let string_val ;
                if(fieldName !== 'position_range') {
                  string_val = String(row[fieldName]);
                }
                else {
                  string_val = String(row['position_range_to_show']);
                }
                string_val = string_val.replaceAll("\n", " ");
                return JSON.stringify(string_val);
            }).join(',')
        });
        csv.unshift(fields.join(','));

        return csv.join('\r\n')
    },
    downloadTable(){
      let text = this.json2csv(this.result, this.selected_headers);
      let filename = "result.csv";
      let element = document.createElement('a');
      element.setAttribute('download', filename);
      var data = new Blob([text]);
      element.href = URL.createObjectURL(data);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  },
  mounted() {
    this.loadEveything();
  },
  watch: {
    epiQuerySel() {
      this.loadEveything();
    },
    compound_query() {
      this.loadEveything();
    },
    /*countSeq(){
      if(this.countSeq !== null) {
        this.loadTable();
      }
    },*/
    countSeq2(){
      if(this.countSeq2 !== null) {
        this.loadTable();
        //this.loadTable2();
      }
    },
    /*countSeq3(){
      if(this.countSeq3 !== null) {
        this.loadTable();
      }
    },
    countSeq4(){
      if(this.countSeq4 !== null) {
        this.loadTable();
      }
    },*/
    pagination: {
        handler(val, oldVal) {
            if (JSON.stringify(val) !== JSON.stringify(oldVal))
              this.loadTable();
              //this.loadTable2();
        },
        deep: true
    },
  }
}
</script>

<style scoped>

  .data-table{
    width: 100%;
  }

</style>