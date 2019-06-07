<template>
    <v-app>
        <v-toolbar dark color="primary" app>
        <v-img :src="require('./assets/geco_logo.png')" contain max-width="40px" max-height="40px"></v-img>
            <v-btn flat  @click="mainContent=true">
                <v-toolbar-title class="headline" style = "text-transform: none !important;">
                    <span>Geno</span>
                    <span class="font-weight-light">Surf</span>
                </v-toolbar-title>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn flat href="http://gmql.eu" target="_blank">
                <span class="mr-2">GMQL</span>
            </v-btn>
            <v-btn flat href="api" target="repository_browser_api"><span class="mr-2">API
                <span class="font-weight-light">doc</span></span>
            </v-btn>
            <v-btn flat href="https://github.com/acanakoglu/flask-metadata/wiki" target="_blank"><span
                    class="mr-2">Wiki</span></v-btn>
            <v-btn flat href="/genosurf/repo_static/contact.html" target="_blank">
                <span class="mr-2">Contacts</span>
            </v-btn>
        </v-toolbar>
        <v-content class="main-content">
            <v-content v-show="mainContent">
                <!--<v-layout column class="fab-container"> -->
                <v-container fluid grid-list-xl style="background:#f1f3f4">
                    <v-layout wrap align-center test>
                        <v-flex md2 sm2 d-flex class="no-horizontal-padding">
                            <span class=label>Query:</span>
                        </v-flex>  <!--query utils-->
                        <v-flex md1 sm2 class="no-horizontal-padding">
                            <v-btn flat class="small-btn" small color='info' @click="afterQuerySelection()">Clear</v-btn>
                        </v-flex>  <!--clear all-->
                        <v-flex md1 sm2 class="no-horizontal-padding">
                            <v-dialog v-model="dialogShowQuery">
                                <v-btn flat class="small-btn" dark small
                                       slot="activator"
                                       color="info"
                                >Modify
                                </v-btn>
                                <v-card>
                                    <v-card-title
                                            class="headline blue lighten-4"
                                            primary-title
                                    >
                                        Copy, modify or paste query
                                    </v-card-title>
                                    <v-alert type="error" :value="true" v-if="!inputValid">
                                        Input is not valid
                                    </v-alert>
                                    <v-textarea class="mytextarea"
                                            v-model="queryInput"
                                    >
                                    </v-textarea>

                                    <v-divider></v-divider>

                                    <v-card-actions>
                                        <v-btn
                                                color="primary"
                                                flat
                                                @click="toClipboard()"
                                        >
                                            Copy to clipboard
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                                :disabled=!inputValid
                                                color="primary"
                                                flat
                                                @click="setInputQuery"
                                        >
                                            Apply
                                        </v-btn>
                                        <v-btn
                                                color="primary"
                                                flat
                                                @click="dialogShowQuery = false"
                                        >
                                            Close
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-flex>  <!--modify-->

                        <v-flex md1 sm2 class="no-horizontal-padding">
                            <text-reader @load="queryString = $event"></text-reader>
                        </v-flex>  <!--upload query-->

                        <v-flex md1 sm2 class="no-horizontal-padding">
                            <v-btn flat  class="small-btn" small color='info' @click="downloadQuery">Download</v-btn>
                        </v-flex>  <!--download query-->

                        <v-spacer></v-spacer>

                        <v-flex  md4 sm8 class=" no-horizontal-padding">
                            <v-select solo
                                      dense
                                      :menu-props='{"maxHeight":1000}'
                                      class="predef-q"
                                      :items="queryItems"
                                      v-model="selectedQuery"
                                      label="Chose a predefined query"
                                      @input="afterQuerySelection"
                                      single-line
                            ></v-select>
                        </v-flex> <!--predefined queries-->
                    </v-layout>
                </v-container>
                <v-container fluid grid-list-xl style="background:#FFFFFF">
                    <v-layout wrap align-center test style="background:#FFFFFF">
                        <v-flex xs2 d-flex class="no-horizontal-padding">
                            <span class=label>Data search:</span>
                        </v-flex>
                        <v-flex xs10 class="no-horizontal-padding">
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
                                        <p>Synonym: searches using original metadata, ontological terms, and synonyms
                                            related to them</p>
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
                        <div style="font-size:1.4em;" v-else-if="count>0">{{count}} item<span
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
                        <p>GenoSurf is supported by the <a
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
                inputValid: true,
                inputQuery: "",
                dialogShowQuery: false,
                mainContent: true,
                selectedQuery: null,
                queryItems: [
                    //{text: 'Clear Fields', value: {synonym: false, query: {"gcm": {}, "type": "original", "kv": {}}},},
                    {
                        text: 'Only ENCODE source',
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
                        text: 'Example 2 - different data for specific tissue',
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
                        text: 'Example 4 - ontology enriched search',
                        value: {
                            query: {
                                "gcm": {
                                    tissue: ["intestine"],
                                    assembly: ["hg19"],
                                    file_format: ["broadpeak"]
                                },
                                "type": "expanded",
                                "kv": {}
                            }
                        }
                    },
                    {
                        text: 'Example 5 - experimental and annotation data',
                        value: {
                            query: {
                                "gcm": {
                                    content_type: ["exon", "exon quantifications"]
                                }, "type": "original", "kv": {}
                            }
                        }
                    },
                    {
                        text: 'Example 6 - combined replicas',
                        value: {
                            query: {
                                "gcm": {
                                    assembly: ["grch38"],
                                    tissue: ["liver"],
                                    technique: ["chip-seq"],
                                    target: ["rad21"],
                                    content_type: ["peaks and background as input for idr"],
                                    biological_replicate_count: ["2"]
                                }, "type": "original", "kv": {}
                            }
                        }
                    },
                    {
                        text: 'Example 7 - using the value-search',
                        value: {
                            query: {
                                "gcm": {
                                    source: ["encode"],
                                    file_format: ["narrowpeak"],
                                    cell: ["k562"],
                                    technique: ["chip-seq"]
                                },
                                "type": "original",
                                "kv": {
                                    idr_peaks_0: {
                                        "type_query": "value",
                                        "exact": false,
                                        "query": {
                                            "gcm": {"content_type": ["optimal idr thresholded peaks"]},
                                            "pairs": {}
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        text: 'Example 8 - combining different data types',
                        value: {
                            query: {
                                "gcm": {
                                    disease: ["breast invasive carcinoma"],
                                    assembly: ["grch38"],
                                    data_type: ["gene expression quantification", "methylation beta value", "masked somatic mutation"],
                                    is_healthy: ["false"],
                                    age: {min_age: 9490, max_age: 14600, is_null: false}
                                },
                                "type": "original",
                                "kv": {}
                            }
                        }
                    },
                    {
                        text: 'Example 9 - using source specific metadata ',
                        value: {
                            query: {
                                "gcm": {
                                    source: ["roadmap epigenomics"],
                                    technique: ["dnase-seq"],
                                    cell: ["h1 cells"]
                                },
                                "type": "original",
                                "kv": {
                                    hotspot_0: {
                                        "type_query": "value",
                                        "exact": true,
                                        "query": {"gcm": {"pipeline": ["hotspot"]}, "pairs": {}}
                                    },
                                    "open%20chromatin_1": {
                                        "type_query": "value",
                                        "exact": false,
                                        "query": {"gcm": {"feature": ["open chromatin"]}, "pairs": {}}
                                    },
                                    broad_2: {
                                        "type_query": "value",
                                        "exact": false,
                                        "query": {"gcm": {}, "pairs": {"manually_curated__region_type": ["broad"]}}
                                    },
                                    fdr_3: {
                                        "type_query": "key",
                                        "exact": false,
                                        "query": {"gcm": {}, "pairs": {"manually_curated__fdr_threshold": ["0.01"]}}
                                    }
                                }
                            }
                        }
                    },
                ],
                selectedTab: 0,
                queryString: '',
                infoDialog: false,
                fields: []
            }
        },
        mounted() {
            const url = `field`;

            window.addEventListener('beforeunload', null)


            this.fields = [];

            // eslint-disable-next-line
            axios.get(url)
                .then((res) => {
                    return res.data
                })
                .then((res) => {
                    for (let i in res.fields) {
                        this.fields.push(res.fields[i].name)
                    }
                });
        },
        methods: {
            ...mapMutations(['setQuery', 'setType', 'resetType', 'setQueryGraph', "resetKv", "resetQuery"]),
            ...mapActions(["setKv", "setKvFull", "deleteAge"]),
            setInputQuery() {
                this.queryString = this.inputQuery
                this.dialogShowQuery = false
            },
            getFieldTitle(field) {
                return `${field.name} (${field.group})`
            },
            openInfoDialog() {
                this.infoDialog = true;
            },
            afterQuerySelection(item) {
                console.log(item);
                if (item) {
                    this.setQuery(item.query.gcm);
                    this.setKvFull(item.query.kv);
                    this.setType(item.query.type)
                } else {
                    this.resetQuery();
                    this.resetType();
                    this.resetKv();
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
            toClipboard() {
                this.$copyText(JSON.stringify(this.compound_query)).then(function (e) {
                    alert('Copied');
                    console.log(e);
                }, function (e) {
                    alert('Can not copy');
                    console.log(e);
                })
            },
            validateJson(input) {
                var a = null;
                try {
                    a = JSON.parse(input);
                } catch (e) {
                    return false;
                }
                let keys = Object.keys(a);
                //check if all three major query elements are present
                let allKeys = (keys.includes("gcm") && keys.includes("type") && keys.includes("kv"));

                if (!allKeys) {
                    return false;
                }

                //check if type is correct value
                let type = a['type'];
                let typeCorrect = (type === 'original' || type === 'synonym' || type === 'expanded')

                //check if a field in gcm query element is valid
                let b = Object.keys(a['gcm']);
                let allFields = this.arrayContainsArray(this.fields, b);


                return allKeys && allFields && typeCorrect
            },
            arrayContainsArray(superset, subset) {
                return subset.every(function (value) {
                    return (superset.indexOf(value) >= 0);
                });
            }
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
            },
            inputQuery() {
                this.inputValid = this.validateJson(this.inputQuery)
            }
        },
        computed: {
            ...mapState(['query', 'synonym', 'count', 'type', "panelActive"]),
            ...mapGetters({
                compound_query: 'build_query',

            }),
            queryInput: {
                get() {
                    return JSON.stringify(this.compound_query)
                },
                set(value) {
                    this.inputQuery = value
                }
            },
            searchDisabled() {
                return this.panelActive.length !== 0
            },

            queryToShow() {
                let a = [];
                for (let i in this.compound_query['gcm']) {
                    if (i === 'age') {
                        a.push(i + ": {min_age: " + this.compound_query['gcm'][i]['min_age'] + ", max_age: " + this.compound_query['gcm'][i]['max_age'] + ", is_null: " + this.compound_query['gcm'][i]['is_null'] + "}")
                    } else {
                        let b = i + ": ['" + this.compound_query['gcm'][i].join("', '") + "']";
                        // b.replace("''","'N/D")
                        a.push(b.replace("''","null"))
                    }

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

    .predef-q .v-input__control .v-text-field__details{
        display: none;
    }

    .small-btn{


    }

    .mytextarea{
        padding: 16px;
    }
</style>
