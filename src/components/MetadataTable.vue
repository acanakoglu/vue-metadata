<template>
    <v-card>
        <v-card-title>
            <!--<v-flex-->
            <!--lighten-2-->
            <!--xs12-->
            <!--&gt;-->
            <!--            <div v-if="isLoading">Loading...</div>-->
            <!--            <div v-else-if="count===1000" class="center">Shown up to 1000 items</div>-->
            <!--            <div v-else-if="count>0">Shown {{result.length}} item<span-->
            <!--                    v-if="count>1">s</span>-->
            <!--            </div>-->
            <!--            <div v-else>No result</div>-->
            <!--</v-flex>-->
            <v-container fluid grid-list-xs>
                <v-layout justify-space-between row>
                    <v-flex m4 align-self-center>
                       <!-- <v-dialog
                                v-model="dialogGmql"
                        >
                            <v-btn dark
                                   slot="activator"
                                   small
                                   color="blue lighten-2"
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
                                <v-progress-linear height="2" class="progress"
                                                   :indeterminate="gmqlProgress"></v-progress-linear>


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

                                    <v-textarea v-if="count<=1000"
                                                label="GMQL query"
                                                :value="gmqlQuery"
                                    ></v-textarea>
                                    <v-alert outline color="info" :value="true" v-else>Dataset too big to generate GMQL
                                        query, please select a smaller dataset (less than 1000 items)
                                    </v-alert>
                                </v-card-text>


                                <v-divider></v-divider>

                                <v-card-actions>
                                    <v-btn
                                            v-if="count<=500"
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
                        </v-dialog>-->
                        <v-dialog
                                v-model="dialogDownloadTable"
                                width="500">
                            <v-btn dark
                                   slot="activator"
                                   small
                                   color="blue lighten-2">
                                Download Table
                            </v-btn>

                            <v-card>
                                <v-card-title
                                        class="headline blue lighten-4"
                                        primary-title>
                                    Download metadata table
                                </v-card-title>
                                <v-progress-linear height="2" class="progress"
                                                   :indeterminate="downloadProgress"></v-progress-linear>
                                <v-card-text>
                                    <p>
                                        Click the "Download" button below to download a "result.csv" file that contains
                                        the comma-separated version of the table shown in the "RESULT ITEMS" section,
                                        preserving user defined fields order.
                                    </p>
                                    <p>
                                        Please check size of selection.
                                        Beware that downloading tables with many files may result in long waiting time.
                                    </p>
                                </v-card-text>
                                <v-divider></v-divider>

                                <v-card-actions>
                                    <v-btn
                                            color="primary"
                                            flat
                                            @click="downloadTable">
                                        Download
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                            color="primary"
                                            flat
                                            @click="dialogDownloadTable = false"
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
                                Download Links
                            </v-btn>

                            <v-card>
                                <v-card-title
                                        class="headline blue lighten-4"
                                        primary-title>
                                    Download files
                                </v-card-title>
                                <v-progress-linear height="2" class="progress"
                                                   :indeterminate="downloadProgress"></v-progress-linear>


                                <v-card-text>
                                    <p>
                                        Click the "Download" button below to download a "files.txt" file that contains
                                        the
                                        list
                                        of
                                        the URLs of the region data and metadata files related to the result items.
                                    </p>
                                    <p>
                                        The following command using cURL can be used to download all the files in the
                                        list:
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
                    </v-flex>
<!--                    <v-flex m1 shrink align-self-center>-->
<!--                        <v-label>Replicated</v-label>-->
<!--                    </v-flex>-->
<!--                    <v-flex m1 d-flex align-self-center shrink class="padding-right">-->
<!--                        <v-switch label="Aggregated" v-model=agg_mode></v-switch>-->
<!--                        <v-dialog-->
<!--                                width="500"-->
<!--                        >-->
<!--                            <v-btn slot="activator"-->
<!--                                   class="info-button"-->
<!--                                   small-->
<!--                                   flat icon color="blue">-->
<!--                                <v-icon class="info-icon">info</v-icon>-->
<!--                            </v-btn>-->

