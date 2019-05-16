<template>
    <v-container fluid grid-list-xl class="second-color">
        <v-layout>
            <v-flex xs2 d-flex class="no-horizontal-padding">
                <span class=label>Key-value search</span>
            </v-flex>
            <v-flex xs2 class="no-horizontal-padding">
                <v-radio-group class="radio-group2"
                               append-icon="info"
                               @click:append="openInfoDialog"
                               v-model="pairQueryType"
                               row
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
                            <p>Value: free text search over all values, including original metadata and GCM field
                                values.</p>
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
            <v-flex d-flex shrink>
                <v-switch :disabled="searchDisabled" v-model="exact_match" label="Exact match"></v-switch>
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
                            Exact match
                        </v-card-title>

                        <v-card-text>
                            <p>When Exact match is disabled, the search is performed by checking the keys/values which
                                contain the input string.</p>
                            <p>When Exact match is enabled, the search is based on equality between the keys/values and
                                the input string.</p>
                            <p>Note that also spaces, punctuation and underscores are considered, both as first and last
                                characters.</p>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
        <v-expansion-panel>
            <KvExpansionPanel v-for="item in keys" :query_text="item['query_text']"
                              :query_type="item['query_type']" :id="item['id']" :key="item['id']" :exact_match="item['exact']"
                              :query="kvLocal[item['query_text']+'_'+item['id']]"
                              class="second-color"></KvExpansionPanel>
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
                exact_match: false,
            }
        },
        methods: {
            ...mapMutations(["pushKey", "setSearch", "resetPanelActive"]),
            openInfoDialog() {
                this.infoDialog = true
            },
            setKey() {
                if (this.search !== '') {
                    this.key = this.search.toLowerCase().replace(" ", "%20");
                    let last = this.keys[this.keys.length - 1];
                    let i;
                    if (last !== undefined) {
                        i = last['id'] + 1
                    } else {
                        i = 0;
                    }
                    let a = {
                        'id': i,
                        'query_text': this.key,
                        'query_type': this.pairQueryType,
                        'exact': this.exact_match
                    };
                    // window.alert(this.key + "_" + this.pairQueryType + this.exact_match+i);
                    this.pushKey(a);
                    this.search = ''
                } else {
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
                for (let i in kv) {
                    let a = kv[i];
                    let query_text = i.substring(0, i.lastIndexOf("_"));
                    let id = parseInt(i.substring(i.lastIndexOf("_") + 1));
                    let obj = {id: id, query_text: query_text, query_type: a['type_query'], exact: a['exact']};
                    let filtered = this.keys.filter(function (value) {
                        return value.id === obj.id
                    });
                    if (filtered.length===0)
                        this.pushKey(obj);
                }
                // this.setSearch(false)
            },
            keysEmpty() {
                if (this.keysEmpty)
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

    .info-icon {
        font-size: 15px
    }

    .info-button {
        width: 10px
    }
    .second-color{
        background:#f1f3f4!important;

    }
    .second-color .v-datatable{
        background:#f1f3f4!important;
    }
    .second-color .v-datatable .v-datatable__actions{
        background:#f1f3f4!important;
    }
</style>
