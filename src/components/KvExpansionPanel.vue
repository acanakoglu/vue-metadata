<template>
    <!--    <v-layout>-->
    <!--        <v-flex>-->
    <v-expansion-panel-content :readonly="readOnly" @input="setOpen()" :value="open" hide-actions>
        <!--        <div slot="header">{{query_text}}:{{kvLocal}}</div>-->
        <div slot="header">
            <h3>Selected Query: </h3>
            <p style="font-family:monospace;">{{ queryToShow }}</p>
        </div>
        <v-spacer></v-spacer>
        <v-btn class="delete-button" v-if="cancelButton" slot="header" color="error" flat @click="deleteKvLocal()">
            Delete Kv
        </v-btn>
        <v-card>
            <v-card-title class="headline blue lighten-4"
                          secondary-title>
                Genomic Conceptual Model
            </v-card-title>
            <v-data-table
                    v-if="query_type==='key'"
                    :headers="headersGcm"
                    :items="resultsGcm"
                    :loading="isLoading"
            >
                <template slot="items" slot-scope="props">
                    <td v-for="header in headersGcm" :key="header.value">
                        <span v-if="header.value ==='info'">
                             <v-dialog
                                     width="500"
                             >
                            <v-btn slot="activator"
                                   class="info-button"
                                   small
                                   flat icon color="blue">
                                <v-icon class="info-icon">info</v-icon>
                            </v-btn>

                            <v-card>
                                <v-card-title
                                        class="headline grey lighten-2"
                                        primary-title
                                >
                                    {{props.item[keyDummy]}}
                                </v-card-title>

                                <v-card-text>
                                    <p>Key {{props.item[keyDummy]}} is from GCM</p>
                                    <p>Please use the GCM part</p>
                                </v-card-text>

                            </v-card>
                        </v-dialog>
                        </span>
                        <span v-else v-html="updateCellTextFormat(props.item[header.value].toString())">
                        </span>
                    </td>
                </template>
            </v-data-table>
            <v-data-table
                    v-else
                    v-model="selectedKvGcm"
                    :headers="headers"
                    :items="resultsGcm"
                    :loading="isLoading"
                    item-key="id"
            >
                <template slot="items" slot-scope="props">
                    <td>
                        <v-checkbox v-model="props.selected"></v-checkbox>
                    </td>
                    <td v-for="header in headers" v-if="header.value!=='id'">
                        <span v-html="updateCellTextFormat(props.item[header.value])"></span>
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
                    v-if="query_type==='key'"
                    :headers="headersPair"
                    :items="resultsPair"
                    :loading="isLoading"
            >
                <template slot="items" slot-scope="props">
                    <td v-for="header in headersPair" :key="header.value">
                        <span v-if="header.value === 'values'">
                            <v-btn flat icon @click=openValuesDialog(props.item[keyDummy],false)
                                   color="blue">
                                <v-icon>list</v-icon>
                            </v-btn>
                        </span>
                        <span v-else-if="header.value==='selectedNumber'"
                              v-html="updateCellTextFormat(getSelectedCount(props.item[keyDummy]))">
                        </span>
                        <span v-else v-html="updateCellTextFormat(props.item[header.value])">
                        </span>
                    </td>
                </template>
            </v-data-table>
            <v-data-table
                    v-else
                    v-model="selectedKvPairs"
                    :headers="headers"
                    :items="resultsPair"
                    :loading="isLoading"
                    item-key="id"
            >
                <template slot="items" slot-scope="props">
                    <td>
                        <v-checkbox v-model="props.selected"></v-checkbox>
                    </td>
                    <td v-for="header in headers" v-if="header.value!=='id'">
                        <span v-html="updateCellTextFormat(props.item[header.value])"></span>
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
                        v-model="selectedValues"
                        :headers="valueHeaders"
                        select-all
                        item-key="value"
                        :items="possibleValues"
                        :loading="isLoading"
                        class="data-table"
                >
                    <template slot="items" slot-scope="props">
                        <td>
                            <v-checkbox v-model="props.selected"></v-checkbox>
                        </td>
                        <td v-for="header in valueHeaders" :key="header.value">
                            <span v-html="updateCellTextFormat(props.item[header.value])">
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
                queryToShow: "",
                selectedValues: [],
                selectedKvGcm: [],
                selectedKvPairs: [],
                cancelButton: false,
                possibleKvGcm: [],
                possibleKvPairs: [],
                readOnly: false,
                open: [true],
                headersPair: [
                    {text: 'Key', value: 'key', sortable: true},
                    {text: 'N. Distinct Values', value: 'count_values', sortable: true},
                    {text: 'N. Selected Values', value: 'selectedNumber', sortable: false},
                    {text: 'Values', value: 'values', sortable: false},
                ],
                headersGcm: [
                    {text: 'Key', value: 'key', sortable: true},
                    {text: 'N. Distinct Values', value: 'count_values', sortable: true},
                    {text: 'Example Values', value: 'values', sortable: false},
                    {text: 'Info', value: 'info', sortable: false}
                ],
                headers: [
                    {text: '', value: 'id', sortable: false},
                    {text: 'Key', value: 'key', sortable: true},
                    {text: 'Value', value: 'value', sortable: true},
                    {text: 'Count', value: 'count', sortable: true},
                ],
                valueHeaders: [
                    {text: 'Value', value: 'value',},
                    {text: 'Count', value: 'count',},
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
            this.setPanelActive(this.query_text);
            if (this.query) {
                this.readOnly = true;
                this.cancelButton = true;
                this.kvLocal = this.query;
                this.open = false;
                this.resetPanelActive()
            }
        },
        methods: {
            ...mapMutations(["deleteKey", "setPanelActive", "resetPanelActive", "deleteKvField"]),
            ...mapActions(["setKv", "deleteKv"]),
            setOpen() {
                this.open = [false];
            },
            cancel() {
                this.deleteKey(this.key + "_" + this.kvLocal.type_query);
                this.resetPanelActive()
            },

            deleteKvLocal() {
                this.deleteKv(this.query_text + "_" + this.kvLocal.type_query)
                this.deleteKey(this.key + "_" + this.kvLocal.type_query);
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
                        // for (let x in a) {
                        //     this.resultsGcm.push({'a': a[x], 'selected': false})
                        // }
                        this.resultsGcm = res['gcm'];
                        this.resultsPair = res['pairs'];
                        this.isLoading = false
                    });
            },
            setKvLocal() {
                if (this.query_type === 'key') {
                    this.setKv({kv: this.kvLocal, search_text: this.key + "_" + this.kvLocal.type_query});
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
                    this.setKv({kv: this.kvLocal, search_text: this.key + "_" + this.kvLocal.type_query});
                }
                let a = "";
                a += this.query_type.toString() + ": ";
                a += this.query_text.toString();
                a += ", ";
                a += "gcm: " + JSON.stringify(this.kvLocal.query.gcm) + ", ";
                a += "pairs: " + JSON.stringify(this.kvLocal.query.pairs);
                // a += JSON.stringify(this.kvLocal.query);
                this.queryToShow = a
                this.readOnly = true;
                this.cancelButton = true;
                this.open = false;
                this.resetPanelActive()
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
            // queryToShow() {
            //     let a = "";
            //     a += this.query_type.toString() + ": ";
            //     a += this.query_text.toString();
            //     a += ", ";
            //     a += "gcm: " + JSON.stringify(this.kvLocal.query.gcm) + ", ";
            //     a += "pairs: " + JSON.stringify(this.kvLocal.query.pairs);
            //     console.log(a)
            //     // a += JSON.stringify(this.kvLocal.query);
            //     return a;
            // },
        },
        watch: {
            // kvLocal: {
            //     handler() {
            //         let a = "";
            //         a += this.query_type.toString() + ": ";
            //         a += this.query_text.toString();
            //         a += ", ";
            //         a += "gcm: " + JSON.stringify(this.kvLocal.query.gcm) + ", ";
            //         a += "pairs: " + JSON.stringify(this.kvLocal.query.pairs);
            //         console.log(a);
            //         // a += JSON.stringify(this.kvLocal.query);
            //         console.log("allora madonna puttana")
            //         this.queryToShow = a
            //     },
            //     deep: true
            // },
            open: {
                handler() {
                    if (!this.readOnly) {
                        this.open[this.open.length] = true
                    }
                },
                deep: true
            },
            valuesDialog() {
                let k = this.keyToSearch;
                console.log(this.isGcm)
                if (this.valuesDialog) {
                    this.isLoading = true;
                    let url = "pair/" + this.keyToSearch + "/values?is_gcm=" + this.isGcm;

                    // eslint-disable-next-line
                    axios.post(url, this.compound_query)
                        .then((res) => {
                            return res.data
                        })
                        .then((res) => {
                            this.possibleValues = res;
                            let cur = [];
                            if (this.isGcm) {
                                cur = this.kvLocal.query.gcm[k];
                            } else {
                                cur = this.kvLocal.query.pairs[k];
                            }
                            if (cur !== undefined) {
                                let a = this.possibleValues;
                                a = a.filter(function (value) {
                                    return cur.includes(value['value'])
                                });
                                this.selectedValues = a
                            }
                            this.isLoading = false
                        });
                } else {
                    let v = [];
                    for (let x in this.selectedValues) {
                        v.push(this.selectedValues[x].value)
                    }
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
                    this.selectedValues = [];
                    this.possibleValues = [];
                }
            },
        }

    }
</script>

<style scoped>
    .delete-button {
        flex: none !important;
    }
</style>