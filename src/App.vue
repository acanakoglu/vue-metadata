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
                        <v-flex xs12 sm2 md2 d-flex class="label no-horizontal-padding">
                            General settings:
                        </v-flex>
                        <v-flex xs12 sm2 md2 class="no-horizontal-padding">
                            <v-switch v-model="synonymLocal" label="Synonym" class="switch"/>
                        </v-flex>
                        <v-flex xs12 sm6 md6 class=" no-horizontal-padding">
                            <v-select solo
                                      :items="queryItems"
                                      v-model="selectedQuery"
                                      label="Predefined queries"
                                      @input="afterQuerySelection"
                                      single-line
                            ></v-select>
                        </v-flex>

                    </v-layout>
                </v-container>

                <!--</v-layout>-->

                <MetadataDropDownList/>
                <FullScreenGraphViewer/>
                <div class="selected-query">
                    <span class="label">
                        Selected query:
                    </span>
                    {{query}}
                </div>
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
                        <v-tab>
                            Graph
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
                        <v-tab-item>
                            GRAPH
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
    import {mapMutations, mapState} from 'vuex'
    import FullScreenGraphViewer from "./components/FullScreenViewer";
    import CountTable from "./components/CountTable";

    export default {
        name: 'App',
        components: {
            FullScreenGraphViewer,
            MetadataTable,
            MetadataDropDownList,
            CountTable,
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
            }
        },
        methods: {
            ...mapMutations(['setQuery', 'setSynonym', 'setQueryGraph']),
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
        },
        watch: {
            selectedTab() {
                if (this.selectedTab == 3) {
                    this.setQueryGraph(true);
                    this.selectedTab = 999;
                }
            }
        },
        computed: {
            ...mapState(['query', 'synonym', 'count']),
            synonymLocal: {
                get() {
                    // console.log("GET synonym " + this.synonym);
                    return this.synonym;
                },
                set(value) {
                    // console.log("SET synonym " + value);
                    this.setSynonym(value);
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
