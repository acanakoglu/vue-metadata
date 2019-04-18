<template>
    <v-expansion-panel-content :disabled="readOnly" :value="open">
        <div slot="header">{{query_key}}{{kvLocal}}</div>
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
                        <span v-else-if="header.value==='selected'"
                              v-html="updateCellTextFormat(getSelectedCount(props.item[keyDummy]))">
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
                        <span v-else-if="header.value==='selected'"
                              v-html="updateCellTextFormat(getSelectedCount(props.item[keyDummy]))">
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
                    Values for key <b> {{keyToSearch}} </b>
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
                            <span v-else
                                  v-html="updateCellTextFormat(props.item.a[header.value])"></span>
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
            query_key: {type: String, required: true}
        },
        data() {
            return {
                readOnly: false,
                open: true,
                headers: [
                    {text: 'Key', value: 'key', sortable: false},
                    {text: 'N. Distinct Values', value: 'count_values', sortable: false},
                    {text: 'N. Selected Values', value: 'selected', sortable: false},
                    {text: 'Values', value: 'values', sortable: false},
                ],
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
                kvLocal: {},
            }
        },
        mounted() {
            this.searchKey();
            this.key = this.query_key;
            this.setSearch(true)
        },
        methods: {
            ...mapMutations(["deleteKey", 'setKv', "setSearch"]),
            cancel() {
                this.deleteKey(this.key)
                this.setSearch(false)
            },
            searchKey() {
                this.isLoading = true;
                let url = "pair/keys?key=" + this.query_key;
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
                this.setKv(this.kvLocal);
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
                let cur = this.kvLocal[key];
                if (typeof cur === 'undefined')
                    return 0;
                else {
                    console.log(cur.length);
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
            query_key() {
                this.searchKey();
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
                                let cur = this.kvLocal[k];
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
                    this.kvLocal[k] = v;
                    this.keyToSearch = "";
                    this.possibleValues = [];
                }
            },
        }

    }
</script>

<style scoped>

</style>