<!--                            <v-card>-->
<!--                                <v-card-title-->
<!--                                        class="headline grey lighten-2"-->
<!--                                        primary-title-->
<!--                                >-->
<!--                                    Replicated and aggregated view-->
<!--                                </v-card-title>-->

<!--                                <v-card-text>-->
<!--                                    <p>Generally, each row refers to one item. In case the item is derived from multiple-->
<!--                                        Replicates/Biosamples/Donors:</p>-->
<!--                                    <p>- in the aggregated view the related information is aggregated by concatenating-->
<!--                                        the-->
<!--                                        possible values through the pipe "|";</p>-->
<!--                                    <p>- in the replicated view: there is one row for each different Replicate (and-->
<!--                                        consequently Biosample/Donor).</p>-->
<!--                                </v-card-text>-->

<!--                            </v-card>-->
<!--                        </v-dialog>-->
<!--                    </v-flex>-->
                    <v-flex m4 shrink align-self-center>
                        <v-dialog width="500" v-model="dialogOrder">
                            <v-card>
                                <v-card-title
                                        class="headline blue lighten-4"
                                        primary-title
                                >
                                    Field order
                                    <v-spacer></v-spacer>
                                    <v-checkbox v-model="sortCheckbox" @change="selectAllHeaders()"
                                                :label="sortCheckBoxLabel"></v-checkbox>
                                    <v-btn
                                            color="primary"
                                            flat
                                            @click="dialogOrder = false"
                                    >
                                        Close
                                    </v-btn>
                                    <v-btn color="primary"
                                           flat
                                           @click="resetHeadersOrder()"
                                    >
                                        Reset
                                    </v-btn>
                                </v-card-title>
                                <v-card-text>
                                    <p>Drag and drop field names in the desired position.
                                        Check or uncheck fields to re-define table content.
                                        Press APPLY to go back to the result window.</p>
                                    <draggable v-model="headers" @start="drag=true" @end="drag=false">
                                        <v-list v-for="element in headers" :key="element.value">
                                            <v-checkbox :label=element.text v-model=element.show></v-checkbox>
                                        </v-list>
                                    </draggable>
                                </v-card-text>
                                <v-divider></v-divider>

                            </v-card>
                            <v-btn dark
                                   slot="activator"
                                   small color="blue lighten-2"
                            >
                                Sort fields
                            </v-btn>
                        </v-dialog>
                    </v-flex>
                </v-layout>
            </v-container>
            <!--<v-text-field-->
            <!--v-model="search"-->
            <!--append-icon="search"-->
            <!--label="Search"-->
            <!--single-line-->
            <!--hide-details-->
            <!--&gt;</v-text-field>-->
        </v-card-title>

        <!--        <v-btn @click="pagination.page=1" color="primary" flat>First Page</v-btn>-->
        <!--        <v-btn color="primary" flat @click="pagination.page=Math.ceil(pagination.totalItems/pagination.rowsPerPage)">Last Page</v-btn>-->

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
<!--                        <span v-else>N/D</span>-->
                        <span v-else><a href="#TODO">link</a></span>
                    </span>
                    <span v-else-if="header.is_multi_link">
                        <span v-if="props.item[header.value]">
                            <a v-if="props.item[header.value].split(',')[0]"
                               :href="props.item[header.value].split(',')[0]" target="_blank">link</a>
                            <span v-if="props.item[header.value].split(',')[0] && props.item[header.value].split(',')[1]">, </span>
                            <a v-if="props.item[header.value].split(',')[1]"
                               :href="props.item[header.value].split(',')[1]" target="_blank">link</a>
                            <span v-if="props.item[header.value].split(',')[1] && props.item[header.value].split(',')[2]">, </span>
                            <a v-if="props.item[header.value].split(',')[2]"
                               :href="props.item[header.value].split(',')[2]" target="_blank">link</a>
                            <span v-if="props.item[header.value].split(',')[2] && props.item[header.value].split(',')[3]">, </span>
                            <a v-if="props.item[header.value].split(',')[3]"
                               :href="props.item[header.value].split(',')[3]" target="_blank">link</a>
                            <span v-if="props.item[header.value].split(',').length>4">...</span>
                        </span>
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
            <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading">
                Sorry, nothing to display here :(
            </v-alert>
            <v-alert slot="no-results" :value="true" color="info" icon="info" v-else>
                Loading
            </v-alert>
            <template slot="actions">
                <td :colspan="headers.length">
                    <strong>This is an extra footer</strong>
                </td>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>

    import {mapMutations, mapState, mapGetters} from 'vuex';
    import draggable from 'vuedraggable'

    const itemSourceIdName = 'accession_id';

    export default {
        name: "MetadataTable",
        components: {
            draggable
        },
        data() {
            return {
                sortCheckbox: false,
                downloadProgress: false,
                gmqlProgress: false,
                dialogDownload: false,
                dialogDownloadTable: false,
                dialogGmql: false,
                gmqlQuery: "",
                isLoading: false,
                search: '',
                result: [],
                agg_mode: false,
                download_table: '',
                dialogOrder: false,
                headers: this.getHeaders(),
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
                if (this.dialogGmql && this.count <= 1000) {
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
            getHeaders(){
                return [
                    //sequence
                    {text: 'Source Page', value: itemSourceIdName + 'dummy', sortable: this.sortable, show: true, is_link: true},
                    {text: 'Accession ID', value: itemSourceIdName, sortable: this.sortable, show: true},
                    {text: 'Strain', value: 'strain_name', sortable: this.sortable, show: true},
                    {text: 'Reference', value: 'is_reference', sortable: this.sortable, show: true},
                    {text: 'Complete', value: 'is_complete', sortable: this.sortable, show: true},
                    {text: 'Strand', value: 'strand', sortable: this.sortable, show: true},
                    {text: 'Length', value: 'length', sortable: this.sortable, show: true},
                    {text: 'GC%', value: 'gc_percentage', sortable: this.sortable, show: true},
                    //experiment_type
                    {text: 'Seq. Technology', value: 'sequencing_technology', sortable: this.sortable, show: true},
                    {text: 'Assembly Method', value: 'assembly_method', sortable: this.sortable, show: true},
                    {text: 'Coverage', value: 'coverage', sortable: this.sortable, show: true},
                    //sequencing_project
                    {text: 'Seq. Lab', value: 'sequencing_lab', sortable: this.sortable, show: false},
                    {text: 'Submission date', value: 'submission_date', sortable: this.sortable, show: true},
                    {text: 'BioProject', value: 'bioproject_id', sortable: this.sortable, show: true},
                    {text: 'Database', value: 'database_source', sortable: this.sortable, show: true},
                    //host_sample
                    {text: 'Host Species', value: 'host_taxon_name', sortable: this.sortable, show: false},
                    {text: 'Host Species TaxonID', value: 'host_taxon_id', sortable: this.sortable, show: false},
                    {text: 'Host Gender', value: 'gender', sortable: this.sortable, show: true},
                    {text: 'Host Age', value: 'age', sortable: this.sortable, show: true},
                    {text: 'Isolation source', value: 'isolation_source', sortable: this.sortable, show: true},
                    {text: 'Origin Lab', value: 'originating_lab', sortable: this.sortable, show: false},
                    {text: 'Country', value: 'country', sortable: this.sortable, show: true},
                    {text: 'Region', value: 'region', sortable: this.sortable, show: true},
                    {text: 'GeoGroup', value: 'geo_group', sortable: this.sortable, show: false},
                    //virus
                    {text: 'Virus Name', value: 'taxon_name', sortable: this.sortable, show: true},
                    {text: 'Virus TaxonID', value: 'taxon_id', sortable: this.sortable, show: true},
                    {text: 'Family', value: 'family', sortable: this.sortable, show: false},
                    {text: 'SubFamily', value: 'sub_family', sortable: this.sortable, show: false},
                    {text: 'Genus', value: 'genus', sortable: this.sortable, show: false},
                    {text: 'Species', value: 'species', sortable: this.sortable, show: false},
                    {text: 'Equivalent names', value: 'equivalent_list', sortable: this.sortable, show: false},
                    {text: 'Molecule type', value: 'molecule_type', sortable: this.sortable, show: false},
                    {text: 'Single stranded', value: 'is_single_stranded', sortable: this.sortable, show: false},
                    {text: 'Positive stranded', value: 'is_positive_stranded', sortable: this.sortable, show: false},

                    {text: 'Sequence', value: 'nucleotide_sequence', sortable: this.sortable, show: false},
                ];
            },
            resetHeadersOrder() {
                this.headers = this.getHeaders()
            },
            selectAllHeaders() {
                if (this.sortCheckbox) {
                    for (let i in this.headers) {
                        this.headers[i].show = true
                    }
                } else {
                    for (let i in this.headers) {
                        this.headers[i].show = false
                    }
                }
            },
            graphClicked(row) {
                this.openGraphDialog(row[itemSourceIdName])
            },
            extraMetadataClicked(row) {
                this.openExtraMetadataDialog(row[itemSourceIdName])
            },
            applyQuery(changeCount = true) {
                if (changeCount) {
                    var count_url = `query/count?agg=${this.agg_mode}`;
                    // eslint-disable-next-line
                    axios.post(count_url, this.compound_query)
                        .then((res) => {
                            return res.data
                        })
                        .then((res) => {
                            this.pagination.totalItems = res;
                            this.setCount(res);
                            this.pagination.page = 1;
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
                var fields = [];
                this.selected_headers.forEach(function (el) {
                    if (el.value != "extra")
                        fields.push(el.value)
                });
                var replacer = function (key, value) {
                    return value === null ? 'N/D' : value
                };
                var csv = json.map(function (row) {
                    return fields.map(function (fieldName) {
                        return JSON.stringify(row[fieldName], replacer)
                    }).join(',')
                });
                csv.unshift(fields.join(','));

                return csv.join('\r\n')
            },
            downloadTable() {
                var orderDir = "";
                if (this.pagination.descending)
                    orderDir = "DESC";
                else
                    orderDir = "ASC";

                const csv_url = `query/table?agg=${this.agg_mode}&page=1&num_elems=${this.pagination.totalItems}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}`;
                this.downloadProgress = true;
                // eslint-disable-next-line
                axios.post(csv_url, this.compound_query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        let text = this.json2csv(res);
                        let filename = "result.csv";
                        let element = document.createElement('a');
                        element.setAttribute('download', filename);
                        var data = new Blob([text]);
                        element.href = URL.createObjectURL(data);
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                        this.downloadProgress = false;
                    });
            }
        },
        computed: {
            ...mapState(['synonym', 'count']),
            ...mapGetters({
                compound_query: 'build_query'
            }),
            sortable() {
                console.log("asd " + this.result.length);
                return this.result.length < 1000;
            },
            sortCheckBoxLabel() {
                if (this.sortCheckbox)
                    return "Deselect all";
                else return "Select all"
            },
            selected_headers: {
                get() {
                    var x;
                    var res = [];
                    for (x in this.headers) {
                        if (this.headers[x].show) {
                            res.push(this.headers[x]);
                        }
                    }
                    return res;
                },
                set(value) {
                    if (value.length > 0) {
                        this.selected_headers = [...this.headers]
                    } else this.selected_headers = []
                }
            },
        }

    }
</script>

<style scoped>

    .progress {
        margin: 0;
    }


    .padding-right {
        padding-right: 600px !important;
    }

    .info-icon {
        font-size: 15px
    }

    .info-button {
        width: 10px
    }

    .data-table {
        /*margin-bottom: 1.5em;*/
    }
</style>
