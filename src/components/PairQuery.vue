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
                            :disabled="searchDisabled"
                            single-line
                            hide-details
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-expansion-panel>
                <KvExpansionPanel v-for="(item, i) in keys" :query_key="item" :key="item"></KvExpansionPanel>
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
    </v-container>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';

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
                valueHeaders: [
                    {text: 'Value', value: 'value', sortable: false},
                    {text: 'Count', value: 'count', sortable: false},
                    {text: 'Selected', value: 'selected', sortable: false},
                ],
                keysLocal: [],
                panel: [true, false],
                // selectedValues: [],
                possibleValues: [],
            }
        },
        methods: {
            ...mapMutations(["pushKey"]),
            openInfoDialog() {
                this.infoDialog = true
            },
            setKey() {
                this.key = this.search
                this.pushKey(this.key)
            },
        },
        computed: {
            ...mapGetters({
                compound_query: 'build_query'
            }),
            ...mapState({
                keys: 'keys',
                searchDisabled: 'searchDisabled',
            }),
        },
        watch: {
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