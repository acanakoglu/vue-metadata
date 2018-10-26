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
        >
            <template slot="items" slot-scope="props">
                <td v-for="header in headers">{{props.item[header.value]}}</td>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
            </v-alert>
            <v-alert slot="no-data" :value="true" color="error" icon="warning">
                Sorry, nothing to display here :(
            </v-alert>
        </v-data-table>
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
                    {text: 'source_id', value: 'source_id'},
                    {text: 'size', value: 'size'},
                    {text: 'date', value: 'date'},
                    {text: 'pipeline', value: 'pipeline'},
                    {text: 'platform', value: 'platform'},
                    {text: 'source_url', value: 'source_url'},
                    {text: 'local_url', value: 'local_url'},
                    {text: 'name', value: 'name'},
                    {text: 'data_type', value: 'data_type'},
                    {text: 'format', value: 'format'},
                    {text: 'assembly', value: 'assembly'},
                    {text: 'annotation', value: 'annotation'},
                    {text: 'technique', value: 'technique'},
                    {text: 'feature', value: 'feature'},
                    {text: 'target', value: 'target'},
                    {text: 'antibody', value: 'antibody'}
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
                console.log('test');

                const url = `/api/query/`;
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

</style>