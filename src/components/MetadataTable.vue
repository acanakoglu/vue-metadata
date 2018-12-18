<template>
    <v-card>
        <!--{{query}}-->
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
                disable-initial-sort
        >
            <template slot="items" slot-scope="props">
                <td v-for="header in headers" :key="header.value">
                    <span v-if="header.is_link"><a :href="props.item[header.value]" target="_blank">link</a></span>
                    <span v-else-if="header.value === 'graph'">
                        <v-btn flat icon color="blue" @click="graphClicked(props.item)">
                            <v-icon>group_work</v-icon>
                        </v-btn>

                    </span>
                    <span v-else-if="header.value === 'extra'">
                        <v-btn flat icon color="blue" @click="extraMetadataClicked(props.item)">
                            <v-icon>list</v-icon>
                        </v-btn>
                    </span>
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
    import {mapMutations, mapState} from 'vuex'

    const sourceIdColumnName = 'source_id';

    export default {
        name: "MetadataTable",
        data() {
            return {

                isLoading: false,
                search: '',
                result: []
            }
        },
        watch: {
            query() {
                this.applyQuery();
            },
            synonym() {
                this.applyQuery();
            },
        },
        mounted() {
            //load all the results
            this.applyQuery();
        },
        methods: {
            ...mapMutations([
                'openGraphDialog',
                'openExtraMetadataDialog'
            ]),
            graphClicked(row) {
                this.openGraphDialog(row[sourceIdColumnName])
            },
            extraMetadataClicked(row) {
                this.openExtraMetadataDialog(row[sourceIdColumnName])
            },
            applyQuery() {
                // console.log('test');

                const url = `query/table?voc=${this.synonym}`;
                this.isLoading = true;
                this.result = [];

                // eslint-disable-next-line
                axios.post(url, this.query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        console.log("hello");
                        return res.map((t)=>{
                            t.local_url = t.local_url.replace("www.gmql.eu", "genomic.deib.polimi.it");
                            t.local_url = t.local_url + "?authToken=DOWNLOAD-TOKEN";
                            return t;
                        });
                    })
                    .then((res) => {
                        // console.log(res);
                        this.result = res;
                        this.isLoading = false;
                    });

            },
        },
        computed: {
            ...mapState(['query', 'synonym',]),
            sortable() {return this.result.length < 100;},
            headers() {
                return [
                    {text: 'Graph', value: 'graph', sortable: false,},
                    {text: 'Extra', value: 'extra', sortable: false,},

                    {text: 'Source ID', value: sourceIdColumnName, sortable: this.sortable,},
                    // {text: 'size', value: 'size'},
                    // {text: 'date', value: 'date'},
                    // {text: 'checksum', value: 'checksum'},
                    {text: 'Pipeline', value: 'pipeline', sortable: this.sortable,},
                    {text: 'Platform', value: 'platform', sortable: this.sortable,},
                    {text: 'Source URI', value: 'source_url', sortable: false, is_link: true,},
                    {text: 'Local URI', value: 'local_url', sortable: false, is_link: true,},
                    {text: 'Dataset', value: 'name', sortable: this.sortable,},
                    {text: 'Data Type', value: 'data_type', sortable: this.sortable,},
                    {text: 'File Format', value: 'format', sortable: this.sortable,},
                    {text: 'Assembly', value: 'assembly', sortable: this.sortable,},
                    {text: 'Annotation Type', value: 'annotation', sortable: this.sortable,},
                    {text: 'Technique', value: 'technique', sortable: this.sortable,},
                    {text: 'Feature', value: 'feature', sortable: this.sortable,},
                    {text: 'Target', value: 'target', sortable: this.sortable,},
                    {text: 'Antibody', value: 'antibody', sortable: this.sortable,}
                ];
            },
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