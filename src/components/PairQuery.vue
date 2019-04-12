<template>
    <v-container fluid grid-list-xl>
        <h1>Pair Query</h1>
        <v-content v-if="pairQueryType=='key'" class="no-horizontal-padding">
            <v-layout>
                <v-flex xs2 class="no-horizontal-padding">
                    <v-radio-group label="Pair search" class="radio-group2"
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
                                Data search
                            </v-card-title>

                            <v-card-text>
                                TODO text
                            </v-card-text>

                        </v-card>
                    </v-dialog>
                </v-flex>
                <v-flex xs6>
                    <v-text-field
                            v-model="search"
                            append-icon="search"
                            @click:append="setKey"
                            label="Search"
                            single-line
                            hide-details
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-expansion-panel>
                <v-expansion-panel-content v-for="(item,i) in keys" :key="i">
                    <div slot="header">{{item}}</div>
                    <v-card>
                        <v-card-title class="headline blue lighten-4"
                                      secondary-title>
                            GCM
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
                                    <span v-else-if="header.value==='selected'">
                                        <v-checkbox></v-checkbox>
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
                            PAIRS
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
                                    <span v-else-if="header.value==='selected'">
                                        <v-checkbox></v-checkbox>
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
                                    :items="resultsValues"
                                    :loading="isLoading"
                                    class="data-table"
                            >
                                <template slot="items" slot-scope="props">
                                    <td v-for="header in valueHeaders" :key="header.value">
                                        <span v-if="header.value==='selected'">
                                        <v-checkbox></v-checkbox>
                                    </span>
                                        <span v-else v-html="updateCellTextFormat(props.item[header.value])"></span>
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
        {{keys}}
    </v-container>
</template>

<script>
    // import {mapMutations, mapState, mapGetters} from 'vuex';

    export default {
        name: "PairQuery",
        data() {
            return {
                search: "",
                infoDialog: false,
                key: "",
                pairQueryType: "key",
                headers: [
                    {text: 'Key', value: 'key', sortable: false},
                    {text: 'Selected', value: 'selected', sortable: false},
                    {text: 'Values', value: 'values', sortable: false},
                    // {text: 'Values', value: 'values', sortable: false},
                ],
                valueHeaders: [
                    {text: 'Value', value: 'value', sortable: false},
                    {text: 'Count', value: 'count', sortable: false},
                    {text: 'Selected', value: 'selected', sortable: false},
                ],
                resultsValues: [],
                resultsGcm: [],
                resultsPair: [],
                isLoading: false,
                keys: [],
                panel: [],
                keyDummy: "key",
                valuesDialog: false,
                keyToSearch: "",
                isGcm: true,
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
                axios.post(url)
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
        },
        watch: {
            key() {
                this.searchKey();
                this.keys.push(this.key)
            },
            valuesDialog() {
                if (this.valuesDialog) {
                    this.isLoading = true;
                    let url = "pair/" + this.keyToSearch + "/values?is_gcm=" + this.isGcm;
                    console.log(url)
                    // eslint-disable-next-line
                    axios.get(url)
                        .then((res) => {
                            return res.data
                        })
                        .then((res) => {
                            console.log(res);
                            this.resultsValues = res;
                            this.isLoading = false
                        });
                } else {
                    this.keyToSearch = "";
                    this.resultsValues = [];
                }
            },
        }
    }
</script>

<style>
    .radio-group2 .v-input__icon--append .v-icon {
        /*color: #2196F3;*/
        color: rebeccapurple;
        font-size: 15px;
    }

    .radio-group2 .v-input__append-outer {
        margin-left: -0.5em;
        margin-top: -0.7em !important;
        z-index: 1;
    }
</style>