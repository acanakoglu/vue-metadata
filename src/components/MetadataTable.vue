<template>
    <v-card>
        <span id="mousehovermessage" class="mousehovermessageClass" :style="mousehovermessageStyle">
            <table style="background-color:#000000; color:#FFF;text-align:left;">
              <tr>
                <th>Originating Lab </th>
                <td> {{mousehovermessage_originating}}</td>
              </tr>
              <tr>
                <th>Submitting Lab </th>
                <td> {{mousehovermessage_submitting}}</td>
              </tr>
              <tr>
                <th>Authors </th>
                <td> {{mousehovermessage_authors}}</td>
              </tr>
            </table>
        </span>
        <v-card-title>
            <v-container fluid grid-list-xs>
                <v-layout justify-space-between row>
                    <v-flex m4 align-self-center>
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
                                        the comma-separated version of the table shown in the "RESULT SEQUENCES" section,
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
                                Select/Sort fields
                            </v-btn>
                        </v-dialog>
                    </v-flex>
                </v-layout>
            </v-container>
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
                    <span v-else-if="header.value === 'lineage_clade'">
                        <span v-if="props.item['lineage'] || props.item['clade']">{{updateCellTextFormat(props.item['lineage'])}} ({{updateCellTextFormat(props.item['clade'])}})</span>
                        <span v-else v-html="updateCellTextFormat(null)"></span>
                    </span>
                    <span v-else-if="header.value === 'accession_id' && props.item['database_source'] == 'GISAID'">
                        <span v-html="updateCellTextFormat(props.item[header.value])"
                              @mouseover="mouseOver(props.item[header.value], $event)"
                              @mouseleave="mouseLeave"
                        />
                    </span>
                    <span v-else v-html="updateCellTextFormat(props.item[header.value])"/>
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
                mousehovermessage_originating: '...loading...',
                mousehovermessage_submitting: '...loading...',
                mousehovermessage_authors: '...loading...',
                mousehovermessage_left: null,
                mousehovermessage_top: null,
                mousehovermessage_show: false,
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
            mouseOver(accessionId, e) {
                this.mousehovermessage_left = e.clientX;
                this.mousehovermessage_top = e.clientY;
                this.mousehovermessage_show = true;

                const l1 = accessionId.substring(accessionId.length - 4, accessionId.length - 2)
                const l2 = accessionId.substring(accessionId.length - 2, accessionId.length)

                const url = `https://www.epicov.org/acknowledgement/${l1}/${l2}/${accessionId}.json`;
                // eslint-disable-next-line
                axios.get(url)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        // console.log(res)
                        this.mousehovermessage_authors = res.covv_authors;
                        this.mousehovermessage_originating = res.covv_orig_lab;
                        this.mousehovermessage_submitting = res.covv_subm_lab;
                    })
            },
            mouseLeave() {
                // console.log('mouseLeave')
                this.mousehovermessage_show = false;
                this.mousehovermessage_originating = '...loading...';
                this.mousehovermessage_submitting = '...loading...';
                this.mousehovermessage_authors = '...loading...';
            },
            getHeaders() {
                return [
                    //sequence
                    {
                        text: 'Source Page',
                        value: 'source_page',
                        sortable: this.sortable,
                        show: true,
                        is_link: true
                    },
                    {text: 'Accession ID', value: itemSourceIdName, sortable: this.sortable, show: true},
                    {text: 'Strain', value: 'strain_name', sortable: this.sortable, show: true},
                    {text: 'Is reference', value: 'is_reference', sortable: this.sortable, show: true},
                    {text: 'Is complete', value: 'is_complete', sortable: this.sortable, show: true},
                    {text: 'Strand', value: 'strand', sortable: this.sortable, show: true},
                    {text: 'Sequence Length', value: 'length', sortable: this.sortable, show: true},
                    {text: 'GC%', value: 'gc_percentage', sortable: this.sortable, show: true},
                    {text: 'N%', value: 'n_percentage', sortable: this.sortable, show: true},
                    {text: 'Lineage (Clade)', value: 'lineage_clade', sortable: this.sortable, show: true},
                    // {text: 'Lineage', value: 'lineage', sortable: this.sortable, show: true},
                    // {text: 'Clade', value: 'clade', sortable: this.sortable, show: true},

                    //experiment_type
                    {text: 'Seq. Technology', value: 'sequencing_technology', sortable: this.sortable, show: true},
                    {text: 'Assembly Method', value: 'assembly_method', sortable: this.sortable, show: true},
                    {text: 'Coverage', value: 'coverage', sortable: this.sortable, show: true},
                    //sequencing_project
                    {text: 'Submitting Lab', value: 'sequencing_lab', sortable: this.sortable, show: false},
                    {text: 'Submission date', value: 'submission_date', sortable: this.sortable, show: true},
                    {text: 'BioProject', value: 'bioproject_id', sortable: this.sortable, show: true},
                    {text: 'Database', value: 'database_source', sortable: this.sortable, show: true},
                    //host_sample
                    {text: 'Host taxon name', value: 'host_taxon_name', sortable: this.sortable, show: false},
                    {text: 'Host taxon ID', value: 'host_taxon_id', sortable: this.sortable, show: false},
                    {text: 'Host Gender', value: 'gender', sortable: this.sortable, show: true},
                    {text: 'Host Age', value: 'age', sortable: this.sortable, show: true},
                    {text: 'Collection date', value: 'collection_date', sortable: this.sortable, show: true},
                    {text: 'Isolation source', value: 'isolation_source', sortable: this.sortable, show: true},
                    {text: 'Originating Lab', value: 'originating_lab', sortable: this.sortable, show: false},
                    {text: 'Country', value: 'country', sortable: this.sortable, show: true},
                    {text: 'Region', value: 'region', sortable: this.sortable, show: true},
                    {text: 'Geo group', value: 'geo_group', sortable: this.sortable, show: false},
                    //virus
                    {text: 'Virus taxon name', value: 'taxon_name', sortable: this.sortable, show: true},
                    {text: 'Virus taxon ID', value: 'taxon_id', sortable: this.sortable, show: true},
                    {text: 'Family', value: 'family', sortable: this.sortable, show: false},
                    {text: 'SubFamily', value: 'sub_family', sortable: this.sortable, show: false},
                    {text: 'Genus', value: 'genus', sortable: this.sortable, show: false},
                    {text: 'Species', value: 'species', sortable: this.sortable, show: false},
                    {text: 'Equivalent names', value: 'equivalent_list', sortable: this.sortable, show: false},
                    {text: 'Molecule type', value: 'molecule_type', sortable: this.sortable, show: false},
                    {text: 'Single stranded', value: 'is_single_stranded', sortable: this.sortable, show: false},
                    {text: 'Positive stranded', value: 'is_positive_stranded', sortable: this.sortable, show: false},

                    {text: 'Sequence', value: 'nucleotide_sequence', sortable: this.sortable, show: true},
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
                        return this.addLink(res);
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
                    // console.log(e);
                }, function (e) {
                    alert('Can not copy');
                    // console.log(e);
                })
            },
            updateCellTextFormat(input) {
                var temp = input;
                if (temp === null)
                    temp = 'N/D';
                temp = temp.replace(/\|/g, "|<br/>")
                return temp
            },
            addLink(input) {
                for (const row of input) {
                    if(row['database_source'] == 'GISAID')
                        row['source_page'] = "https://gisaid.org/";
                    else if(row['database_source'] === 'GenBank' || row['database_source'] === 'RefSeq')
                        row['source_page'] = 'https://www.ncbi.nlm.nih.gov/nuccore/' + row['accession_id'];
                    else if(row['database_source'] == 'COG-UK')
                        row['source_page'] = "https://www.cogconsortium.uk/data/";
                    //else do nothing
                }
                return input;
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
                        return res.data;
                    })
                    .then((res) => {
                        return this.addLink(res);
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
            mousehovermessageStyle() {
                if (this.mousehovermessage_show) {
                    return `position:fixed;top: ${this.mousehovermessage_top - 30}px; left: ${this.mousehovermessage_left + 30}px;`;
                } else {
                    return 'display: none;';
                }
            },
            sortable() {
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

    .mousehovermessageClass table, .mousehovermessageClass table th, .mousehovermessageClass table td {
        border-collapse: collapse;
        border: 2px solid gray;
        padding: 3px;
        padding: 3px;
    }

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
