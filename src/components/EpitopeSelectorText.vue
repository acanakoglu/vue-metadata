<template>
  <v-card>
    <v-autocomplete
      :loading="isLoading"
      v-model="selected"
      :items="results"
      :item-text="rename"
      item-value="value"
      :label="text"
      :multiple="is_multiple"
      :disabled="epiSearchDis || disableTxtSel || disableTxtAmino || disabledEpi_AminoacidMenuOpened"
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
  name: "EpitopeSelectorText",
  props: {
      text: {type: String, required: true,},
      field: {type: String, required: true,},
  },
  watch: {
    compound_query() {
        this.loadData();
    },
    epiQuerySel() {
      this.loadData();
    },
    aminoacidConditions(){
      if(this.epitopeAminoacidFields.some(item => item.field === this.field)){
        this.disableTxtAmino = this.getDisableTxtAmino();
        this.loadData();
      }
    },
    disableSelectorEpitopePart(){
      if((!this.epitopeAminoacidFields.some(item => item.field === this.field)) && this.disableSelectorEpitopePart){
          this.disabledEpi_AminoacidMenuOpened = true;
      }
      else{
        this.disabledEpi_AminoacidMenuOpened = false;
      }
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel',
      'aminoacidConditions',
      'epitopeAminoacidFields',
      'aminoacidConditions',
      'disableSelectorEpitopePart',
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      epiSearchDis: 'epiSearchDisabled',
    }),
    /*searchDisabled() {
      return this.epiQuerySel.length !== 0 || this.isLoading;
    },*/
    selected: {
      get() {
        if(this.epitopeAminoacidFields.some(item => item.field === this.field)){
          return this.aminoacidConditions[this.field];
        }else {
          return this.epiQuerySel[this.field];
        }
      },
      set(value){
        //this.setEpiDropDownSelected({field: this.field, list: value});  FOR APPLY

        if(this.epitopeAminoacidFields.some(item => item.field === this.field)){
          this.setAminoacidConditionsSelected({field: this.field, list: value});
          this.clearEpiQueryFromAmino();
        }
        else{
          this.setEpiDropDownSelected({field: this.field, list: value}); //FOR APPLY
        }
      }
    },
  },
  methods:{
    ...mapMutations([]),
    ...mapActions(['setEpiDropDownSelected', 'setAminoacidConditionsSelected']),
    loadData(){
      //console.log("RELOAD ", this.value);
      this.isLoading = true;
      this.results = [{value: LOADING_TEXT}];
      let to_send = this.toSend();

      const url = `epitope/epiSel/${this.field}`;
      axios.post(url, to_send)
        .then((res) => {
            return res.data
        })
        .then((res) => {
          //console.log("ID ", res.result)

          poll(res.result,(res)=>{
            let vals = res.values;

            //console.log("RES: ", vals, "SEL: ", this.selected , "ARR: ", Array.isArray(this.selected));
            if (this.selected && Array.isArray(this.selected)) {
                // console.log("this.selected: ", this.selected);
                let zero_elements = this.selected
                    .filter(value => !res.values.map(v => v.value).includes(value))
                    .sort().map(v => Object({
                        value: v,
                        count: 0
                    }));
                //console.log("QUI: ", vals, zero_elements);
                vals = vals.concat(zero_elements);
            }
            /*if (!this.is_gcm) {
                vals = vals.map(el => el.value).filter(el => el).sort()
                vals.unshift(FULL_TEXT)
                if (!vals.includes(this.selected)) {
                    this.selected = FULL_TEXT;
                }
                vals = vals.map(val => Object({
                    value: val
                }));

            }*/
            this.results = vals;

            if(this.results.length === 0){
              this.disableTxtSel = true;
            }
            else{
              this.disableTxtSel = false;
            }

            this.isLoading = false;

          })
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
    toSend(){
      let res = {};
      let epitope_conditions = JSON.parse(JSON.stringify(this.epiQuerySel));              //  FOR APPLY ALL IF AND ELSE
      let aminoacid_conditions = JSON.parse(JSON.stringify(this.aminoacidConditions));
      let epitope_and_aminoacid_conditions = Object.assign(aminoacid_conditions, epitope_conditions);
      if(this.epitopeAminoacidFields.some(item => item.field === this.field)){
        Object.assign(res, {"compound_query": this.compound_query}, {"epi_query": epitope_and_aminoacid_conditions});
      }
      else {
        Object.assign(res, {"compound_query": this.compound_query}, {"epi_query": epitope_conditions});
      }
      return res;
    },
    getDisableTxtAmino(){
      let bool = false;
      if(this.field === 'sequence_aa_original'){
        let query = this.aminoacidConditions['variant_aa_type'];
        if(!query || (query.includes("INS") &&  !query.includes("DEL") &&  !query.includes("SUB"))){
          bool = true;
        }
      }
      else if (this.field === 'sequence_aa_alternative'){
        let query = this.aminoacidConditions['variant_aa_type'];
        if(!query || (query.includes("DEL") &&  !query.includes("INS") &&  !query.includes("SUB"))){
          bool = true;
        }
      }
      return bool;
    },
    clearEpiQueryFromAmino(){
      this.epitopeAminoacidFields.forEach(elem => {
            this.setEpiDropDownSelected({field: elem.field, list: []});
          }
      )
      this.setEpiDropDownSelected({field: 'startExtVariant', list: []});
      this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});
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
    this.disableTxtAmino = this.getDisableTxtAmino();
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