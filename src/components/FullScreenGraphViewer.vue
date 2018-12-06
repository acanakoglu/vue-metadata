<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <!--<v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>-->
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title v-if="sourceId1">Graph of item with source id :{{sourceId1}}</v-toolbar-title>
                <v-toolbar-title v-else-if="sourceId2">Extra information of item with source id : {{sourceId2}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeDialog">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>

            <GraphViewer v-if="sourceId1" class="graph--fullscreen"/>
            <PairsTable v-if="sourceId2"/>
            <div v-else-if="sourceId2">TABLE</div>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    import GraphViewer from "./GraphViewer";
    import PairsTable from "./PairsTable";

    export default {
        name: "FullScreenGraphViewer",
        components: {PairsTable, GraphViewer},
        data() {
            return {
                notifications: false,
                sound: true,
                widgets: false
            }
        },
        methods: {
            ...mapMutations([
                'closeDialog',
            ]),

        },
        computed: {
            ...mapGetters({
                dialog1: 'showGraphDialog',
                dialog2: 'showExtraMetadataDialog',
                sourceId1: 'graphSourceId',
                sourceId2: 'extraMetadataSourceId',
            }),
            dialog() {return this.dialog1 || this.dialog2} ,
        }
    }
</script>

<style scoped>
    .graph--fullscreen {
        /*border-radius: 0;*/
        /*margin: 0;*/
        height: 100vh;
        width: 100%;
        /*position: fixed;*/
        /*overflow-y: auto;*/
        /*top: 0;*/
        /*left: 0;*/
    }

</style>