<template>
    <v-app>
        <v-toolbar app>
            <v-toolbar-title class="headline text-uppercase">
                <span>METADATA</span>
                <span class="font-weight-light">Viewer</span>
            </v-toolbar-title>
            <!--<v-spacer></v-spacer>-->
            <v-btn flat href="http://gmql.eu" target="_blank"><span class="mr-2">GMQL</span></v-btn>
        </v-toolbar>

        <v-content>
            <!--<HelloWorld/>-->
            <MetadataDropDownList @filterChanged="handleFilterChange"/>
            <br>
            {{filter}}

        </v-content>
    </v-app>
</template>

<script>
    import HelloWorld from './components/HelloWorld'
    import MetadataDropDownList from "./components/MetadataDropDownList";

    export default {
        name: 'App',
        components: {
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
                console.log(filter);
                this.filter = filter;
            },
            getTitle(field) {
                return `${field.name} (${field.group})`
            }
        },
    }
</script>
