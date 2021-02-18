<template>
  <v-container fluid grid-list-xs style="margin-top: 20px; margin-bottom: 20px">
      <v-layout wrap justify-space-between>
        <v-btn @click="downloadEpitopes()"
               class="white--text"
               small
               color="rgb(122, 139, 157)"
              :disabled="epitopeAdded.length === 0">
          Download Epitope JSON</v-btn>
        <v-spacer></v-spacer>
        <input id="fileInput" type="file" style="display:none" v-on:change="loadEpitopes()"/>
        <v-btn
                 onclick="document.getElementById('fileInput').click()"
                 class="white--text"
                 small
                 color="rgb(122, 139, 157)"
          >
              Load Epitopes From JSON
          </v-btn>
      </v-layout>
  </v-container>
</template>

<script>
import MetadataTableForEpi from "./MetadataTableForEpi";
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
  name: "DownloadAndLoadEpitopes",
  props: {
  },
  data(){
    return{
      epitopeArr: [],
    }
  },
  computed: {
    ...mapState([
      'epitopeAdded'
    ]),
    ...mapGetters({

    }),
  },
  methods: {
    ...mapMutations([
      'resetNewEpitopeFromLocalStorage'
    ]),
    downloadEpitopes(){
      let text = JSON.stringify(this.epitopeAdded);
      let filename = "epitopes.json";
      let element = document.createElement('a');
      element.setAttribute('download', filename);
      var data = new Blob([text]);
      element.href = URL.createObjectURL(data);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    loadEpitopes(){
      var reader = new FileReader();
      let selectedFile = document.getElementById ('fileInput'). files [0];

      var that = this;
      reader.onload = function() {
        let epitopeArray = reader.result;
        let obj = JSON.parse(epitopeArray);
        that.epitopeArr = obj;
      }
      reader.readAsText(selectedFile);
    }
  },
  watch: {
    epitopeArr(){
      this.resetNewEpitopeFromLocalStorage(this.epitopeArr);
      let epitopeArr = (JSON.stringify(this.epitopeAdded));
      localStorage.setItem('epitopeArr', epitopeArr);
    }
  },
}
</script>

<style scoped>

</style>