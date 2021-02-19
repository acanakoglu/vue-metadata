<template>
  <v-container fluid grid-list-xs style="margin-top: 20px; margin-bottom: 20px">
      <v-layout wrap justify-space-between>
        <v-btn @click="downloadEpitopes()"
               class="white--text"
               small
               color="rgb(122, 139, 157)"
              :disabled="epitopeAdded.length === 0">
          Download Epitopes (JSON)</v-btn>
        <v-spacer></v-spacer>
        <input id="fileInput" type="file" style="display:none" v-on:change="loadEpitopes()" accept="application/JSON"/>
        <v-btn
                 onclick="document.getElementById('fileInput').click()"
                 class="white--text"
                 small
                 color="rgb(122, 139, 157)"
          >
              Load Epitopes (JSON)
          </v-btn>
      </v-layout>
      <v-dialog
          persistent
          scrollable
            v-model="dialogMergeEpitope"
            width="500">
        <v-card>
            <v-card-title
                    class="headline"
                    style="background-color:rgb(201, 53, 53) ; color: white">
                Warning
            </v-card-title>
            <v-card-text>
                <p>
                  Other epitopes are already present in the interface.
                  Choose whether to keep them or not.
                </p>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
                <v-btn
                        color="rgb(201, 53, 53) "
                        flat
                        @click="keepEpitopes()">
                    Keep
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                        color="rgb(201, 53, 53) "
                        flat
                        @click="deleteEpitopes()"
                >
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
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
      dialogMergeEpitope: false,
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
      'resetNewEpitopeFromLocalStorage', 'addNewEpitopeToList'
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
        that.saveNewEpitopes();
      }
      reader.readAsText(selectedFile);
    },
    keepEpitopes(){
      let epitopeArr = JSON.parse(JSON.stringify(this.epitopeArr));
      let len = epitopeArr.length;
      let i = 0;
      while(i<len){
        epitopeArr[i] = this.controlExistingName(epitopeArr[i]);
        this.addNewEpitopeToList(epitopeArr[i]);
        i++;
      }
      let epitopeArrNew = (JSON.stringify(this.epitopeAdded));
      localStorage.setItem('epitopeArr', epitopeArrNew);
      this.dialogMergeEpitope = false;
    },
    controlExistingName(epitope){
      if(this.epitopeAdded.some(item => item.epitope_name === epitope.epitope_name)) {
        let i = 1;
        while (i){
          let name = epitope.epitope_name + ' (' + i +')';
          if(!this.epitopeAdded.some(item => item.epitope_name === name)) {
              epitope.epitope_name = name;
              return epitope;
          }
          else{
            i++;
          }
        }
      }
      else{
        return epitope;
      }
    },
    deleteEpitopes(){
      this.resetNewEpitopeFromLocalStorage(this.epitopeArr);
      let epitopeArr = (JSON.stringify(this.epitopeAdded));
      localStorage.setItem('epitopeArr', epitopeArr);
      this.dialogMergeEpitope = false;
    },
    saveNewEpitopes(){
      if(this.epitopeAdded.length>0){
        this.dialogMergeEpitope = true;
      }
      else {
        this.resetNewEpitopeFromLocalStorage(this.epitopeArr);
        let epitopeArr = (JSON.stringify(this.epitopeAdded));
        localStorage.setItem('epitopeArr', epitopeArr);
      }
    }
  },
  watch: {
  },
}
</script>

<style scoped>

</style>