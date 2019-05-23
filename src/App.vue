<template>
    <v-app>
        <v-toolbar dark color="primary" app>
            <v-btn flat @click="mainContent=true">

                <v-toolbar-title class="headline text-uppercase">
                    <span>Repository</span>
                    <span class="font-weight-light">Viewer</span>
                </v-toolbar-title>
            </v-btn>
            <v-img
                    :src="require('./assets/logo.png')"
                    contain
                    height="64px"
            ></v-img>

            <v-spacer></v-spacer>
            <v-btn flat href="http://gmql.eu" target="_blank">
                <span class="mr-2">GMQL</span>
            </v-btn>
            <v-btn flat href="api" target="repository_browser_api"><span class="mr-2">API
                <span class="font-weight-light">doc</span></span>
            </v-btn>
            <v-btn flat href="https://github.com/acanakoglu/flask-metadata/wiki" target="_blank"><span
                    class="mr-2">Wiki</span></v-btn>
            <v-btn flat href="/repo-viewer/repo_static/contact.html" target="_blank">
                <span class="mr-2">Contacts</span>
            </v-btn>
        </v-toolbar>

        <v-content class="main-content">
            <v-content v-show="mainContent">
                <!--<v-layout column class="fab-container"> -->
                <v-container fluid grid-list-xl style="background:#f1f3f4">
                    <v-layout wrap align-center test>
                        <v-flex xs2 d-flex class="no-horizontal-padding">
                            <span class=label>Query utilities</span>
                        </v-flex>
                        <v-flex xs3 class=" no-horizontal-padding">
                            <v-select solo
                                      :items="queryItems"
                                      v-model="selectedQuery"
                                      label="Predefined queries"
                                      @input="afterQuerySelection"
                                      single-line
                            ></v-select>
                        </v-flex>
                        <v-flex xs1></v-flex>
                        <v-flex xs2 class="no-horizontal-padding">
                            <v-btn color='info' @click="afterQuerySelection()">Clear All</v-btn>
                        </v-flex>
                        <v-flex xs2 class="no-horizontal-padding">
                            <v-btn color='info' @click="downloadQuery">Download Query</v-btn>
                        </v-flex>
                        <v-flex xs2 class="no-horizontal-padding">
                            <text-reader @load="queryString = $event"></text-reader>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-container fluid grid-list-xl style="background:#FFFFFF">
                    <v-layout wrap align-center test style="background:#FFFFFF">
                        <v-flex xs2 d-flex class="no-horizontal-padding">
                            <span class=label>Data search</span>
                        </v-flex>
                        <v-flex xs4 class="no-horizontal-padding">
                            <v-radio-group :disabled=searchDisabled
                                           v-model="typeLocal" row
                                           class="radio-group2"
                                           append-icon="info"
                                           @click:append="openInfoDialog">
                                <v-radio label="Original" id="original" value="original"></v-radio>
                                <v-radio label="Synonym" id="synonym" value="synonym"></v-radio>
                                <v-radio label="Expanded" id="expanded" value="expanded"></v-radio>
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
                                        <p>Original: searches using metadata unchanged from the original data
                                            sources</p>
                                        <p>Synonym: searches using original metadata and ontological term and synonyms
                                            related to it</p>
                                        <p>Expanded: searches using original metadata, ontological terms, and their
                                            hypernyms and hyponyms</p>
                                    </v-card-text>

                                </v-card>
                            </v-dialog>
                        </v-flex>
                    </v-layout>
                    <v-layout wrap align-center test style="background:#FFFFFF">
                        <v-flex xs12 class="no-horizontal-padding">
                            <!--<div id="query" class="selected-query">-->
                            <span class="label">
                                Selected query:
                            </span>
                            <span style="font-family:monospace; font-size:120%;">
                                {{ queryToShow }}
                            </span>
                        </v-flex>
                    </v-layout>
                <MetadataDropDownList/>
                </v-container>

                <FullScreenViewer/>
                <PairQuery/>
                <div class="result-div">
                    <v-tabs dark color="blue darken-1" v-model="selectedTab">
                        <v-tab>
                            Source count
                        </v-tab>
                        <v-tab>
                            Dataset count
                        </v-tab>
                        <v-tab>
                            Result items
                        </v-tab>

                        <v-tab-item>
                            <CountTable countType="source"/>
                        </v-tab-item>
                        <v-tab-item>
                            <CountTable countType="dataset"/>
                        </v-tab-item>
                        <v-tab-item>
                            <MetadataTable/>
                        </v-tab-item>
                    </v-tabs>
                </div>
                <v-footer app>
                    <v-flex
                            lighten-2
                            text-xs-right
                            xs12
                            class="bottom-info">


                        <div v-if="count === null">Loading...</div>
                        <div style="font-size:1.5em; font-weight:bold;" v-else-if="count>0">{{count}} item<span
                                v-if="count>1">s</span> found
                        </div>
                        <div v-else>No result</div>

                    </v-flex>
                </v-footer>

            </v-content>
            <v-content v-show="!mainContent">
                <v-content>
                    <v-container fluid>

                        <v-list>
                            <v-list-tile>
                                <v-list-tile-content>
                                    <v-list-tile-title>Anna Bernasconi</v-list-tile-title>
                                    <v-list-tile-sub-title>
                                        <a href="mailto:anna.bernasconi@polimi.it">anna.bernasconi@polimi.it</a>
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                                <v-list-tile-content>
                                    <v-list-tile-title>Arif Canakoglu</v-list-tile-title>
                                    <v-list-tile-sub-title>
                                        <a href="mailto:arif.canakoglu@polimi.it">arif.canakoglu@polimi.it</a>
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                                <v-list-tile-content>
                                    <v-list-tile-title>Marco Masseroli</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile>
                                <v-list-tile-content>
                                    <v-list-tile-title>Stefano Ceri</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                        <p>Repository viewer is supported by the <a
                                href="http://www.bioinformatics.deib.polimi.it/geco/" target="GeCo">Data-Driven
                            Genomic Computing (GeCo)</a> project,
                            funded by the <a href="https://erc.europa.eu/" target="GeCo">European Research Center
                                (ERC)</a> (Advanced ERC Grant 693174).</p>

                    </v-container>
                </v-content>

            </v-content>
        </v-content>
    </v-app>
