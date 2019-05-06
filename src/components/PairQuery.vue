<template>
    <v-container fluid grid-list-xl>
        <v-layout>
            <v-flex xs2 class="no-horizontal-padding">
                <v-radio-group label="Key-value search" class="radio-group2"
                               append-icon="info"
                               @click:append="openInfoDialog"
                               v-model="pairQueryType"
                               :disabled="searchDisabled">
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
                            <p>Value: free text search over all values, including original metadata and GCM field values.</p>
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
            <KvExpansionPanel v-for="item in keys" :query_text="item.substring(0,item.lastIndexOf('_'))"
                              :query_type="pairQueryType" :key="item" :query="kvLocal[item]"></KvExpansionPanel>
        </v-expansion-panel>
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
                kvLocal: {},
            }
        },
        methods: {
            ...mapMutations(["pushKey","setSearch","resetPanelActive"]),
            openInfoDialog() {
                this.infoDialog = true
            },
            setKey() {
                if (this.search !== '') {
                    this.key = this.search;
                    this.pushKey(this.key + "_" + this.pairQueryType);
                    this.search=''
                }
                else {
                    window.alert("Please input a search keyword")
                }
            },
        },
        computed: {
            ...mapGetters({
                compound_query: 'build_query',
                keysEmpty: "keysEmpty"
            }),
            ...mapState({
                keys: 'keys',
                panelActive: "panelActive",
            }),
            searchDisabled() {
                return this.panelActive.length !== 0
            },
        },
        watch: {
            compound_query() {
                let kv = this.compound_query['kv'];
                this.kvLocal = kv;
                for (let i in kv)
                    if(!this.keys.includes(i))
                        this.pushKey(i);
                // this.setSearch(false)
            },
            keysEmpty() {
                if(this.keysEmpty)
                    this.resetPanelActive()
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
