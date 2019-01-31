<template>
    <div>
        <v-layout column class="fab-container">
            <v-switch v-if="sourceId" v-model="vocabulary" label="Vocabulary" class="switch">
            </v-switch>
            <div v-if="showQueryGraph" v-for="view in views">
                <v-switch class="switch" :label="view.label" v-model="view.active"></v-switch>
            </div>
            <v-select
                    v-if="showQueryGraph"
                    v-model="limit"
                    label="Number of Items"
                    :items="limit_options">
            </v-select>

            <v-btn @click="neo4jd3.zoomFit(1)" icon>
                <v-icon large>cached</v-icon>
            </v-btn>

        </v-layout>

        <div :id="createDivId()"></div>
        <!--<v-layout v-else :id="createDivId()+'-false'"></v-layout>-->

    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import vSelect from 'vue-select'
    import Vue from 'vue'

    Vue.component('v-select', vSelect);

    export default {
        name: "GraphViewer",
        data() {
            return {
                vocabulary: false,
                neo4jd3: null,
                limit: 5,
                limit_options: Array.from({length: 20 / 5}, (x, i) => (i + 1) * 5),
                views: [
                    {value: 'biological_view', label: 'Biological View', active: true},
                    {value: 'management_view', label: 'Management View', active: true},
                    {value: 'technological_view', label: 'Technological View', active: true},
                    {value: 'extraction_view', label: 'Extraction View', active: true},
                ]
            }
        },
        watch: {
            vocabulary() {
                this.updateGraph();
            },
            views: {
                handler() {
                    this.updateGraph()
                },
                deep: true
            },
            limit() {
                this.updateGraph()
            },
        },
        methods: {
            createDivId() {
                // return 'neo4jd3-' + this.sourceId
                return 'neo4jd3-'
            },
            updateGraph() {
                // the error was 'neo4jd3' is assigned a value but never used (no-unused-vars)
                // eslint-disable-next-line
                let neo4jd3 = new Neo4jd3('#' + this.createDivId(), {
                    highlight: [
                        {
                            class: 'Project',
                            property: 'name',
                            value: 'neo4jd3'
                        }, {
                            class: 'User',
                            property: 'userId',
                            value: 'eisman'
                        }
                    ],
                    icons: {},
                    images: {},
                    minCollision: 60,
                    // neo4jDataUrl: `api/item/${this.sourceId}/graph?voc=${this.vocabulary}`,
                    nodeRadius: 25,
                    onNodeDoubleClick: function (node) {
                        console.log('double click on node: ' + JSON.stringify(node));
                        // console.log(neo4jd3.updateWithNeo4jData(node))
                        var id = node.id;
                        var label = node.labels[0];
                        //GET DATA FROM API
                        var url = `item/${label}/${id}/relations`;
                        // eslint-disable-next-line
                        axios.get(url)
                            .then((res) => {
                                return res.data
                            })
                            .then((res) => {
                                neo4jd3.updateWithNeo4jData(res);
                            });
                        // eslint-disable-next-line
                        axios.get(`item/${id}/count`).then((res) => {
                            return res.data
                        })
                            .then((res) => {
                                if (res > 30) {
                                    window.alert("Showing only 30 relationship of " + res + " for node " + id)
                                }
                            });
                    },
                    // onNodeMouseEnter: function(node) {
                    //     console.log('Mouse enter on node: '+ node.id)
                    // },
                    // onRelationshipDoubleClick: function (relationship) {
                    //     console.log('double click on relationship: ' + JSON.stringify(relationship));
                    // },
                    zoomFit: false,
                });
                this.neo4jd3 = neo4jd3;
                if (this.sourceId) {
                    const url = `item/${this.sourceId}/graph?voc=${this.vocabulary}`;
                    // eslint-disable-next-line
                    axios.get(url)
                        .then((res) => {
                            return res.data
                        })
                        .then((res) => {
                            neo4jd3.updateWithNeo4jData(res);
                        });
                } else if (this.showQueryGraph) {
                    var includeViews = "";
                    var x;
                    this.views.forEach(function (view) {
                        includeViews += `&${view.value}=${view.active}`
                    });
                    const url = `query/graph?limit=${this.limit}` + includeViews;
                    axios.post(url, this.query)
                        .then((res) => {
                            return res.data
                        })
                        .then((res) => {
                            neo4jd3.updateWithNeo4jData(res)
                        });
                }
            }
        },

        mounted() {
            this.updateGraph()
        }
        ,
        computed: {
            ...
                mapState({
                    sourceId: 'graphSourceId',
                    queryGraph: 'query',
                    showQueryGraph: 'showGraphQuery',
                    query: 'query',
                }),
        }

    }
</script>

<style>
    .neo4jd3 {
        /*border-radius: 0;*/
        /*margin: 0;*/
        height: 100%;
        width: 100%;
        /*position: fixed;*/
        /*overflow-y: auto;*/
        /*top: 0;*/
        /*left: 0;*/
    }

    .switch {
        margin-bottom: -10px;

    }

    .v-menu__content {
        z-index: 1000 !important;
    }

    .fab-container {
        position: fixed;
        top: 48px;
        right: 20px;
    }
</style>