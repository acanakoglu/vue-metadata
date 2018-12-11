<template>
    <div>
        <v-layout :id="createDivId()"></v-layout>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "GraphViewer",
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
                    neo4jDataUrl: `api/item/${this.sourceId}/graph`,
                    nodeRadius: 25,
                    onNodeDoubleClick: function (node) {
                        console.log('double click on node: ' + JSON.stringify(node));
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
                    onRelationshipDoubleClick: function (relationship) {
                        console.log('double click on relationship: ' + JSON.stringify(relationship));
                    },
                    zoomFit: true
                });

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
        height: 90vh;
        width: 100%;
        /*position: fixed;*/
        /*overflow-y: auto;*/
        /*top: 0;*/
        /*left: 0;*/
    }
</style>