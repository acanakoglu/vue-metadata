<template>
    <div>
        <v-layout column class="fab-container">
            <v-switch v-model="vocabulary" label="Vocabulary" class="switch">
            </v-switch>
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

    export default {
        name: "GraphViewer",
        data() {
            return {
                vocabulary: false,
                neo4jd3:null,
            }
        },
        watch: {
            vocabulary() {
                this.updateGraph();
            }
        },
        methods: {
            createDivId() {
                return 'neo4jd3-' + this.sourceId
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
                    neo4jDataUrl: `api/item/${this.sourceId}/graph?voc=${this.vocabulary}`,
                    nodeRadius: 25,
                    onNodeDoubleClick: function (node) {
                        console.log('double click on node: ' + JSON.stringify(node));
                        console.log(neo4jd3.updateInfo(node))
                        /*switch(node.id) {
                            case '25':
                                // Google
                                window.open(node.properties.url, '_blank');
                                break;
                            default:
                                var maxNodes = 5,
                                    data = neo4jd3.randomD3Data(node, maxNodes);
                                neo4jd3.updateWithD3Data(data);
                                break;
                        }*/
                    },
                    // onRelationshipDoubleClick: function (relationship) {
                    //     console.log('double click on relationship: ' + JSON.stringify(relationship));
                    // },
                    zoomFit: false,
                });
                this.neo4jd3 = neo4jd3;

            }
        },

        mounted() {
            this.updateGraph()
        },
        computed: {
            ...mapState({
                sourceId: 'graphSourceId',
            }),
        }

    }
</script>

<style scoped>
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

    .fab-container {
        position: fixed;
        top: 48px;
        right: 20px;
    }
</style>