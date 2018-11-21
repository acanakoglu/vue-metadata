<template>
    <v-card>
        <!--<v-card-title>-->
        <!--Result-->
        <!--<v-spacer></v-spacer>-->
        <!--<v-text-field-->
        <!--v-model="search"-->
        <!--append-icon="search"-->
        <!--label="Search"-->
        <!--single-line-->
        <!--hide-details-->
        <!--&gt;</v-text-field>-->
        <!--</v-card-title>-->
        <v-data-table
                :headers="headers"
                :items="result"
                :search="search"
                :loading="isLoading"
                class="data-table"
        >
            <template slot="items" slot-scope="props">
                <td v-for="header in headers" :key="header">
                    <span v-if="header.is_link"><a :href="props.item[header.value]" target="_blank">link</a></span>
                    <span v-else>{{props.item[header.value]}}</span>
                </td>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
            </v-alert>

            <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading">
                Sorry, nothing to display here :(
            </v-alert>
            <v-alert slot="no-data" :value="true" color="info" icon="info" v-else>
                Loading
            </v-alert>
        </v-data-table>
        <!--TODO  move this to outer layer-->
        <v-footer app>
            <v-flex
                    lighten-2
                    text-xs-right
                    xs12
                    class="bottom-info">
                <div v-if="isLoading">Loading...</div>
                <div v-else-if="result.length===100" class="center">Found 100 or more than 100 items</div>
                <div v-else-if="result.length>0">{{result.length}} item<span
                        v-if="result.length>1">s</span> found
                </div>
                <div v-else>No result</div>

            </v-flex>
        </v-footer>
    </v-card>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "MetadataTable",
        props: {
            filter: {type: Object, required: true,},
        },
        data() {
            return {
                isLoading: false,
                search: '',
                headers: [
                    {text: 'Source ID', value: 'source_id'},
                    // {text: 'size', value: 'size'},
                    // {text: 'date', value: 'date'},
                    // {text: 'checksum', value: 'checksum'},
                    {text: 'Pipeline', value: 'pipeline'},
                    {text: 'Platform', value: 'platform'},
                    {text: 'Source URI', value: 'source_url', is_link: true},
                    {text: 'Local URI', value: 'local_url', is_link: true},
                    {text: 'Dataset', value: 'name'},
                    {text: 'Data Type', value: 'data_type'},
                    {text: 'File Format', value: 'format'},
                    {text: 'Assembly', value: 'assembly'},
                    {text: 'Annotation Type', value: 'annotation'},
                    {text: 'Technique', value: 'technique'},
                    {text: 'Feature', value: 'feature'},
                    {text: 'Target', value: 'target'},
                    {text: 'Antibody', value: 'antibody'}
                ],
                result: []
            }
        },
        watch: {
            filter() {
                this.applyFilter();
            }
        },
        methods: {
            applyFilter() {
                // console.log('test');

                const url = `query/`;
                this.isLoading = true;
                this.result = [];


                axios.post(url, this.filter)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        // console.log(res);
                        this.result = res;
                        this.isLoading = false;
                    });

            }
        },
        created() {
            //load all the results
            this.applyFilter();
        }

    }
</script>

<style scoped>
    .bottom-info {
        margin: 1.5em;
    }

    .data-table {
        /*margin-bottom: 1.5em;*/
    }
</style>