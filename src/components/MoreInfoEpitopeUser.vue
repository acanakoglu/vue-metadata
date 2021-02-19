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
            <span v-for="(value, key) in epitope_infos" style="display: block;"> <b>- {{key}} : </b>
              <span class="capitalize">{{value}} </span>
            </span>
          </div>
          <div>
            <!--v-if="Object.keys(epitope_metadata_infos).length > 0"-->
            <h2 style="display: block;  margin-bottom: 5px; margin-top: 15px;">Epitope Metadata Info:</h2>
            <span v-for="(value, key) in epitope_metadata_infos" style="display: block;"> <b class="text-capitalize">- {{key}} : </b>
              <div v-if="value.length !== undefined && value.length !== null" style="display: inline">
                <span v-for="(val, index) in value">
                  <span v-if="index!=0"> , </span>
                  <span class="capitalize">{{val}} </span>
                </span>
              </div>
              <div v-else style="display: inline">
                <span>
                  {{value}}
                </span>
              </div>
            </span>
          </div>
          <div>
            <!--v-if="Object.keys(epitope_metadata_infos).length > 0"-->
            <h2 style="display: block;  margin-bottom: 5px; margin-top: 15px;">Amino Acid Condition:</h2>
            <div v-for="(conditionsAND, index) in amino_acid_conditions">
              <!--<h3 style="display: block; margin-top: 10px; margin-bottom: 10px;">Condition {{index + 1}}: </h3> -->
              <div v-for="(conditionsOR, index) in conditionsAND">
                <span style="display: block; margin-top: 10px; margin-bottom: 10px;" v-if="index > 0"><b> OR </b></span>
                <span v-for="(value, key) in conditionsOR" style="display: block;">
                  <b>- {{key}} : </b>
                  <span class="capitalize">{{value}} </span>
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
      infos['Epitope name'] = epitope.epitope_name;
      infos['Protein'] = epitope.product;
      infos['Position range'] = epitope.position_range_to_show;
      infos['Virus taxon name'] = epitope.taxon_name;
      infos['Host taxon name'] = epitope.host_taxon_name;
      infos['Number of sequences'] = epitope.num_seq;
      infos['Number of variants'] = epitope.num_var;
      infos['Total number of sequences (metadata)'] = epitope.total_num_of_seq_metadata;
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
                line['Protein'] = single[key][0];
              } else if (key === 'variant_aa_type') {
                line['Variant type'] = single[key][0];
              } else if (key === 'sequence_aa_original') {
                line['Original amino acid'] = single[key][0];
              } else if (key === 'sequence_aa_alternative') {
                line['New amino acid'] = single[key][0];
              } else if (key === 'start_aa_original') {
                let pos = single[key]['min_val'] + '-' + single[key]['max_val'];
                line['Position range'] = pos;
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

.capitalize {
  text-transform: lowercase;
  display: inline-block;
}

.capitalize:first-letter {
  text-transform: uppercase
}
</style>