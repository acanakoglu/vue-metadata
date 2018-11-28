<template>
    <div>
        <link rel="stylesheet" href="./css/neo4jd3.css">
        <!--<script src="graph/static/js/neo4jd3.js"></script>-->
        <div id="neo4jd3"></div>
        <!--import('../assets/js/d3.min.js')-->
    </div>
</template>

<script>
    // var slide = require('./graph/static/js/neo4jd3.js');
    //     import Neo4jd3 from '../../../neo4jd3/dist/js/neo4jd3.min'
    //     var slide = require('../../../neo4jd3/dist/js/neo4jd3.min');


    // @import '../assets/js/d3.min.js'

    // import Neo4jd3 from  '../assets/js/neo4jd3.js';


    export default {
        name: "GraphViewer",
        props: {
            sourceId: {type: String, required: false, default: '00580e36-eea0-455e-90e7-f5ee7bd1cd7b-msm'},
        },
        data() {
            return {
                // sourceId: '00580e36-eea0-455e-90e7-f5ee7bd1cd7b-msm',
            }
        },

        mounted() {
            // this.$scriptLoader.load('./graph/static/js/d3.min.js');


            var neo4jd3 = new Neo4jd3('#neo4jd3', {
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
                neo4jDataUrl: `api/query/item/${this.sourceId}/graph`,
                nodeRadius: 25,
                onNodeDoubleClick: function (node) {
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
                    //console.log('double click on relationship: ' + JSON.stringify(relationship));
                },
                zoomFit: true
            });
        },
    }
</script>

<style scoped>

</style>