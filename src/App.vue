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

            <v-btn flat @click="mainContent=false">
                <span class="mr-2">Contact</span>
            </v-btn>
        </v-toolbar>

        <v-content class="main-content">
            <v-content v-show="mainContent">
                <!--<v-layout column class="fab-container"> -->
                <v-container fluid grid-list-xl>
                    <v-layout wrap align-center test>
                        <v-flex xs2 d-flex class="no-horizontal-padding">
                            <span class = label>General Settings </span>
                        </v-flex>
                        <v-flex xs2 class="no-horizontal-padding">
                            <v-switch v-model="synonymLocal" label="Synonym" class="switch"/>
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
                            <v-btn color='info' @click="downloadQuery">Download Query</v-btn>
                        </v-flex>
                        <v-flex xs2 class="no-horizontal-padding">
                            <text-reader @load="queryString = $event"></text-reader>
                        </v-flex>
                    </v-layout>
                    <v-layout wrap align-center test>
                        <v-flex xs12 class="no-horizontal-padding">
                            <!--<div id="query" class="selected-query">-->
                                <span class="label">
                                    Selected query:
                                </span>
                                {{ compound_query }}
                            <!--</div>-->
                        </v-flex>
                    </v-layout>
                </v-container>

                <!--</v-layout>-->

                <MetadataDropDownList/>
                <FullScreenGraphViewer/>
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
                        <div v-else-if="count>0">{{count}} item<span
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
                                href="http://www.bioinformatics.deib.polimi.it/GeCo/?home" target="GeCo">Data-Driven
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
    import {mapMutations, mapState, mapGetters} from 'vuex'
    import FullScreenGraphViewer from "./components/FullScreenViewer";
    import CountTable from "./components/CountTable";
    import TextReader from "./components/TextReader"

    export default {
        name: 'App',
        components: {
            FullScreenGraphViewer,
            MetadataTable,
            MetadataDropDownList,
            CountTable,
            TextReader,
        },
        data() {
            return {
                mainContent: true,
                selectedQuery: null,
                queryItems: [
                    {text: 'Clear Fields', value: {synonym: false, query: {}},},
                    {text: 'Encode source', value: {synonym: false, query: {source: ["encode"]}},},
                    {
                        text: 'Example 1 - disease content from multiple sources',
                        value: {
                            synonym: false,
                            query: {
                                disease: ["prostate adenocarcinoma"],
                                assembly: ["grch38"],
                            }
                        }
                    },
                    {
                        text: 'Example 2 - towards big data',
                        value: {
                            synonym: false,
                            query: {
                                tissue: ["adrenal gland"],
                                feature: ["copy number variation", "rna binding protein"],
                            }
                        }
                    },
                    {
                        text: 'Example 3 - synonym enriched search',
                        value: {
                            synonym: true,
                            query: {
                                cell: ["gm12878"],
                                assembly: ["hg19"],
                                format: ["broadpeak"],
                                technique: ["chip-seq"],
                            }
                        }
                    },
                    {
                        text: 'Example 4 - experimental and annotation data',
                        value: {
                            synonym: false,
                            query: {
                                content_type: ["exon", "exon quantifications"],
                            }
                        }
                    },
                    {
                        text: 'Example 5 - combined replicas',
                        value: {
                            synonym: false,
                            query: {
                                project_name: ["tads"],
                                biological_replicate_number: [2],
                            }
                        }
                    },
                ],
                selectedTab: 0,
                queryString: '',

            }
        },
        methods: {
            ...mapMutations(['setQuery', 'setType', 'resetType', 'setKv', 'setSynonym', 'setQueryGraph']),
            getFieldTitle(field) {
                return `${field.name} (${field.group})`
            },
            afterQuerySelection(item) {
                console.log(item);
                this.setQuery(item.query);
                this.setSynonym(item.synonym);
                this.$nextTick(() => {
                    this.selectedQuery = null
                })
            },
            downloadQuery() {
                var text = JSON.stringify(this.compound_query);
                console.log(text);
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
            // selectedTab() {
            //     if (this.selectedTab == 3) {
            //         this.setQueryGraph(true);
            //         this.selectedTab = 999;
            //     }
            // },
            queryString() {
                const json = JSON.parse(this.queryString)
                this.setQuery(json['gcm'])
                this.setType(json['type'])
                this.setKv(json['kv'])
            }
        },
        computed: {
            ...mapState(['query', 'synonym', 'count']),
            ...mapGetters({
                compound_query: 'build_query'
            }),
            synonymLocal: {
                get() {
                    // console.log("GET synonym " + this.synonym);
                    return this.synonym;
                },
                set(value) {
                    // console.log("SET synonym " + value);
                    this.setSynonym(value);
                    if (value) {
                        this.setType('synonym')
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

    /*.¬ {*/
    /*margin-bottom: -10px;*/

    /*}*/

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

    .bottom-info {
        margin: 1.5em;
    }

    .selected-query {
        padding-top: 15px;
    }
</style>
