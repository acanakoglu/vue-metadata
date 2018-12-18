<template>
    <v-app>
        <v-toolbar app>
            <v-toolbar-title class="headline text-uppercase">
                <span>Repository</span>
                <span class="font-weight-light">Viewer</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat href="http://gmql.eu" target="_blank"><span class="mr-2">GMQL</span></v-btn>
            <v-btn flat href="api" target="repository_browser_api"><span class="mr-2">API
                <span class="font-weight-light">doc</span></span>
            </v-btn>
            <v-btn flat href="#" target=""><span class="mr-2">Contact</span></v-btn>
        </v-toolbar>
        <v-layout column class="fab-container">
            <v-switch v-model="synonymLocal" label="Synonym" class="switch"/>

        </v-layout>

        <v-content class="main-content">
            <MetadataDropDownList/>
            <FullScreenGraphViewer/>
            <div>
                <span class="label ">
                    Selected query:
                </span>
                {{query}}
            </div>
            <div class="result-div">
                <MetadataTable/>
            </div>

        </v-content>
    </v-app>
</template>

<script>
    import MetadataDropDownList from "./components/MetadataDropDownList";
    import MetadataTable from "./components/MetadataTable";
    import {mapMutations, mapState} from 'vuex'
    import FullScreenGraphViewer from "./components/FullScreenViewer";

    export default {
        name: 'App',
        components: {
            FullScreenGraphViewer,
            MetadataTable,
            MetadataDropDownList,
        },
        // data() {
        //     return {
        //         synonym: null,
        //     }
        // },
        methods: {
            ...mapMutations(['setSynonym']),
            getFieldTitle(field) {
                return `${field.name} (${field.group})`
            }
        },
        computed: {
            ...mapState(['query', 'synonym']),
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

        }
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

    .switch {
        margin-bottom: -10px;

    }

    .fab-container {
        position: absolute;
        top: 64px;
        right: 20px;
        z-index: 1;
    }

    .label {
        font-size: 1.3em;
        font-weight: bold;
        padding: 12px;
    }

</style>