</template>

<script>
    import MetadataDropDownList from "./components/MetadataDropDownList";
    import MetadataTable from "./components/MetadataTable";
    import {mapMutations, mapState, mapActions, mapGetters} from 'vuex'
    import FullScreenViewer from "./components/FullScreenViewer";
    import CountTable from "./components/CountTable";
    import TextReader from "./components/TextReader"
    import PairQuery from "./components/PairQuery"

    export default {
        name: 'App',
        components: {
            FullScreenViewer,
            MetadataTable,
            MetadataDropDownList,
            CountTable,
            TextReader,
            PairQuery,
        },
        data() {
            return {
                mainContent: true,
                selectedQuery: null,
                queryItems: [
                    {text: 'Clear Fields', value: {synonym: false, query: {"gcm": {}, "type": "original", "kv": {}}},},
                    {
                        text: 'Encode source',
                        value: {query: {"gcm": {source: ["encode"]}, "type": "original", "kv": {}}},
                    },
                    {
                        text: 'Example 1 - disease content from multiple sources',
                        value: {
                            query: {
                                "gcm": {
                                    disease: ["prostate adenocarcinoma"],
                                    assembly: ["grch38"]
                                }, "type": "original", "kv": {}
                            }
                        }
                    },
                    {
                        text: 'Example 2 - towards big data',
                        value: {
                            query: {
                                "gcm": {
                                    tissue: ["adrenal gland"],
                                    feature: ["copy number variation", "rna binding protein"]
                                }, "type": "original", "kv": {},
                            }
                        }
                    },
                    {
                        text: 'Example 3 - synonym enriched search',
                        value: {
                            query: {
                                "gcm": {
                                    cell: ["gm12878"],
                                    assembly: ["hg19"],
                                    file_format: ["broadpeak"],
                                    technique: ["chip-seq"]
                                }, "type": "synonym", "kv": {}
                            }
                        }
                    },
                    {
                        text: 'Example 4 - experimental and annotation data',
                        value: {
                            query: {
                                "gcm": {content_type: ["exon", "exon quantifications"]}, "type": "original", "kv": {}
                            }
                        }
                    },
                    {
                        text: 'Example 5 - combined replicas',
                        value: {
                            query: {
                                "gcm": {
                                    project_name: ["tads"],
                                    biological_replicate_count: [2]
                                }, "type": "original", "kv": {}
                            }
                        }
                    },
                    {
                        text: 'Example X - expanded enriched search',
                        value: {
                            query: {
                                "gcm": {
                                    cell: ["gm12878"],
                                    assembly: ["hg19"],
                                    file_format: ["broadpeak"],
                                    technique: ["chip-seq"]
                                },
                                "type": "expanded",
                                "kv": {}
                            }
                        }
                    },
                ],
                selectedTab: 0,
                queryString: '',
                infoDialog: false

            }
        },
        methods: {
            ...mapMutations(['setQuery', 'setType', 'resetType', 'setQueryGraph', "resetKv"]),
            ...mapActions(["setKv", "setKvFull", "deleteAge"]),
            getFieldTitle(field) {
                return `${field.name} (${field.group})`
            },
            openInfoDialog() {
                this.infoDialog = true;
            },
            afterQuerySelection(item) {
                console.log(item);
                if(item) {
                    this.setQuery(item.query.gcm);
                    this.setKvFull(item.query.kv);
                    this.setType(item.query.type)
                }else{
                    this.resetType();
                    this.resetKv();
                    this.setType('original');
                }
                this.$nextTick(() => {
                    this.selectedQuery = null
                })
            },
            downloadQuery() {
                var text = JSON.stringify(this.compound_query);
                // console.log(text);
                var filename = "query.txt";
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            },
        },
        watch: {
            queryString() {
                if (this.queryString !== '') {
                    const json = JSON.parse(this.queryString);
                    this.setQuery(json['gcm']);
                    this.setType(json['type']);
                    this.resetKv();
                    this.setKvFull(json['kv']);
                    this.queryString = ''
                }
            }
        },
        computed: {
            ...mapState(['query', 'synonym', 'count', 'type', "panelActive"]),
            ...mapGetters({
                compound_query: 'build_query',

            }),
            searchDisabled() {
                return this.panelActive.length !== 0
            },
            queryToShow() {
                let a = [];
                for (let i in this.compound_query['gcm']) {
                    if (i === 'age') {
                        a.push(i + ": {min_age: " + this.compound_query['gcm'][i]['min_age'] + ", max_age: " + this.compound_query['gcm'][i]['max_age'] + ", null: " + this.compound_query['gcm'][i]['null'] + "}")
                    } else
                        a.push(i + ": ['" + this.compound_query['gcm'][i].join("', '") + "']")
                }
                return a.join(", ")
            },
            typeLocal: {
                get() {
                    return this.type;
                },
                set(value) {
                    if (value) {
                        this.setType(value)
                    } else {
                        this.resetType();
                    }
                }
            },
        },
    }
</script>
<style>
    .no-horizontal-padding {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }

    .main-content {
        padding-top: 10px !important;
        padding-bottom: 0 !important;

    }

    .result-div {
        margin-bottom: 1.5em;
        max-width: 100%;
    }

    .fab-container {
        position: absolute;
        /*top: 64px;*/
        right: 20px;
        z-index: 1;
    }

    .label {
        font-size: 1.3em;
        font-weight: bold;
        padding: 12px;
    }

    .radio-group .v-input__icon--append .v-icon {
        color: #2196F3;
        font-size: 15px;
    }

    .bottom-info {
        margin: 1.5em;
    }

    .v-input__append-outer {
        margin-left: -1.9em;
        margin-top: -0.7em !important;
        z-index: 1;
    }

    .selected-query {
        padding-top: 15px;
    }
</style>
