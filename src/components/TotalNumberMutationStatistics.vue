<template>
  <div class="text-center">
    <v-dialog
        persistent
        scrollable
      v-model="dialog"
      width="1300"
    >
      <v-card>
        <v-card-title class="headline" style="background-color:rgb(201, 53, 53) ; color: white">
          Total Mutation Statistics
          <v-spacer></v-spacer>
          <v-btn
            color="rgb(122, 139, 157)"
            style="color: white"
            text
            @click="exit()"
          >
            CLOSE
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-layout wrap align-center justify-center>
            <v-flex class="no-horizontal-padding xs12 sm6 md6 lg6 d-flex EpitopeSelectors">
              <v-layout align-center justify-center>
                <v-card style="width: 300px;">
                  <v-select
                    v-model="firstParameter"
                    :items="filterParam(1)"
                    :label= "labelFirstParameter"
                    single
                    :item-text="rename"
                    dense
                    outlined
                  >
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      <!-- Divider and Header-->
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content v-text="data.item"/>
                      </template>
                      <!-- Normal item -->
                      <template v-else>
                        <v-list-tile-content>
                          <v-list-tile-title>{{rename(data.item.name)}}</v-list-tile-title>
                        </v-list-tile-content>
                      </template>
                    </template>
                  </v-select>
                </v-card>
              </v-layout>
            </v-flex>
            <v-flex class="no-horizontal-padding xs12 sm6 md6 lg6 d-flex EpitopeSelectors">
              <v-layout align-center justify-center>
                <v-card style="width: 300px">
                  <v-select
                    v-model="secondParameter"
                    :items="filterParam(2)"
                    :label="labelSecondParameter"
                    single
                    :item-text="rename"
                    dense
                    outlined
                    :disabled = "this.firstParameterSetted === null"
                    clearable
                    @click:clear = "clearSecondParameter()"
                  >
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      <!-- Divider and Header-->
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content v-text="data.item"/>
                      </template>
                      <!-- Normal item -->
                      <template v-else>
                        <v-list-tile-content>
                          <v-list-tile-title>{{rename(data.item.name)}}</v-list-tile-title>
                        </v-list-tile-content>
                      </template>
                    </template>
                  </v-select>
                </v-card>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-layout wrap justify-center style="margin-top: 40px">
            <v-btn :disabled="this.firstParameterSetted === null" @click="applyTotMutStatistics()"
                   class="white--text" color="#00008B"
                    style="margin-bottom: 20px">APPLY</v-btn>
          </v-layout>


          <v-container fluid grid-list-xs v-if="showTable">
            <v-layout justify-space-between row>
                <v-flex sm3 align-self-center>
                  <v-btn @click="downloadTable()"
                         class="white--text"
                             small
                         color="rgb(122, 139, 157)"
                            :disabled="isLoading || Object.keys(this.headers).length <= 1">
                    Download Table</v-btn>
                </v-flex>
                <v-flex sm2 align-self-center>
                </v-flex>
                <v-flex sm3 align-self-center>
                </v-flex>
            </v-layout>
          </v-container>

          <v-data-table :loading="isLoading" :headers="headers"
                        :pagination.sync="pagination"
                        :rows-per-page-items="pagination.rowsPerPageItems"
                        :total-items="pagination.totalItems"
                        :items="result_statistics" item-key="name" v-if="showTable === true"
                        style="margin-bottom: 20px; margin-top: 10px; border: dimgrey solid 1px">


            <template v-if="headers" slot="headers" slot-scope="row">
              <tr>
                <th
                  v-for="header in row.headers"
                  :key="header.text"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '',
                  'font-weight-black', 'text-uppercase']"
                  @click="changeSort(header.value)"
                >
                  <v-icon small>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
            </template>


            <template slot="items" slot-scope="props">
              <td style="white-space:pre-wrap; word-wrap:break-word" v-for="header in headers"
                      :key="header.value" v-show="header.show" :title="header.text">

                <span v-if="header.value === 'Mutation'">{{props.item['AllMutation']}}</span>

                <span v-else>{{props.item[header.value]}}</span>
              </td>
            </template>

            <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading">
                    Sorry, nothing to display here :(
            </v-alert>
            <v-alert slot="no-data" :value="true" style="opacity:0.6;" color="rgb(122, 139, 157)" icon="info" v-else>
                Loading
            </v-alert>

          </v-data-table>


        </v-card-text>

      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import {poll, stopPoll} from "../utils";
import axios from "axios";

export default {
  name: "TotalNumberMutationStatistics",
  components: {},
  props: {
  },
  data(){
    return{
      dialog: false,
      pagination: {
        sortBy: 'Mutation',
        page: 1,
        rowsPerPage: 10
      },
      allParameters: [
        { header: 'GEOGRAPHY', group: 'GEO'},
        { name: 'Continent', group: 'GEO' },
        { name: 'Country', group: 'GEO' },
        { name: 'Region', group: 'GEO' },
        { divider: true, group: 'MUT' },
        { header: 'VARIANTS', group: 'MUT' },
        { name: 'Lineage', group: 'MUT' },
        { name: 'Clade', group: 'MUT' },
        { divider: true, group: 'TIME' },
        { header: 'DATE', group: 'TIME' },
        { name: 'Collection date as month', group: 'TIME' },
        { name: 'Collection date as year', group: 'TIME' },
      ],
      firstParameterSetted: null,
      secondParameterSetted: null,
      labelFirstParameter: "First Parameter",
      labelSecondParameter: "Second Parameter",
      showTable: false,
      my_interval_table: null,
      isLoading : false,
      headers: [],
      result_statistics: [],
      sortable: true,
    }
  },
  computed: {
    ...mapState([
      'showTotalMutationStatistics', 'chosenEpitope', 'epiQuerySel'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
    }),
    firstParameter: {
        get() {
          return this.firstParameterSetted;
        },
        set(value){
          this.showTable = false;
          if(value === undefined || value === null){
            this.firstParameterSetted = null;
          }
          else{
            this.firstParameterSetted = value;
          }
        }
    },
    secondParameter: {
        get() {
          return this.secondParameterSetted;
        },
        set(value){
          this.showTable = false;
          if(value === undefined || value === null){
            this.secondParameterSetted = null;
          }
          else{
            this.secondParameterSetted = value;
          }
        }
    },
  },
  methods: {
    ...mapMutations([
       'showTotMutStatistics','setChosenEpitope'
    ]),
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    downloadTable(){
      let text = this.json2csv(this.result_statistics);
      let filename = "result.csv";
      let element = document.createElement('a');
      element.setAttribute('download', filename);
      var data = new Blob([text]);
      element.href = URL.createObjectURL(data);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    json2csv(input) {
        var json = input;
        var fields = [];
        var fields2 = [];
        this.headers.forEach(function (el) {
          let val = el.text.replaceAll(",", "; ");
          fields.push(val);
        });
        this.headers.forEach(function (el) {
          fields2.push(el.value);
        });
        var csv = json.map(function (row) {
            return fields2.map(function (fieldName) {
                let string_val ;
                if(fieldName !== 'Mutation'){
                  string_val = String(row[fieldName]);
                }
                else{
                  string_val = String(row['AllMutation']);
                }
                return JSON.stringify(string_val);
            }).join(',')
        });
        csv.unshift(fields.join(','));
        return csv.join('\r\n')
    },
    applyTotMutStatistics(){
        this.showTable = true;
        this.loadTable();
    },
    loadTable(){

        if(this.my_interval_table !== null){
          stopPoll(this.my_interval_table);
        }

        this.headers = [];

        this.result_statistics = [];
        this.isLoading = true;

        const url = `epitope/totalMutationStatistics`

        let to_send = {};
        if(this.chosenEpitope != null && this.chosenEpitope['epitope_name']){
          to_send['compound_query'] = this.chosenEpitope['compound_query'];
          to_send['parameters'] = {firstParameter: this.firstParameterSetted, secondParameter: this.secondParameterSetted};
          to_send['epi_query'] = null;
          to_send['epitopeID'] = null;

        }
        else {
          to_send['compound_query'] = JSON.parse(JSON.stringify(this.compound_query));
          to_send['epi_query'] = JSON.parse(JSON.stringify(this.epiQuerySel));
          to_send['epitopeID'] = JSON.parse(JSON.stringify(this.chosenEpitope));
          to_send['parameters'] = {firstParameter: this.firstParameterSetted, secondParameter: this.secondParameterSetted};
        }

        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              this.my_interval_table = poll(res.result, (res) => {
                this.my_interval_table = null;

                this.headers = [
                    {text: 'Mutation', value: 'Mutation', sortable: this.sortable, show: true},
                    {text: 'Total', value: 'Total', sortable: this.sortable, show: true},
                ];

                let list_sum = {};
                let total = 0;
                let vals = res.values;
                let i = 0;
                let len = vals.length;

                let result = [];

                while(i<len){
                  let item = vals[i];
                  let text = "";
                  let j = 0;
                  for (var key in item) {
                    if(j!==0 && key!=="all_info"){
                      text += " ( ";
                    }
                    if (item.hasOwnProperty(key) && key !== "all_info") {
                      if(item[key] !== null && item[key] !== undefined) {
                        if((this.firstParameterSetted === "Collection date as month"
                            || this.secondParameterSetted === "Collection date as month") && key === "col_date"){
                          let substr = item[key].substring(0, item[key].lastIndexOf("-"));
                          text += substr;
                        }
                        else if((this.firstParameterSetted === "Collection date as year"
                            || this.secondParameterSetted === "Collection date as year") && key === "col_date"){
                          let substr = item[key].substring(0, item[key].indexOf("-"));
                          text += substr;
                        }
                        else {
                          text += item[key];
                          text = text.replaceAll(".", "_");
                        }
                      }
                      else{
                        text += "N/D";
                      }
                    }
                    if(j!==0 && key!=="all_info"){
                      text += " ) ";
                    }
                    j = j + 1;
                  }
                  let header = {};
                  header['text'] = text;
                  header['value'] = text;
                  header['sortable'] = this.sortable;
                  header['show'] = true;

                  list_sum[text] = 0;
                  this.headers.push(header);
                  i = i+1;
                }

                let i2 = 0;
                while(i2<len){
                  let item2 = vals[i2];
                  let text = "";
                  let j = 0;
                  for (var key in item2) {
                    if (j !== 0 && key !== "all_info") {
                      text += " ( ";
                    }
                    if (item2.hasOwnProperty(key) && key !== "all_info") {
                      if (item2[key] !== null && item2[key] !== undefined) {
                        if((this.firstParameterSetted === "Collection date as month"
                            || this.secondParameterSetted === "Collection date as month") && key === "col_date"){
                          let substr = item2[key].substring(0, item2[key].lastIndexOf("-"));
                          text += substr;
                        }
                        else if((this.firstParameterSetted === "Collection date as year"
                            || this.secondParameterSetted === "Collection date as year") && key === "col_date"){
                          let substr = item2[key].substring(0, item2[key].indexOf("-"));
                          text += substr;
                        }
                        else {
                          text += item2[key];
                          text = text.replaceAll(".", "_");
                        }
                      } else {
                        text += "N/D";
                      }
                    }
                    else if (item2.hasOwnProperty(key) && key === "all_info"){
                      let str = item2["all_info"];
                      let len2 = str.length;
                      str = str.substring(2,len2-2);
                      let arr = str.split('","');

                      arr.forEach(item3 => {
                          let len3 = item3.length;
                          item3 = item3.substring(1,len3-1);
                          let arr2 = item3.split(',');
                          let position = arr2[0];
                          let original = arr2[1];
                          let alternative = arr2[2];
                          let count = parseInt(arr2[3], 10);

                          let mutation = original + position + alternative;


                          if (result.some(el => el['AllMutation'] === mutation)){
                            result.forEach(function(el){
                              if(el['AllMutation'] === mutation){
                                el[text] = count;
                                el['Total'] = el['Total'] + count;
                                list_sum[text] = list_sum[text] + count;
                                total = total + count;
                              }
                            });
                          }
                          else {
                            let row = {};
                            this.headers.forEach(el => row[el.text] = 0);
                            row['Mutation'] = position;
                            row['AllMutation'] = mutation;
                            row['Original'] = original;
                            row['Alternative'] = alternative;
                            row['Total'] = count;
                            row[text] = count;
                            result.push(row);
                            list_sum[text] = list_sum[text] + count;
                            total = total + count;
                          }
                      })
                    }
                    if (j !== 0 && key !== "all_info") {
                      text += " ) ";
                    }
                    j = j + 1;
                  }
                  i2 = i2 + 1;
                }

                this.headers.forEach(function(el){
                  if(list_sum.hasOwnProperty(el.text)){
                    el.text = el.text + "\xa0\xa0\xa0[" + list_sum[el.text] + "] ";
                  }
                  else if(el.text === 'Total'){
                    el.text = el.text + "\xa0\xa0\xa0[" + total + "] ";
                  }
                });

                result = result.sort(function(a, b){
                  if (a.Mutation === b.Mutation) {
                      if (a.Original === b.Original) {
                        if(a.Alternative === "-"){
                          return 1;
                        }
                        else if(b.Alternative === "-"){
                          return -1;
                        }
                        else {
                          return a.Alternative > b.Alternative ? 1 : -1;
                        }
                      }
                      else{
                        if(a.Original === "-"){
                          return 1;
                        }
                        else if(b.Original === "-"){
                          return -1;
                        }
                        else {
                          return a.Original > b.Original ? 1 : -1;
                        }
                      }
                    }
                    else {
                      return parseInt(a.Mutation,10) > parseInt(b.Mutation, 10) ? 1 : -1;
                    }
                });
                this.result_statistics = result;
                this.isLoading = false;
              });
            });

    },
    exit(){
      this.showTotMutStatistics();
      this.setChosenEpitope(null);
      this.firstParameterSetted = null;
      this.secondParameterSetted = null;
      this.showTable = false;
      this.result_statistics = [];
    },
    rename(inp) {
      let value_in;
      if (inp.name !== null && inp.name !== undefined) {
        value_in = inp.name;
      } else
        value_in = inp;
      return value_in;
    },
    clearSecondParameter(){
      this.showTable = false;
      this.secondParameterSetted = null;
    },
    filterParam(selector){
      let listParameters = [];
      let all_param = JSON.parse(JSON.stringify(this.allParameters));
      if(selector === 1){
        if(this.secondParameterSetted !== null){
          let all_param2 = JSON.parse(JSON.stringify(this.allParameters));
          const map1 = all_param2.filter(x => x.name === this.secondParameterSetted);
          all_param.forEach(par => {
            if (par.group !== map1[0].group) {
              listParameters.push(par);
            }
          });
        }
        else{
            listParameters = this.allParameters;
        }
      }
      else if(selector === 2){
        if(this.firstParameterSetted !== null){
          let all_param3 = JSON.parse(JSON.stringify(this.allParameters));
          const map2 = all_param3.filter(x => x.name === this.firstParameterSetted);
          all_param.forEach(par => {
            if (par.group !== map2[0].group){
              listParameters.push(par);
            }
          });
        }
        else{
            listParameters = this.allParameters;
        }
      }
      return listParameters;
    }
  },
  watch: {
    showTotalMutationStatistics() {
      this.dialog = this.showTotalMutationStatistics;
    },
  },
}
</script>

<style scoped>

  .EpitopeSelectors{
    padding: 20px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  table > tbody > tr > td:nth-child(1),
  table > thead > tr > th:nth-child(1){
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    z-index: 9998;
    background: white;
  }

  table > tbody > tr > td:nth-child(2){
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 100px;
    z-index: 9998;
    background: white;
    box-shadow: inset -1px 0px 0px 0px grey;
  }
  table > thead > tr > th:nth-child(2){
     position: sticky !important;
    position: -webkit-sticky !important;
    left: 100px;
    z-index: 9998;
    background: white;
    box-shadow: inset -1px 0px 0px 0px grey;
    padding-right: 10px !important;
  }

  table > tbody > tr:hover >td{
    background: lightgrey !important;
  }

   table > tbody > tr > td{
    text-align: center;
  }

  table > thead > tr > th{
    padding: 10px !important;
  }


</style>