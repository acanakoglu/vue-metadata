<template>
    <!--    <v-layout>-->
    <!--        <v-flex>-->
    <v-expansion-panel-content :readonly="readOnly" @input="setOpen()" :value="open" hide-actions>
        <div slot="header">{{query_text}}:{{kvLocal}}</div>
        <v-btn v-if="cancelButton" slot="header" color="error" flat @click="deleteKvLocal()">Delete Kv</v-btn>
        <p>{{selectedKvGcm}}</p>
        <p>{{selectedKvPairs}}</p>
        <v-card>
            <v-card-title class="headline blue lighten-4"
                          secondary-title>
                Genomic Conceptual Model
            </v-card-title>
            <v-data-table
                    :headers="headersGcm"
                    :items="resultsGcm"
                    :loading="isLoading"
                    class="data-table"
            >
                <template slot="items" slot-scope="props">
                    <td v-for="header in headersGcm" :key="header.value">
                        <span v-if="header.value === 'values'" v-html="updateCellTextFormat(props.item.a[header.value]).toString()">
                        </span>
                        <span v-else-if="header.value==='selected'">
                            <v-checkbox v-model="props.item.selected"></v-checkbox>
                        </span>
                        <span v-else v-html="updateCellTextFormat(props.item.a[header.value])">
                        </span>
                    </td>
                </template>
            </v-data-table>
        </v-card>

        <v-card>
            <v-card-title class="headline blue lighten-4"
                          secondary-title>
                Original key-value pairs
            </v-card-title>
            <v-data-table
                    :headers="headers"
                    :items="resultsPair"
                    :loading="isLoading"
                    class="data-table"
            >
                <template slot="items" slot-scope="props">
                    <td v-for="header in headers" :key="header.value">
                        <span v-if="header.value === 'values'">
                            <v-btn flat icon @click=openValuesDialog(props.item.a[keyDummy],false)
                                   color="blue">
                                <v-icon>list</v-icon>
                            </v-btn>
                        </span>
                        <span v-else-if="header.value==='selectedNumber'"
                              v-html="updateCellTextFormat(getSelectedCount(props.item.a[keyDummy]))">
                        </span>
                        <span v-else-if="header.value==='selected'">
                            <v-checkbox v-model="props.item.selected"></v-checkbox>
                        </span>
                        <span v-else v-html="updateCellTextFormat(props.item.a[header.value])">
                        </span>
                    </td>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog
                v-model="valuesDialog"
                fullscreen>
            <v-card>
                <v-card-title
                        class="headline blue lighten-4"
                        primary-title>
                    Values for key {{keyToSearch}}
                </v-card-title>

                <v-divider></v-divider>
                <v-data-table
                        :headers="valueHeaders"
                        :items="possibleValues"
                        :loading="isLoading"
                        class="data-table"
                >
                    <template slot="items" slot-scope="props">
                        <td v-for="header in valueHeaders" :key="header.value">
                            <span v-if="header.value==='selected'">
                                <v-checkbox v-model="props.item.selected"></v-checkbox>
                            </span>
                            <span v-else v-html="updateCellTextFormat(props.item.a[header.value])">
                            </span>
                        </td>
                    </template>
                </v-data-table>
                <v-card-actions>
                    <v-btn
                            color="primary"
                            flat
                            @click="resetSearch"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-btn color="info" @click="setKvLocal" :disabled="buttonDisabled">Apply</v-btn>
        <v-btn color="error" @click="cancel(key)">Cancel</v-btn>
    </v-expansion-panel-content>
    <!--        </v-flex>-->
    <!--        <v-flex v-html="cancelButton"></v-flex>-->
    <!--    </v-layout>-->
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';

    export default {
        name: "KvExpansionPanel",
        props: {
            query_text: {type: String, required: true},
            query_type: {type: String, required: true},
            query: {type: Object, required: false},
        },
        data() {
            return {
                cancelButton: false,
                possibleKvGcm: [],
                possibleKvPairs: [],
                readOnly: false,
                open: [true],
                headers: [],
                headersGcm: [],
                valueHeaders: [
                    {text: 'Value', value: 'value', sortable: false},
                    {text: 'Count', value: 'count', sortable: false},
                    {text: 'Selected', value: 'selected', sortable: false},
                ],
                resultsGcm: [],
                resultsPair: [],
                isLoading: false,
                key: "",
                panel: [],
                keyDummy: "key",
                valueDummy: "value",
                valuesDialog: false,
                keyToSearch: "",
                isGcm: true,
                // selectedValues: [],
                possibleValues: [],
                kvLocal: {
                    type_query: this.query_type,
                    query: {
                        gcm: {},
                        pairs: {},
                    }
                },
            }
        },
        mounted() {
            this.searchText();
            this.key = this.query_text;
            this.setSearch(true);
            if (this.query_type === 'key') {
                this.headers = [
                    {text: 'Key', value: 'key', sortable: false},
                    {text: 'N. Distinct Values', value: 'count_values', sortable: false},
                    {text: 'N. Selected Values', value: 'selectedNumber', sortable: false},
                    {text: 'Values', value: 'values', sortable: false},
                ];
                this.headersGcm = [
                    {text: 'Key', value: 'key', sortable: false},
                    {text: 'N. Distinct Values', value: 'count_values', sortable: false},
                    {text: 'Example Values', value: 'values', sortable: false},
                ];

            } else {
                this.headers = [
                    {text: 'Key', value: 'key', sortable: false},
                    {text: 'Value', value: 'value', sortable: false},
                    {text: 'Count', value: 'count', sortable: false},
                    {text: 'Selected', value: 'selected', sortable: false},
                ];
                this.headersGcm = this.headers
            }
            if(this.query){
                this.readOnly=true;
                this.cancelButton=true;
                this.kvLocal = this.query;
                this.open=false;
                this.setSearch(false)
            }
        },
        methods: {
            ...mapMutations(["deleteKey", "setSearch", "deleteKvField"]),
            ...mapActions(["setKv", "deleteKv"]),
            setOpen() {
                this.open = [false];
            },
            cancel() {
                this.deleteKey(this.key + "_" + this.kvLocal.type_query);
                this.setSearch(false)
            },

            deleteKvLocal(){
                this.deleteKv(this.query_text+"_"+this.kvLocal.type_query)
                this.cancel()
            },
            searchText() {
                this.isLoading = true;
                let url = "pair/" + this.query_type + "s?q=" + this.query_text;
                // eslint-disable-next-line
                axios.post(url, this.compound_query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        var a = res['gcm'];
                        for (let x in a){
                            this.resultsGcm.push({'a': a[x], 'selected': false})
                        }
                        a = res['pairs'];
                        for (let x in a){
                            this.resultsPair.push({'a': a[x], 'selected': false})
                        }
                        this.isLoading = false
                    });
            },
            setKvLocal() {
                if (this.query_type === 'key') {
                    this.setKv({kv: this.kvLocal, search_text: this.key+"_"+this.kvLocal.type_query});
                } else {

                    var keys_gcm = [];
                    for (let x in this.selectedKvGcm) {
                        keys_gcm.push(this.selectedKvGcm[x].key)
                    }

                    var keys_pairs = [];
                    for (let x in this.selectedKvPairs) {
                        keys_pairs.push(this.selectedKvPairs[x].key)
                    }

                    for (let x in keys_gcm) {
                        let a = [];
                        this.selectedKvGcm.forEach(function (item) {
                            if (item.key === keys_gcm[x])
                                a.push(item.value)
                        });
                        this.kvLocal.query.gcm[keys_gcm[x]] = a;
                    }

                    for (let x in keys_pairs) {
                        let b = [];
                        this.selectedKvPairs.forEach(function (item) {
                            if (item.key === keys_pairs[x])
                                b.push(item.value)
                        });
                        this.kvLocal.query.pairs[keys_pairs[x]] = b;
                    }

                    this.setKv({kv: this.kvLocal, search_text: this.key+"_"+this.kvLocal.type_query});
                }
                this.readOnly = true;
                this.cancelButton = true;
                this.open = false;
                this.setSearch(false)
            },
            updateCellTextFormat(input) {
                var temp = input;
                if (temp === null)
                    temp = 'N/D';
                // temp = temp.replace(/\|/g, "|<br/>")
                return temp
            },
            openValuesDialog(input, isGcm) {
                this.valuesDialog = true;
                this.keyToSearch = input;
                this.isGcm = isGcm;
            },
            resetSearch() {
                this.valuesDialog = false;
            },
            getSelectedCount(key) {
                let cur = "";
                if (this.isGcm)
                    cur = this.kvLocal.query.gcm[key];
                else
                    cur = this.kvLocal.query.pairs[key];

                if (typeof cur === 'undefined')
                    return 0;
                else {
                    return cur.length
                }
            },
        },
        computed: {
            ...mapGetters({
                compound_query: 'build_query'
            }),
            buttonDisabled() {
                let a = Object.keys(this.kvLocal.query.gcm).length + Object.keys(this.kvLocal.query.pairs).length + this.selectedKvGcm.length + this.selectedKvPairs.length;
                return a === 0
            },
            selectedValues() {
                var x;
                var res = [];
                for (x in this.possibleValues) {
                    if (this.possibleValues[x].selected) {
                        res.push(this.possibleValues[x].a.value);
                    }
                }
                return res;
            },
            selectedKvGcm() {
                var x;
                var res = [];
                for (x in this.resultsGcm) {
                    if (this.resultsGcm[x].selected) {
                        res.push(this.resultsGcm[x].a);
                    }
                }
                return res;
            },
            selectedKvPairs() {
                var x;
                var res = [];
                for (x in this.resultsPair) {
                    if (this.resultsPair[x].selected) {
                        res.push(this.resultsPair[x].a);
                    }
                }
                return res;
            },
        },
        watch: {
            open: {
                handler() {
                    if(!this.readOnly) {
                        this.open[this.open.length] = true
                    }
                },
                deep: true
            },
            valuesDialog() {
                let k = this.keyToSearch;
                if (this.valuesDialog) {
                    this.isLoading = true;
                    let url = "pair/" + this.keyToSearch + "/values?is_gcm=" + this.isGcm;

                    // eslint-disable-next-line
                    axios.post(url, this.compound_query)
                        .then((res) => {
                            return res.data
                        })
                        .then((res) => {
                            var x;
                            for (x in res) {
                                let cur = "";
                                if (this.isGcm) {
                                    cur = this.kvLocal.query.gcm[k];
                                } else {
                                    cur = this.kvLocal.query.pairs[k];
                                }
                                var selected = false;
                                if (typeof cur !== 'undefined') {
                                    selected = cur.includes(res[x].value);
                                }
                                this.possibleValues.push({'a': res[x], 'selected': selected});
                            }
                            this.isLoading = false
                        });
                } else {
                    let v = this.selectedValues;
                    if (v.length !== 0) {
                        if (this.isGcm) {
                            this.kvLocal.query.gcm[k] = v;
                            this.kvLocal.query.gcm = Object.assign({}, this.kvLocal.query.gcm)
                        } else {
                            this.kvLocal.query.pairs[k] = v;
                            this.kvLocal.query.pairs = Object.assign({}, this.kvLocal.query.pairs)
                        }
                    } else {
                        if (this.isGcm) {
                            delete this.kvLocal.query.gcm[k];
                            this.kvLocal.query.gcm = Object.assign({}, this.kvLocal.query.gcm)
                        } else {
                            delete this.kvLocal.query.pairs[k];
                            this.kvLocal.query.pairs = Object.assign({}, this.kvLocal.query.pairs)
                        }
                    }
                    this.keyToSearch = "";
                    this.possibleValues = [];
                }
            },
        }

    }
</script>

<style scoped>
</style>