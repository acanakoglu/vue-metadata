<template>
  <div class="text-center">
    <v-dialog
        persistent
        scrollable
      v-model="dialogMoreInfo"
      width="500"
    >
      <v-card>
        <v-card-title class="headline" style="background-color:rgb(201, 53, 53) ; color: white">
          Epitope {{epitope_name}}
          <v-spacer></v-spacer>
          <v-btn
            color="rgb(122, 139, 157)"
            style="color:white;"
            text
            @click="exit()"
          >
            CLOSE
          </v-btn>
        </v-card-title>

        <v-card-text>
          <div v-if="Object.keys(epitope_infos).length > 0">
            <h2 style="display: block; margin-bottom: 5px;">Epitope Info:</h2>
            <span v-for="(value, key) in epitope_infos" style="display: block;"> <b>- {{key}} :</b> {{value}} </span>
          </div>
          <div>
            <!--v-if="Object.keys(epitope_metadata_infos).length > 0"-->
            <h2 style="display: block;  margin-bottom: 5px; margin-top: 15px;">Epitope Metadata Info:</h2>
            <span v-for="(value, key) in epitope_metadata_infos" style="display: block;"> <b>- {{key}} :</b> {{value}} </span>
          </div>
          <div>
            <!--v-if="Object.keys(epitope_metadata_infos).length > 0"-->
            <h2 style="display: block;  margin-bottom: 5px; margin-top: 15px;">Amino Acid Conditions:</h2>
            <div v-for="(conditionsAND, index) in amino_acid_conditions">
              <h3 style="display: block; margin-top: 10px; margin-bottom: 10px;">Condition : </h3> <!-- {{index + 1}}-->
              <div v-for="(conditionsOR, index) in conditionsAND">
                <span style="display: block; margin-top: 10px; margin-bottom: 10px;" v-if="index > 0"><b> OR </b></span>
                <span v-for="(value, key) in conditionsOR" style="display: block;">
                  <b>- {{key}} :</b> {{value}}
                </span>
              </div>
            </div>
          </div>
        </v-card-text>

      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import MetadataTableForEpi from "./MetadataTableForEpi";

export default {
  name: "MoreInfoEpitopeUser",
  components: {MetadataTableForEpi},
  data(){
    return{
      dialogMoreInfo: false,
      epitope: null,
      epitope_name: '',
      epitope_infos: [],
      epitope_metadata_infos: [],
      amino_acid_conditions: [],
    }
  },
  computed: {
    ...mapState([
      'showMoreInfoEpitopeUser', 'epitopeAdded', 'userEpitopeSelected'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
    }),
  },
  methods: {
    ...mapMutations([
      'showMoreInfo', 'setUserEpitopeSelected'
    ]),
    exit(){
      this.showMoreInfo();
      this.setUserEpitopeSelected(null);
    },
    createEpitopeInfos(epitope){
      let infos = {};
      infos['epitope_name'] = epitope.epitope_name;
      infos['product'] = epitope.product;
      infos['position_range'] = epitope.position_range_to_show;
      infos['taxon_name'] = epitope.taxon_name;
      infos['host_taxon_name'] = epitope.host_taxon_name;
      infos['num_seq'] = epitope.num_seq;
      infos['num_var'] = epitope.num_var;
      infos['tot_num_seq_metadata'] = epitope.total_num_of_seq_metadata;
      return infos;
    },
    createMetadataInfos(epitope){
      let infos = {};
      let metadata = epitope.compound_query.gcm;

      Object.keys(metadata).forEach(function(key) {
        if(key !== 'host_taxon_name' && key !== 'taxon_name') {
          infos[key] = metadata[key];
        }
      })
      return infos;
    },
    createAminoAcidInfos(epitope){
      let kv = epitope.compound_query.kv;
      let arrayToShowInAND = [];

      Object.keys(kv).forEach(function(key) {
        let arrayToShowInOR = [];
        if(key !== 'aa_0'){
          let single = kv[key];
          let query = single['query'];
          let len = query.length;
          let i = 0;
          while(i < len){
            let line = {};
            let single = query[i];
            Object.keys(single).forEach(function(key) {
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
            arrayToShowInOR.push(line);
            i++;
          }
          arrayToShowInAND.push(arrayToShowInOR);
        }
      })

      return arrayToShowInAND;
    }
  },
  watch: {
    showMoreInfoEpitopeUser() {
      this.dialogMoreInfo = this.showMoreInfoEpitopeUser;
      if(this.dialogMoreInfo){
        this.epitope = this.epitopeAdded[this.userEpitopeSelected];
        this.epitope_name = this.epitope['epitope_name'];
        this.epitope_infos = this.createEpitopeInfos(this.epitope);
        this.epitope_metadata_infos = this.createMetadataInfos(this.epitope);
        this.amino_acid_conditions = this.createAminoAcidInfos(this.epitope);
      }
    },
  },
}
</script>

<style scoped>

</style>