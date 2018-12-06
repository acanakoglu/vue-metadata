<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <!--<v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>-->
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Graph of {{sourceId}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeGraphDialog">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>

            <GraphViewer v-if="dialog" class="graph--fullscreen"/>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    import GraphViewer from "./GraphViewer";

    export default {
        name: "FullScreenGraphViewer",
        components: {GraphViewer},
        data() {
            return {
                notifications: false,
                sound: true,
                widgets: false
            }
        },
        methods: {
            ...mapMutations([
                'closeGraphDialog',
            ]),
        },
        computed: {
            ...mapGetters({
                dialog: 'showGraphDialog',
                sourceId: 'graphSourceId',
            }),
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