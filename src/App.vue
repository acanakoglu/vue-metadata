<template>
    <v-app>
        <v-toolbar dark color="primary" app>
            <v-img :src="require('./assets/virusurf_logo.png')" contain max-width="39px" max-height="39px"></v-img>
            <v-btn flat @click="mainContent=true">
                <v-toolbar-title class="headline" style="font-size: 32px;text-transform: none !important;">
                    <span>Viru</span>
                    <span class="font-weight-light">Surf</span>
                </v-toolbar-title>
            </v-btn>
            <span style="font-size: 24px;">enabled by data from
                <a href="https://www.gisaid.org" target="_blank">
                    <img style="vertical-align: middle;" :src="require('./assets/gisaid.png')" alt="gisaid-logo"
                         height="24px"/>
                </a>
            </span>
            <!--            <span style="font-size: 24px">and GenBank.</span>-->
            <v-spacer></v-spacer>
            <v-btn flat href="/virusurf_gisaid/repo_static/contact.html" target="_blank">
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
                            <v-btn flat class="small-btn" small color='info' @click="afterQuerySelection()">
                                Clear Query
                            </v-btn>
                        </v-flex>  <!--clear all-->
                        <v-spacer></v-spacer>

                        <v-flex md4 sm8 class=" no-horizontal-padding">
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
                <!--                <PairQuery/>-->
                <div class="aa_div">
                    <h1>Amino acid variant search:</h1>
                    <label>Gene name (e.g. 'N', 'ORF3a', 'S'):</label>
                    <input type="text" id="gene_name" ref="gene_name" name="gene_name"><br>

                    <label>Product (e.g. 'N/D'):</label>
                    <input type="text" id="product" ref="product" name="product"><br>

                    <label>Amino acid change type (e.g. 'DEL', 'SUB',  'INS'):</label>
                    <input type="text" id="variant_aa_type" ref="variant_aa_type" name="variant_aa_type"><br>

                    <label>Variant position start (e.g. '1'):</label>
                    <input type="text" id="start_aa" ref="start_aa" name="start_aa"><br>

                    <label>Variant position end (e.g. '1000'):</label>
                    <input type="text" id="end_aa" ref="end_aa" name="end_aa"><br>

                    <label>Original amino acid (e.g. 'D', 'A', 'Q'):</label>
                    <input type="text" id="sequence_aa_original" ref="sequence_aa_original" name="sequence_aa_original"><br>

                    <label>Alternative amino acid (e.g. 'G', 'H', 'V'):</label>
                    <input type="text" id="sequence_aa_alternative" ref="sequence_aa_alternative" name="sequence_aa_alternative"><br>


                    <v-btn color="info"  value="Apply" @click="applyAA">Apply</v-btn>
                </div>
                <div class="result-div">
                    <v-tabs dark color="blue darken-1" v-model="selectedTab">
                        <v-tab>
                            Result items
                        </v-tab>
                        <v-tab-item>
                            <MetadataTable/>
                        </v-tab-item>
                    </v-tabs>
                </div>

                <v-footer app>
                    <v-flex
                            lighten-2
                            xs6
                            class="bottom-info"
                            style="font-size:12px;">
                        <div>GISAID data provided on this website is subject to GISAID’s <a
                                href="https://www.gisaid.org/registration/terms-of-use/" target="_blank">Terms
                            and Conditions</a>.
                        </div>
                    </v-flex>
                    <v-flex
                            lighten-2
                            text-xs-right
                            xs6
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
                    {
                        text: 'Example 1 - Sequences from Central America that are complete',
                        value: {
                            query: {
                                "gcm": {
                                    geo_group: ["central america"],
                                    is_complete: [true]
                                }, "type": "original", "kv": {}
                            }
                        }
                    },
                    {
                        text: 'Example 2 - Sequences of B.1.1 GISAID lineage with minimum length 29850 bases',
                        value: {
                            query: {
                                "gcm": {
                                    lineage: ["b.1.1"],
                                    length:{"min_val":29850,"max_val":null,"is_null":false}
                                }, "type": "original", "kv": {}
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
            ...mapActions(["setKv", "setKvFull", "deleteAge",'setAA']),
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
                    this.clearAA();
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
            },
            clearAA(){
                let query = {};
                for(const ref in this.$refs){
                    this.$refs[ref].value = ''
                }
                this.setAA(query)
            },
            applyAA(){
                let query = {};
                for(const ref in this.$refs){
                    const ref_val = this.$refs[ref];
                    if(ref_val.value)
                        query[ref] = ref_val.value;
                }
                this.setAA(query)
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
            },
            inputQuery() {
                this.inputValid = this.validateJson(this.inputQuery)
            }
        },
        computed: {
            ...mapState(['query', 'synonym', 'count', 'type', "panelActive", 'numerical']),
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
                    if (this.numerical.has(i)) {
                        a.push(i + ": {min_val: " + this.compound_query['gcm'][i]['min_val'] + ", max_val: " + this.compound_query['gcm'][i]['max_val'] + ", is_null: " + this.compound_query['gcm'][i]['is_null'] + "}")
                    } else {
                        let b = i + ": ['" + this.compound_query['gcm'][i].join("', '") + "']";
                        // b.replace("''","'N/D")
                        a.push(b.replace("''", "null"))
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

    .predef-q .v-input__control .v-text-field__details {
        display: none;
    }

    .small-btn {


    }

    .mytextarea {
        padding: 16px;
    }

    .aa_div input {
      border: 1px solid black;
    }

</style>
