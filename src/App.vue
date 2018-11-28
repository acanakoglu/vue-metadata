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

        <v-content class="main-content">
            <!--<HelloWorld/>-->
            <MetadataDropDownList @filterChanged="handleFilterChange"/>
            {{filter}}
            <div class="result-div">
                <MetadataTable
                        :filter="filter"
                ></MetadataTable>
            </div>

        </v-content>
    </v-app>
</template>

<script>
    import HelloWorld from './components/HelloWorld'
    import MetadataDropDownList from "./components/MetadataDropDownList";
    import MetadataTable from "./components/MetadataTable";
    import GraphViewer from "./components/GraphViewer";

    export default {
        name: 'App',
        components: {
            GraphViewer,
            MetadataTable,
            MetadataDropDownList,
            HelloWorld
        },
        data() {
            return {
                filter: {},
            }
        },
        methods: {
            handleFilterChange(filter) {
                // console.log(filter);
                this.filter = filter;
            },
            getTitle(field) {
                return `${field.name} (${field.group})`
            }
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
</style>