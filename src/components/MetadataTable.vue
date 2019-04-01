<template>
    <v-card>
        <v-card-title>
            <!--<v-flex-->
            <!--lighten-2-->
            <!--xs12-->
            <!--&gt;-->
            <div v-if="isLoading">Loading...</div>
            <div v-else-if="count===1000" class="center">Shown up to 1000 items</div>
            <div v-else-if="count>0">Shown {{result.length}} item<span
                    v-if="count>1">s</span>
            </div>
            <div v-else>No result</div>
            <!--</v-flex>-->
            <v-dialog v-model="dialogOrder">
                <v-card>
                    <v-card-title
                            class="headline blue lighten-4"
                            primary-title
                    >
                        Column order
                    </v-card-title>
                    <v-card-text>
                        <draggable v-model="headers" @start="drag=true" @end="drag=false">
                            <v-list v-for="element in headers" :key="element.value">
                                <v-checkbox :label=element.text v-model=element.show></v-checkbox>
                            </v-list>
                        </draggable>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="primary"
                                flat
                                @click="dialogOrder = false"
                        >
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <v-btn dark
                       slot="activator"
                       small color="blue lighten-2"
                >
                    Order
                </v-btn>
            </v-dialog>
            <v-btn color='info' @click="downloadTable">Download Results</v-btn>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-label>Replicated</v-label>
            <span style="padding-right: 1em"></span>
            <v-switch label="Aggregated" v-model=agg_mode></v-switch>
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
                    width="500">
                <v-btn dark
                       slot="activator"
                       small color="blue lighten-2">
                    Download
                </v-btn>

                <v-card>
                    <v-card-title
                            class="headline blue lighten-4"
                            primary-title>
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
                                @click="download()">
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
                :headers="selected_headers"
                :items="result"
                :loading="isLoading"
                class="data-table"
                :pagination.sync="pagination"
                :rows-per-page-items="pagination.rowsPerPageItems"
                :total-items="pagination.totalItems"
        >
            <template slot="items" slot-scope="props">
                <td v-for="header in selected_headers" :key="header.value" v-show="header.show">
                    <span v-if="header.is_link">
                        <a v-if="props.item[header.value]" :href="props.item[header.value]" target="_blank">link</a>
                        <span v-else>N/D</span>
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
                    <span v-else v-html="updateCellTextFormat(props.item[header.value])"></span>
                </td>
            </template>
            <!--            <v-alert slot="no-results" :value="true" color="error" icon="warning">-->
            <!--                Your search for "{{ search }}" found no results.-->
            <!--            </v-alert>-->

            <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading">
                Sorry, nothing to display here :(
            </v-alert>
            <v-alert slot="no-results" :value="true" color="info" icon="info" v-else>
                Loading
            </v-alert>
        </v-data-table>
    </v-card>
</template>

<script>

    import {mapMutations, mapState, mapGetters} from 'vuex';
    import draggable from 'vuedraggable'

    const itemSourceIdName = 'item_source_id';

    export default {
        name: "MetadataTable",
        components: {
            draggable
        },
        data() {
            return {
                downloadProgress: false,
                gmqlProgress: false,
                dialogDownload: false,
                dialogGmql: false,
                gmqlQuery: "",
                isLoading: false,
                search: '',
                result: [],
                agg_mode: true,
                download_table: '',
                dialogOrder: false,
                headers: [
                    {text: 'Extra', value: 'extra', sortable: false, show: true},
                    {text: 'Source', value: 'source', sortable: this.sortable, show: true},
                    {text: 'Source ID', value: itemSourceIdName, sortable: this.sortable, show: true},
                    {text: 'Source URI', value: 'source_url', sortable: false, is_link: true, show: true},
                    {text: 'Local URI', value: 'local_url', sortable: false, is_link: true, show: true},

                    {text: 'Assembly', value: 'assembly', sortable: this.sortable, show: true},
                    {text: 'Data Type', value: 'data_type', sortable: this.sortable, show: true},

                    {text: 'Technique', value: 'technique', sortable: this.sortable, show: true},
                    {text: 'Feature', value: 'feature', sortable: this.sortable, show: true},
                    {text: 'Target', value: 'target', sortable: this.sortable, show: true},

                    {text: 'Biosample Type', value: 'biosample_type', sortable: this.sortable, show: true},
                    {text: 'Cell', value: 'cell', sortable: this.sortable, show: true},
                    {text: 'Tissue', value: 'tissue', sortable: this.sortable, show: true},
                    {text: 'Disease', value: 'disease', sortable: this.sortable, show: true},
                    {text: 'Healthy', value: 'is_healthy', sortable: this.sortable, show: true},

                    {text: 'Gender', value: 'gender', sortable: this.sortable, show: true},
                    {text: 'Age', value: 'age', sortable: this.sortable, show: true},
                    {text: 'Ethnicity', value: 'ethnicity', sortable: this.sortable, show: true},

                    {text: 'Dataset', value: 'dataset_name', sortable: this.sortable, show: true},
                    {text: 'File Format', value: 'file_format', sortable: this.sortable, show: true},
                    {text: 'Is annotation', value: 'is_annotation', sortable: this.sortable, show: true},

                    {text: 'Content type', value: 'content_type', sortable: this.sortable, show: true},
                    {text: 'Platform', value: 'platform', sortable: this.sortable, show: true},

                    {text: 'Pipeline', value: 'pipeline', sortable: this.sortable, show: true},
                    {text: 'Antibody', value: 'antibody', sortable: this.sortable, show: true},

                    {text: 'Source Site', value: 'source_site', sortable: this.sortable, show: true},
                    {text: 'Project Name', value: 'project_name', sortable: this.sortable, show: true},

                    {
                        text: 'Biological Replicate Number',
                        value: 'biological_replicate_number',
                        sortable: this.sortable,
                        show: false
                    },
                    {
                        text: 'Technical Replicate Number',
                        value: 'technical_replicate_number',
                        sortable: this.sortable,
                        show: false
                    },

                    {text: 'Species', value: 'species', sortable: this.sortable, show: false},
                    // {text: 'External Reference', value: 'external_reference', sortable: this.sortable,show: false}

                    // {text: 'size', value: 'size'},
                    // {text: 'date', value: 'date'},
                    // {text: 'checksum', value: 'checksum'},
                ],
                pagination: {
                    descending: false,
                    page: 1,
                    rowsPerPage: 10,
                    sortBy: itemSourceIdName,
                    totalItems: 0,
                    rowsPerPageItems: [10, 100, 1000] //mani che si alzano
                },
            }
        },
        watch: {
            compound_query() {
                this.applyQuery();
            },
            synonym() {
                this.applyQuery();
            },
            agg_mode() {
                this.applyQuery();
            },
            pagination: {
                handler() {
                    this.applyQuery(false);
                },
                deep: true
            },
            dialogGmql() {
                if (this.dialogGmql) {
                    this.gmqlProgress = true;
                    this.gmqlQuery = "Loading!";

                    const url = `query/gmql?voc=${this.synonym}`;

                    // eslint-disable-next-line
                    axios.post(url, this.compound_query)
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
                'openExtraMetadataDialog',
                'setCount'
            ]),
            graphClicked(row) {
                this.openGraphDialog(row[itemSourceIdName])
            },
            extraMetadataClicked(row) {
                this.openExtraMetadataDialog(row[itemSourceIdName])
            },
            applyQuery(changeCount = true) {
                if (changeCount) {
                    var count_url = 'query/count';
                    // eslint-disable-next-line
                    axios.post(count_url, this.compound_query)
                        .then((res) => {
                            return res.data
                        })
                        .then((res) => {
                            this.setCount(res)
                            this.pagination.totalItems = res
                        });
                }
                var orderDir = "";

                if (this.pagination.descending)
                    orderDir = "DESC";
                else
                    orderDir = "ASC";

                const url = `query/table?agg=${this.agg_mode}&page=${this.pagination.page}&num_elems=${this.pagination.rowsPerPage}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}`;
                this.isLoading = true;
                this.result = [];
                // eslint-disable-next-line
                axios.post(url, this.compound_query)
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
                // if(changeCount) {
                // const csv_url = `query/table?agg=${this.agg_mode}&page=1&num_elems=${this.pagination.totalItems}`;
                // // eslint-disable-next-line
                // axios.post(csv_url, this.compound_query)
                //     .then((res) => {
                //         return res.data
                //     })
                //     .then((res) => {
                //         this.download_table = res
                //     });
                // }
            },
            download() {
                this.downloadProgress = true;
                const urlDownload = `query/download?voc=${this.synonym}`;

                // eslint-disable-next-line
                axios.post(urlDownload, this.compound_query)
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
            updateCellTextFormat(input) {
                var temp = input;
                if (temp === null)
                    temp = 'N/D';
                temp = temp.replace(/\|/g, "|<br/>")
                return temp
            },
            json2csv(input) {
                var json = input;
                console.log(json[0]);
                var fields = Object.keys(json[0]);
                var replacer = function (key, value) {
                    return value === null ? 'N/D' : value
                };
                var csv = json.map(function (row) {
                    return fields.map(function (fieldName) {
                        return JSON.stringify(row[fieldName], replacer)
                    }).join(',')
                });
                csv.unshift(fields.join(','));

                // console.log(csv.join('\r\n'));
                return csv.join('\r\n')
            },
            downloadTable() {
                const csv_url = `query/table?agg=${this.agg_mode}&page=1&num_elems=${this.pagination.totalItems}`;
                // eslint-disable-next-line
                axios.post(csv_url, this.compound_query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        const text = this.json2csv(res);
                        const filename = "result.csv";
                        const element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                        element.setAttribute('download', filename);
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    });
            }
        },
        computed: {
            ...mapState(['synonym', 'count']),
            ...mapGetters({
                compound_query: 'build_query'
            }),
            sortable() {
                return this.result.length < 1000;
            },
            // headers() {
            //     return [
            //         {text: 'Extra', value: 'extra', sortable: false,},
            //
            //         {text: 'Source ID', value: itemSourceIdName, sortable: this.sortable,},
            //         // {text: 'size', value: 'size'},
            //         // {text: 'date', value: 'date'},
            //         // {text: 'checksum', value: 'checksum'},
            //         {text: 'Content type', value: 'content_type', sortable: this.sortable,},
            //         {text: 'Platform', value: 'platform', sortable: this.sortable,},
            //         {text: 'Pipeline', value: 'pipeline', sortable: this.sortable,},
            //
            //         {text: 'Source URI', value: 'source_url', sortable: false, is_link: true,},
            //         {text: 'Local URI', value: 'local_url', sortable: false, is_link: true,},
            //
            //         {text: 'Dataset', value: 'dataset_name', sortable: this.sortable,},
            //         {text: 'Data Type', value: 'data_type', sortable: this.sortable,},
            //         {text: 'File Format', value: 'file_format', sortable: this.sortable,},
            //         {text: 'Assembly', value: 'assembly', sortable: this.sortable,},
            //         {text: 'Is annotation', value: 'is_annotation', sortable: this.sortable,},
            //
            //         {text: 'Technique', value: 'technique', sortable: this.sortable,},
            //         {text: 'Feature', value: 'feature', sortable: this.sortable,},
            //         {text: 'Target', value: 'target', sortable: this.sortable,},
            //         {text: 'Antibody', value: 'antibody', sortable: this.sortable,},
            //
            //         {
            //             text: 'Biological Replicate Number',
            //             value: 'biological_replicate_number',
            //             sortable: this.sortable,
            //         },
            //         {text: 'Technical Replicate Number', value: 'technical_replicate_number', sortable: this.sortable,},
            //
            //         {text: 'Biosample Type', value: 'biosample_type', sortable: this.sortable,},
            //         {text: 'Disease', value: 'disease', sortable: this.sortable,},
            //         {text: 'Tissue', value: 'tissue', sortable: this.sortable,},
            //         {text: 'Cell', value: 'cell', sortable: this.sortable,},
            //         {text: 'Healthy', value: 'is_healthy', sortable: this.sortable,},
            //
            //         {text: 'Species', value: 'species', sortable: this.sortable,},
            //         {text: 'Gender', value: 'gender', sortable: this.sortable,},
            //         {text: 'Age', value: 'age', sortable: this.sortable,},
            //         {text: 'Ethnicity', value: 'ethnicity', sortable: this.sortable,},
            //
            //         {text: 'Source Site', value: 'source_site', sortable: this.sortable,},
            //         {text: 'External Reference', value: 'external_reference', sortable: this.sortable,},
            //
            //         {text: 'Project Name', value: 'project_name', sortable: this.sortable,},
            //         {text: 'Source', value: 'source', sortable: this.sortable,}
            //     ];
            // },
            // hiddenHeaders() {
            //     []
            // },
            selected_headers() {
                var x;
                var res = [];
                for (x in this.headers) {
                    if (this.headers[x].show) {
                        res.push(this.headers[x]);
                    }
                }
                return res;
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
