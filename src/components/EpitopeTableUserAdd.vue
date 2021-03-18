<template>
  <div>

    <v-dialog max-width="500" @keydown.esc="alertDialog = false" v-model="alertDialog"  >
        <v-card>
        <v-card-text>
          Please disable the pop-up blocker for this page, to open the VirusViz directly nextime.
          <br>
          In order to open the VirusViz this time, please <a :href='alertLink' target="_blank">click me</a>.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="alertDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container fluid grid-list-xs>
      <v-layout justify-space-between row>
          <v-flex sm3 align-self-center>
            <v-btn @click="downloadTable()"
                   class="white--text"
                       small
                   color="rgb(122, 139, 157)"
                      :disabled="isLoading || epitopeAdded.length===0">
              Download Table</v-btn>
          </v-flex>
          <v-flex sm2 align-self-center></v-flex>
          <v-flex sm3 align-self-center>
              <v-dialog width="500" v-model="dialogOrder" persistent>
                  <v-card>
                      <v-card-title
                              class="headline"
                              style="background-color: rgb(201, 53, 53) ; color: white"
                      >
                          Field order
                          <v-spacer></v-spacer>
                          <v-checkbox v-model="sortCheckbox" @change="selectAllHeaders()"
                                      :label="sortCheckBoxLabel" color="white"></v-checkbox>
                          <v-btn
                                  color="white"
                                  flat
                                  @click="dialogOrder = false"
                          >
                              Close
                          </v-btn>
                          <v-btn color="white"
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
                                  <v-checkbox :label=element.text v-model=element.show color= "rgb(201, 53, 53)"></v-checkbox>
                              </v-list>
                          </draggable>
                      </v-card-text>
                      <v-divider></v-divider>
                  </v-card>
                  <v-btn dark
                         slot="activator"
                         small
                         color="rgb(122, 139, 157)"
                  >
                      Select/Sort fields
                  </v-btn>
              </v-dialog>
          </v-flex>
      </v-layout>
    </v-container>


    <v-card>
      <v-layout wrap align-center >
        <v-data-table
                :headers="selected_headers"
                :items="result"
                :loading="isLoading || newEpitopeLoading"
                class="data-table"
        >
            <template slot="items" slot-scope="props">
                <td style="white-space:pre-wrap; word-wrap:break-word" v-for="header in selected_headers"
                    :key="header.value" v-show="header.show">

                    <span v-if="header.value === 'num_seq'">
                        <a @click="sendDataToSeqEpiTable(props.item)" target="_blank">{{props.item[header.value]}}</a>
                    </span>

                  <span v-else-if="header.value === 'position_range'">{{props.item['position_range_to_show']}}</span>

                    <span v-else-if="header.value === 'virusViz_button'">

                      <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                             :disabled="props.item['num_seq'] === 0"
                              @click="openDialogVirusViz(props.item, props.item['num_seq'])">
                        <v-img style="margin-right: 5px; min-width: 15px;"
                               src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                        VirusViz
                      </v-btn>
                        <!--<v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                                 @click="virusVizClicked(props.item)" :disabled="props.item['num_seq'] === 0">
                            <v-img style="margin-right: 5px" src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                            VirusViz
                        </v-btn>
                        -->

                    </span>

                    <span v-else>{{props.item[header.value]}}</span>

                </td>
            </template>
            <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading && !newEpitopeLoading">
                  Sorry, nothing to display here :(
              </v-alert>
              <v-alert slot="no-data" :value="true" style="opacity:0.6;" color="rgb(122, 139, 157)" icon="info" v-else>
                  Loading
              </v-alert>
        </v-data-table>

        <v-dialog
          v-model="dialogVirusviz"
          width="500"
          persistent>
        <v-card>
          <v-card-title
              class="headline"
              style="background-color:rgb(201, 53, 53) ; color: white">
            Open in VirusViz
          </v-card-title>
          <v-progress-linear height="2" color = "rgb(201, 53, 53)" ></v-progress-linear>

          <v-card-text>
            <p>
              You selected
              <span v-if="sendToDialogVirusViz.num_seq">{{sendToDialogVirusViz.num_seq}}</span>
              <span v-else> ... </span>
              sequence<span v-if="sendToDialogVirusViz.num_seq > 1">s</span>,
              they must be formatted and then opened by the VirusViz
              tool.
              This may take time, and your browser could crash if the file is too large.
            <p>
              By checking “FULL” you will open full FASTA sequences and nucleotide / amino acid variants, this is
              usually well supported with 5K sequences or less.
            </p>
            <p>
              By checking “AA Mutations only” you will only open amino acid variants, this option requires less
              memory and is usually well supported with 30K sequences or less.
            </p>

          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                   @click="virusVizClicked(sendToDialogVirusViz.epitope); dialogVirusviz = false;">
              <v-img style="margin-right: 5px; min-width: 15px;"
                     src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
              VirusViz (Full)
            </v-btn>
            <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                   @click="virusVizClicked(sendToDialogVirusViz.epitope, true); dialogVirusviz = false;">
              <v-img style="margin-right: 5px; min-width: 15px;"
                     src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
              VirusViz (AA mutations only)
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                color="rgb(122, 139, 157)"
                style="color: white"
                text
                @click="dialogVirusviz = false;"
            >
              Close
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>

      </v-layout>

      <SequencesEpiTableUser></SequencesEpiTableUser>

    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import {mapGetters, mapMutations, mapState} from "vuex";
import draggable from 'vuedraggable'
import {FULL_TEXT, poll} from "../utils";
import SequencesEpiTable from "./SequencesEpiTable";
import AminoacidVariantEpi from "./AminoacidVariantEpi";
import SequencesEpiTableUser from "./SequencesEpiTableUser";

const itemSourceIdName = 'iedb_epitope_id';

export default {
  name: "EpitopeTableUserAdd",
  components: {
    SequencesEpiTableUser,
    AminoacidVariantEpi,
    SequencesEpiTable,
    draggable},
  data() {
    return {
      alertLink: null,
      alertDialog: false,
      isLoading : true,
      result: [],
      requirement: 'A single Host and a single Virus are required',
      is_control : false,
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
      dialogVirusviz: false,
      sendToDialogVirusViz: {
        epitope_id : null,
        num_seq : null,
      }
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel', 'countSeq', 'countSeq2', 'countSeq3', 'countSeq4' ,'countEpi', 'showSequenceEpiTable',
      'chosenEpitope', 'showAminoacidVariantEpi', 'aminoacidConditions', 'epitopeAminoacidFields', 'epitopeAdded',
        'newEpitopeLoading'
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
    openDialogVirusViz(epitope, num_seq){
      this.dialogVirusviz = true;
      this.sendToDialogVirusViz.epitope = epitope;
      this.sendToDialogVirusViz.num_seq = num_seq;
    },
    virusVizClicked(prop, aa_only = false){
        let orderDir = "";

        let to_send = prop['compound_query'];

          let url = `viz/submit?aa_only=${aa_only}&&is_control=${this.is_control}&page=${this.pagination.page}&num_elems=${this.pagination.rowsPerPage}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}`;
          if (this.selectedProduct !== FULL_TEXT) {
              url += `&annotation_type=${this.selectedProduct}`;
          }

          let epitope_info = {};
          epitope_info['epitope_name'] = prop['epitope_name'];
          epitope_info['position_range'] = prop['position_range_to_show'];
          epitope_info['protein'] = prop['product'];
          epitope_info['link'] = '';

          to_send['userEpitope'] = epitope_info;

          axios.post(url, to_send)
              .then((res) => {
                  return res.data
              })
              .then((res) => {
                let appUrl = window.location.origin + window.location.pathname
                let virusVizPollUrl = appUrl;
                virusVizPollUrl = virusVizPollUrl.replace(/\/+$/,'')
                virusVizPollUrl += "/api/poll/";
                virusVizPollUrl += res.result;
                let virusVizUrl = "http://genomic.deib.polimi.it/virusviz/static/#!/home?";
                const appName = "ViruSurf";
                virusVizUrl += `appName=${appName}&`;
                virusVizUrl += `appURL=${appUrl}&`;
                virusVizUrl += `dataURL=${virusVizPollUrl}&`;
                const newWindow = window.open(virusVizUrl);
                if(!newWindow){
                  this.alertDialog = true;
                  this.alertLink = virusVizUrl
                }

              }).catch(function (error) {
                alert(error.response.data.message);
              });

    },
    getHeaders() {
      const predefinedHeaders = [
          {text: 'Epitope Name', value: 'epitope_name', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'VirusViz', value: 'virusViz_button', sortable: false, show: true, to_send: false, can_be_shown: true},
          {text: 'Virus Name', value: 'taxon_name', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Host Name', value: 'host_taxon_name', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Protein', value: 'product', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Position Range', value: 'position_range', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Num Mut Seq', value: 'num_seq', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Num Var', value: 'num_var', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Mutated Freq.', value: 'mutated_freq', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Mutated Seq Ratio (meta)', value: 'mutated_seq_ratio', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
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
                        {"table_headers": table_headers_to_send});
      return res;
    },
    loadTable(){
      if(!this.epiSearchDis) {
        this.isLoading = true;
        let to_send = this.toSend();
        /*const url = `epitope/epiTableUserAdd`
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              poll(res.result, (res) => {

              })
            })*/
      }
      this.isLoading = false;
    },
    loadCountSeq2(){
      this.received_count_seq = false;
      this.setCountSeq2(null);

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
    },
    loadEveything(){
      //if(this.compound_query['gcm'].host_taxon_name && this.compound_query['gcm'].taxon_name ) {
        //this.loadCountSeq2();
        //this.loadCountEpi();
        this.loadTable();
      //}
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
        selected_headers.forEach(function (el) {
          if(el.value !== 'virusViz_button')
                fields.push(el.text);
        });
        selected_headers.forEach(function (el) {
          if(el.value !== 'virusViz_button')
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
  watch: {
    compound_query() {
      this.loadEveything();
    },
    countSeq2(){
      if(this.countSeq2 !== null) {
        this.loadTable();
      }
    },
    epitopeAdded(){
      this.result = this.epitopeAdded;
      this.isLoading = false;
    },
    newEpitopeLoading(){
      if(this.newEpitopeLoading){
        this.result = [];
      }
    }
  }
}
</script>

<style scoped>

  .data-table{
    width: 100%;
  }

  .brown-label label {
        color: #D2691E !important;
  }


</style>