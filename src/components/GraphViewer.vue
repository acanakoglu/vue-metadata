<template>
    <div>
        <div id="neo4jd3"></div>
    </div>
</template>

<script>
    export default {
        name: "GraphViewer",
        props: {
            sourceId: {type: String, required: false, default: '00580e36-eea0-455e-90e7-f5ee7bd1cd7b-msm'},
        },
        data() {
            return {
            }
        },

        mounted() {
            let neo4jd3 = new Neo4jd3('#neo4jd3', {
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