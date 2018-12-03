<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <!--<v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>-->
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Graph</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>

            <GraphViewer :sourceId="sourceId" class="graph--fullscreen"/>
        </v-card>
    </v-dialog>
</template>

<script>
    import GraphViewer from "./GraphViewer";

    export default {
        name: "FullScreenGraphViewer",
        components: {GraphViewer},
        props: {
            sourceId: {type: String, required: true},
            dialog: {type: Boolean, default:false},

        },
        data() {
            return {
                notifications: false,
                sound: true,
                widgets: false
            }
        },
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