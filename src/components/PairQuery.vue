<template>
    <v-container fluid grid-list-xl>
        <v-content v-if="pairQueryType==='key'" class="no-horizontal-padding">
            <v-layout>
                <v-flex xs2 class="no-horizontal-padding">
                    <v-radio-group label="Key-value search" class="radio-group2"
                                   append-icon="info"
                                   @click:append="openInfoDialog"
                                   v-model="pairQueryType">
                        <v-radio label="Key" id="key" value="key"></v-radio>
                        <v-radio label="Value" id="value" value="value"></v-radio>
                    </v-radio-group>
                    <v-dialog
                            width="500"
                            v-model="infoDialog"
                    >
                        <v-card>
                            <v-card-title
                                    class="headline grey lighten-2"
                                    primary-title
                            >
                                Key-value search
                            </v-card-title>

                            <v-card-text>
                                <p>Key: free text search over all attributes, including original metadata and GCM
                                    fields.</p>
                                <p>Value: free text search over all values, including original metadata and GCM
                                    fields.</p>
                            </v-card-text>

                        </v-card>
                    </v-dialog>
                </v-flex>
                <v-flex xs6>
                    <v-text-field
                            v-model="search"
                            append-icon="search"
                            @click:append="setKey"
                            @keydown.enter="setKey"
                            label="Search"
                            single-line
                            hide-details
                    ></v-text-field>
                </v-flex>
            </v-layout>
            {{panel}}
            <v-expansion-panel>
                <v-expansion-panel-content v-for="(item,i) in keys" :key="i">
                    <div slot="header">{{item}}</div>
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
                    <!--                    <KvExpansionPanel :query_key="item"></KvExpansionPanel>-->
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-content>
        <v-content v-else class="no-horizontal-padding">
            <v-layout>
                <v-flex xs2 class="no-horizontal-padding">
                    <v-radio-group label="Pair search" class="radio-group2"
                                   append-icon="info"
                                   @click:append="openInfoDialog"
                                   v-model="pairQueryType">
                        <v-radio label="Key" id="key2" value="key"></v-radio>
                        <v-radio label="Value" id="value2" value="value"></v-radio>
                    </v-radio-group>
                    <v-dialog
                            width="500"
                            v-model="infoDialog"
                    >
                        <v-card>
                            <v-card-title
                                    class="headline grey lighten-2"
                                    primary-title
                            >
                                Data search
                            </v-card-title>

                            <v-card-text>
                                TODO text
                            </v-card-text>

                        </v-card>
                    </v-dialog>
                </v-flex>
            </v-layout>
        </v-content>
        <p>{{keys}}</p>
        <p>{{kvLocal}}</p>
        <p>{{selectedValues}}</p>
    </v-container>
</template>

<script>
    import {mapMutations, mapState, mapGetters} from 'vuex';

    import KvExpansionPanel from "./KvExpansionPanel"

    export default {
        name: "PairQuery",
        components: {KvExpansionPanel},
        data() {
            return {
                search: "",
                infoDialog: false,
                key: "",
                pairQueryType: "key",
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
                keys: [],
                panel: [true, false],
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
        methods: {
            openInfoDialog() {
                this.infoDialog = true
            },
            setKey() {
                this.key = this.search
            },
            searchKey() {
                this.isLoading = true;
                let url = "pair/keys?key=" + this.key;
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
                let cur = this.kvLocal[key]
                if (typeof cur === 'undefined')
                    return 0;
                else {
                    return cur.length
                }
            }
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
            key() {
                this.searchKey();
                this.keys.push(this.key)
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

<style>
    .radio-group2 .v-input__icon--append .v-icon {
        color: #2196F3;
        font-size: 15px;
    }

    .radio-group2 .v-input__append-outer {
        margin-left: -0.5em;
        margin-top: -0.7em !important;
        z-index: 1;
    }
</style>