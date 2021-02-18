<template>
  <v-card>
    <v-autocomplete
      :loading="isLoading"
      v-model="selected"
      :items="results"
      :item-text="rename"
      item-value="value"
      :label="text"
      :multiple="false"
      :disabled="epiSearchDis"
    >
      <template slot="item" slot-scope="data">
          <span class="item-value-span"> {{rename(data.item)}}</span>
          <span class="item-count-span"> {{data.item.count}}</span>
      </template>
    </v-autocomplete>
  </v-card>
</template>

<script>
import axios from "axios";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {FULL_TEXT, LOADING_TEXT, poll} from '../utils.js'

export default {
  name: "ProteinSelectorNewEpitope",
  props: {
      text: {type: String, required: true,},
      field: {type: String, required: true,},
  },
  watch: {
    compound_query(){
      this.loadData();
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel',
      'aminoacidConditions',
      'epitopeAminoacidFields',
      'aminoacidConditions',
      'disableSelectorEpitopePart',
      'newSingleEpitope'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      epiSearchDis: 'epiSearchDisabled',
    }),
    selected: {
      get() {
        return this.newSingleEpitope[this.field];
      },
      set(value){
        this.setNewSingleEpitopeSelected({field: this.field, list: value});
      }
    },
  },
  methods:{
    ...mapMutations([]),
    ...mapActions(['setEpiDropDownSelected', 'setAminoacidConditionsSelected', 'setNewSingleEpitopeSelected']),
    loadData(){
        this.isLoading = true;
        this.results = [{value: LOADING_TEXT}];

        let queryToRun = Object.assign({}, this.compound_query);
        queryToRun['panel'] = this.groupCondition;

        const url = `field/${this.field}`;
        this.isLoading = true;

        axios.post(url, queryToRun)
        .then((res) => {
            return res.data
        })
        .then((res) => {
          poll(res.result,(res)=>{
              let vals = res.values
              if (this.selected) {
                let arraySelected = [this.selected];
                  let zero_elements = arraySelected.filter(value => !res.values.map(v => v.value).includes(value))
                      .sort().map(v => Object({
                          value: v,
                          count: 0
                      }));
                  vals = vals.concat(zero_elements);
              }
              this.results = vals;
              this.isLoading = false;
            });
        })
    },
    rename(inp) {
        let value_in;
        if (inp.value !== null && inp.value !== undefined) {
          value_in = inp.value;
        } else
          value_in = 'N/D(not defined)';
        return value_in;
    },
  },
  data(){
    return {
      isLoading : true,
      results: [],
      disableTxtSel: false,
      disableTxtAmino: true,
      is_multiple: true,
      disabledEpi_AminoacidMenuOpened: false,
    }
  },
  mounted() {
    this.loadData();
  },
}
</script>

<style scoped>

  .item-value-span {
      padding-right: 3.5em;
  }

  .item-count-span {
      /*float:right;*/
      position: absolute;
      right: 0.5em;
  }

</style>