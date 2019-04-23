<template>
    <v-expansion-panel-content :disabled="readOnly" :value="open">
        <div slot="header">{{query_text}}:{{kvLocal}}</div>
        <p>{{selectedKvGcm}}</p>
        <p>{{selectedKvPairs}}</p>
        <v-card>
            <v-card-title class="headline blue lighten-4"
                          secondary-title>
                Genomic Conceptual Model
            </v-card-title>
            <v-data-table
                    :headers="headers"
                    :items="resultsGcm"
                    :loading="isLoading"
                    class="data-table"
            >
                <template slot="items" slot-scope="props">
                    <td v-for="header in headers" :key="header.value">
                        <span v-if="header.value === 'values'">
                            <v-btn flat icon @click=openValuesDialog(props.item[keyDummy],true)
                                   color="blue">
                                <v-icon>list</v-icon>
                            </v-btn>
                        </span>
                        <span v-else-if="header.value==='selectedNumber'"
                              v-html="updateCellTextFormat(getSelectedCount(props.item[keyDummy]))">
                        </span>
                        <span v-else-if="header.value==='selected'">
                            <v-checkbox v-model="selectedKvGcm" :value="props.item"></v-checkbox>
                        </span>
                        <span v-else v-html="updateCellTextFormat(props.item[header.value])">
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
                            <v-btn flat icon @click=openValuesDialog(props.item[keyDummy],false)
                                   color="blue">
                                <v-icon>list</v-icon>
                            </v-btn>
                        </span>
                        <span v-else-if="header.value==='selectedNumber'"
                              v-html="updateCellTextFormat(getSelectedCount(props.item[keyDummy]))">
                        </span>
                        <span v-else-if="header.value==='selected'">
                            <v-checkbox v-model="selectedKvPairs" :value="props.item"></v-checkbox>
                        </span>
                        <span v-else v-html="updateCellTextFormat(props.item[header.value])">

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
        <v-btn color="info" @click="setKvLocal">Apply</v-btn>
        <v-btn color="error" @click="cancel(key)">Cancel</v-btn>
    </v-expansion-panel-content>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: "KvExpansionPanel",
        props: {
            query_text: {type: String, required: true},
            query_type: {type: String, required: true}
        },
        data() {
            return {
                selectedKvGcm: [],
                selectedKvPairs: [],
                readOnly: false,
                open: true,
                headers: [],
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
            this.setSearch(true)
            if (this.query_type === 'key') {
                this.headers = [
                    {text: 'Key', value: 'key', sortable: false},
                    {text: 'N. Distinct Values', value: 'count_values', sortable: false},
                    {text: 'N. Selected Values', value: 'selectedNumber', sortable: false},
                    {text: 'Values', value: 'values', sortable: false},
                ]
            } else {
                this.headers = [
                    {text: 'Key', value: 'key', sortable: false},
                    {text: 'Value', value: 'value', sortable: false},
                    {text: 'Count', value: 'count', sortable: false},
                    {text: 'Selected', value: 'selected', sortable: false},
                ]
            }
        },
        methods: {
            ...mapMutations(["deleteKey", 'setKv', "setSearch"]),
            cancel() {
                this.deleteKey(this.key);
                this.setSearch(false)
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
                        this.resultsGcm = res['gcm'];
                        this.resultsPair = res['pairs'];
                        this.isLoading = false
                    });
            },
            setKvLocal() {
                if (this.query_type === 'key') {
                    this.setKv({kv: this.kvLocal, search_text: this.key});
                } else {

                    var keys_gcm = [];
                    for(let x in this.selectedKvGcm){
                        keys_gcm.push(this.selectedKvGcm[x].key)
                    }

                    var keys_pairs = [];
                    for(let x in this.selectedKvPairs){
                        keys_pairs.push(this.selectedKvPairs[x].key)
                    }

                    for (let x in keys_gcm){
                        var a = [];
                        this.selectedKvGcm.forEach(function (item) {
                            if(item.key === keys_gcm[x])
                                a.push(item.value)
                        });
                        this.kvLocal.query.gcm[keys_gcm[x]] = a;
                    }

                    for (let x in keys_pairs){
                        var a = [];
                        this.selectedKvPairs.forEach(function (item) {
                            if(item.key === keys_pairs[x])
                                a.push(item.value)
                        });
                        this.kvLocal.query.pairs[keys_pairs[x]] = a;
                    }

                    this.setKv({kv: this.kvLocal, search_text: this.key});
                }
                this.readOnly = true;
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
        },
        watch: {
            query_text() {
                this.searchText();
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

                    if (this.isGcm) {
                        this.kvLocal.query.gcm[k] = v
                    } else {
                        this.kvLocal.query.pairs[k] = v
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