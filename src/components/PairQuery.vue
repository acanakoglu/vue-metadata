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
            <v-expansion-panel >
                <v-expansion-panel-content
                        v-for="key in keys"
                        :key="key"
                        :value="key">
                    <v-card>
                        <v-card-title class="headline blue lighten-4"
                                      primary-title>
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
                                </td>
                            </template>
                        </v-data-table>
                    </v-card>
                    <v-card>
                        <v-card-title class="headline blue lighten-4"
                                      primary-title>PAIRS
                        </v-card-title>
                        <v-data-table
                                :headers="headers"
                                :items="resultsPair"
                                :loading="isLoading"
                                class="data-table"
                        >
                            <template slot="items" slot-scope="props">
                                <td v-for="header in headers" :key="header.value">
                                </td>
                            </template>
                        </v-data-table>
                    </v-card>
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
        {{panel}}
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
                ],
                resultsGcm: [],
                resultsPair: [],
                isLoading: false,
                keys: [],
                panel: [],
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
                        this.resultsPair = res['pairs']
                        this.isLoading = false
                    });
            }
        },
        watch: {
            key() {
                this.searchKey();
                this.keys.push(this.key)
            }
        }
    }
</script>

<style>
    .radio-group2 .v-input__icon--append .v-icon {
        /*color: #2196F3;*/
        color: rebeccapurple;
        font-size: 15px;
    }

    .v-input__append-outer {
        margin-left: -1.6em;
        margin-top: -0.7em !important;
        z-index: 1;
    }
</style>