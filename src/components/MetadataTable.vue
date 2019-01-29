<template>
    <v-card>
        <v-card-title>
            <!--<v-flex-->
            <!--lighten-2-->
            <!--xs12-->
            <!--&gt;-->
            <div v-if="isLoading">Loading...</div>
            <div v-else-if="result.length===1000" class="center">Shown up to 1000 items</div>
            <div v-else-if="result.length>0">Shown {{result.length}} item<span
                    v-if="result.length>1">s</span>
            </div>
            <div v-else>No result</div>
            <!--</v-flex>-->
            <v-spacer></v-spacer>
            <v-dialog
                    full-width
                    v-model="dialogGmql"
            >
                <v-btn dark
                       slot="activator"
                       small color="blue lighten-2"
                >
                    GMQL
                </v-btn>


                <v-card>
                    <v-card-title
                            class="headline blue lighten-4"
                            primary-title
                    >
                        GMQL query
                    </v-card-title>
                    <v-progress-linear height="2" class="progress" :indeterminate="gmqlProgress"></v-progress-linear>


                    <v-card-text>
                        <p> Click "COPY TO CLIPBOARD" button and use whole query in
                            <a href="http://gmql.eu/" target="gmql">GMQL interface</a>.

                            One statement extracts the selected items from a single dataset.
                            All datasets are unified into a single dataset for further use.
                            <br>
                            Please refer to
                            <a href="http://www.bioinformatics.deib.polimi.it/genomic_computing/GMQLsystem/documentation.html"
                               target="gmql_doc">
                                GMQL documentation
                            </a>
                            for specific use of querying language.

                            <br>
                            Beware union of big datasets may result in long execution times.
                        </p>

                        <v-textarea
                                label="GMQL query"
                                :value="gmqlQuery"
                        ></v-textarea>
                    </v-card-text>


                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn
                                color="primary"
                                flat
                                @click="toClipboard()"
                        >
                            Copy to clipboard
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="primary"
                                flat
                                @click="dialogGmql = false"
                        >
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <v-dialog
                    v-model="dialogDownload"
                    width="500"
            >
                <v-btn dark
                       slot="activator"
                       small color="blue lighten-2"
                >
                    Download
                </v-btn>


                <v-card>
                    <v-card-title
                            class="headline blue lighten-4"
                            primary-title
                    >
                        Download region files
                    </v-card-title>
                    <v-progress-linear height="2" class="progress"
                                       :indeterminate="downloadProgress"></v-progress-linear>


                    <v-card-text>
                        <p>
                            Click the "Download" button below to download a "files.txt" file that contains the list of
                            the URLs of the region data files related to the result items.
                        </p>
                        <p>
                            The following command using cURL can be used to download all the files in the list:
                            <br>
                            <code>xargs -L 1 curl -J -O -L &lt; files.txt</code>
                        </p>


                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn
                                color="primary"
                                flat
                                @click="download()"
                        >
                            Download
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="primary"
                                flat
                                @click="dialogDownload = false"
                        >
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <!--<v-text-field-->
            <!--v-model="search"-->
            <!--append-icon="search"-->
            <!--label="Search"-->
            <!--single-line-->
            <!--hide-details-->
            <!--&gt;</v-text-field>-->
        </v-card-title>
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
                    <span v-if="header.is_link">
                        <a v-if="props.item[header.value]" :href="props.item[header.value]" target="_blank">link</a>
                        <span v-else>N/A</span>
                    </span>
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

    </v-card>
</template>

<script>
    import {mapMutations, mapState} from 'vuex';

    const sourceIdColumnName = 'source_id';

    export default {
        name: "MetadataTable",
        data() {
            return {
                downloadProgress: false,
                gmqlProgress: false,
                dialogDownload: false,
                dialogGmql: false,
                gmqlQuery: "",
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
            dialogGmql() {
                if (this.dialogGmql) {
                    this.gmqlProgress = true;
                    this.gmqlQuery = "Loading!";

                    const url = `query/gmql?voc=${this.synonym}`;


                    // eslint-disable-next-line
                    axios.post(url, this.query)
                        .then((res) => {
                            return res.data
                        })
                        .then((res) => {
                            // console.log(res);
                            this.gmqlQuery = res;
                            this.gmqlProgress = false;
                        });

                }
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
                        return res.map((t) => {
                            if (t.local_url) {
                                t.local_url = t.local_url.replace("www.gmql.eu", "genomic.deib.polimi.it");
                                t.local_url = t.local_url + "?authToken=DOWNLOAD-TOKEN";
                            }
                            return t;
                        });
                    })
                    .then((res) => {
                        // console.log(res);
                        this.result = res;
                        this.isLoading = false;
                    });

            },
            download() {
                this.downloadProgress = true;
                const urlDownload = `query/download?voc=${this.synonym}`;

                // eslint-disable-next-line
                axios.post(urlDownload, this.query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        const url = window.URL.createObjectURL(new Blob([res]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'files.txt');
                        document.body.appendChild(link);
                        link.click();
                        this.downloadProgress = false;
                    });
            },
            toClipboard() {
                this.$copyText(this.gmqlQuery).then(function (e) {
                    alert('Copied');
                    console.log(e);
                }, function (e) {
                    alert('Can not copy');
                    console.log(e);
                })


            },
        },
        computed: {
            ...mapState(['query', 'synonym',]),
            sortable() {
                return this.result.length < 1000;
            },
            headers() {
                return [
                    {text: 'Graph', value: 'graph', sortable: false,},
                    {text: 'Extra', value: 'extra', sortable: false,},

                    {text: 'Source ID', value: sourceIdColumnName, sortable: this.sortable,},
                    // {text: 'size', value: 'size'},
                    // {text: 'date', value: 'date'},
                    // {text: 'checksum', value: 'checksum'},
                    {text: 'Content type', value: 'content_type', sortable: this.sortable,},
                    {text: 'Platform', value: 'platform', sortable: this.sortable,},
                    {text: 'Pipeline', value: 'pipeline', sortable: this.sortable,},

                    {text: 'Source URI', value: 'source_url', sortable: false, is_link: true,},
                    {text: 'Local URI', value: 'local_url', sortable: false, is_link: true,},

                    {text: 'Dataset', value: 'dataset_name', sortable: this.sortable,},
                    {text: 'Data Type', value: 'data_type', sortable: this.sortable,},
                    {text: 'File Format', value: 'file_format', sortable: this.sortable,},
                    {text: 'Assembly', value: 'assembly', sortable: this.sortable,},
                    {text: 'Is annotation', value: 'is_annotation', sortable: this.sortable,},

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

    .progress {
        margin: 0;
    }

    .data-table {
        /*margin-bottom: 1.5em;*/
    }
</style>
