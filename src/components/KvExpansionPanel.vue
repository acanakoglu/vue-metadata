<template>
    <v-expansion-panel-content :readonly="readOnly" :value="open" hide-actions>
        <div slot="header">
            <span class="label">{{getFullQueryType()}} query: </span>
            <span style="font-family:monospace" v-html="queryToShow"></span>

        </div>
        <v-spacer></v-spacer>
        <v-btn :disabled="searchDisabled" class="delete-button" v-if="cancelButton" slot="header" color="error" flat
               @click="deleteKvLocal()">
            Remove condition
        </v-btn>


        <v-container v-if="open" v-for="cond in list_of_conditions" fluid grid-list-xl>
            <v-layout wrap align-center>
                <v-flex v-for="element in cond" class="no-horizontal-padding xs12 sm6 md2 d-flex">
                    <AnnotDropDown v-if="element['type'] == 'dropdown'"
                                   :labelTitle="element['labelTitle']"
                                   :field="element['field']"
                                   v-model="element['value']"/>

                    <AnnotMenu v-else
                               :labelTitle="element['labelTitle']"
                               :field="element['field']"
                               :info="element['info']"
                               v-model="element['value']"/>
                    <v-dialog width="500">
                        <v-btn
                                slot="activator"
                                class="info-button"
                                small
                                flat icon color="blue">
                            <v-icon class="info-icon">info</v-icon>
                        </v-btn>
                        <v-card>
                            <v-card-title
                                    class="headline grey lighten-2"
                                    primary-title
                            >
                                {{element['labelTitle']}}
                            </v-card-title>

                            <v-card-text>
                                {{element['description']}}
                            </v-card-text>

                        </v-card>
                    </v-dialog>
                </v-flex>
            </v-layout>
        </v-container>

        <div>
            <v-btn color="info" @click="addNewCondition()">
                Add new condition
            </v-btn>
        </div>

        <div v-if="isDev">
            query_type: {{query_type}}
            <br>
            list_of_conditions: {{list_of_conditions}}
            <br>
            getInnerQuery: {{getInnerQuery}}
        </div>

        <div>
            <v-btn color="info" @click="setKvLocal" :disabled="buttonDisabled">Apply</v-btn>
            <v-btn color="error" @click="cancel(key)">Cancel</v-btn>
        </div>
    </v-expansion-panel-content>
</template>

<script>
    import {mapGetters, mapMutations, mapActions, mapState} from 'vuex';
    import MetadataDropDown from "./MetadataDropDown";
    import AnnotDropDown from "./AnnotDropDown";
    import AnnotMenu from "./AnnotMenu";

    export default {
        name: "KvExpansionPanel",
        components: {AnnotDropDown, MetadataDropDown, AnnotMenu},
        props: {
            id: {type: Number, required: true},
            query_text: {type: String, required: true},
            query_type: {type: String, required: true},
            exact_match: {type: Boolean, required: true},
            query: {type: Object, required: false},
        },
        data() {
            return {
                list_of_conditions: [this.getEmptyElement()],
                cancelButton: false,
                readOnly: false,
                open: false,

                isLoading: false,
                key: "",
                panel: [],
                kvLocal: {
                    type_query: this.query_type,
                    exact: this.exact_match,
                    query: {}
                },
                precalculatedShowQuery: null,
            }
        },
        mounted() {
            // this.searchText();
            this.key = this.query_text;
            this.setPanelActive(this.query_text);
            if (this.query) {
                this.readOnly = true;
                this.cancelButton = true;
                this.kvLocal = this.query;
                this.open = false;
                this.resetPanelActive();

                this.precalculatedShowQuery = this.queryToShow2(this.query.query)
            } else {
                this.open = true;
            }
        },
        methods: {
            ...mapMutations(["deleteKey", "setPanelActive", "resetPanelActive", "deleteKvField"]),
            ...mapActions(["setKv", "deleteKv"]),
            addNewCondition() {
                this.list_of_conditions.push(this.getEmptyElement())
            },
            getFullQueryType() {
                if (this.query_type === 'aa') {
                    return 'Amino acid';
                } else {
                    return 'Nucleotide';
                }
            },
            getEmptyElement() {
                if (this.query_type === 'aa') {
                    return [
                        {
                            type: 'dropdown',
                            labelTitle: 'Gene name',
                            field: 'gene_name',
                            value: [],
                            description: 'Gene within which the amino acid change occurs'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Product protein',
                            field: 'product',
                            value: [],
                            description: 'Protein produced by the sub-sequence within which the amino acid change occurs'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Change type',
                            field: 'variant_aa_type',
                            value: [],
                            description: 'Type of amino acid change (SUB = substitution, INS = insertion, DEL = deletion)'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Original sequence',
                            field: 'sequence_aa_original',
                            value: [],
                            description: 'Affected amino acid sequence from the corresponding reference sequence of the chosen Virus'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Alternative sequence',
                            field: 'sequence_aa_alternative',
                            value: [],
                            description: 'Changed amino acid sequence (in the target sequence) with respect to the reference one'
                        },
                        {
                            type: 'min-max',
                            labelTitle: 'Position range',
                            field: 'aa_position',
                            info: 'Position of amino acid variant in the gene coding sequence (CDS), e.g. 0-1000',
                            value: null,
                            description: 'Range of positions within the amino acid sequence of the gene, based on the reference sequence'
                        },
                    ];
                } else if (this.query_type === 'nuc') {
                    return [
                        {
                            type: 'dropdown',
                            labelTitle: 'Annotation type',
                            field: 'n_feature_type',
                            value: [],
                            description: 'Characterization of sub-sequence'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Gene name',
                            field: 'n_gene_name',
                            value: [],
                            description: 'Gene to which the sub-sequence belongs'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Product protein',
                            field: 'n_product',
                            value: [],
                            description: 'Protein encoded by the sequence of aminoacids'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Variant type',
                            field: 'variant_type',
                            value: [],
                            description: 'Type of amino acid change (SUB = substitution, INS = insertion, DEL = deletion)'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Original sequence',
                            field: 'sequence_original',
                            value: [],
                            description: 'Affected nucleotide sequence from the corresponding reference sequence of the chosen Virus'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Alternative sequence',
                            field: 'sequence_alternative',
                            value: [],
                            description: 'Changed nucleotide sequence (in the target sequence) with respect to the reference one'
                        },
                        {
                            type: 'min-max',
                            labelTitle: 'Position range',
                            field: 'var_position',
                            info: 'Position of nucleotide variant in the full sequence, e.g. 0-15000',
                            value: null,
                            description: 'Range of positions within the full nucleotide sequence, based on the reference sequence'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Effect',
                            field: 'effect',
                            value: [],
                            description: 'Effect of the variant, annotated using the Sequence Ontology terms (http://www.sequenceontology.org/), predicted by SnpEff (http://snpeff.sourceforge.net/)'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Putative impact',
                            field: 'putative_impact',
                            value: [],
                            description: 'A simple estimation of putative impact / deleteriousness : {HIGH, MODERATE, LOW, MODIFIER}, predicted by SnpEff (http://snpeff.sourceforge.net/)'
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Impacted gene',
                            field: 'impact_gene_name',
                            value: [],
                            description: 'Common gene name (HGNC, https://www.genenames.org/). Optional: use closest gene when the variant is intergenic, predicted by SnpEff (http://snpeff.sourceforge.net/),'
                        },
                    ];
                }

            },
            cancel() {
                this.deleteKey(this.id);
                this.resetPanelActive()
            },

            deleteKvLocal() {
                this.deleteKv(this.query_text + "_" + this.id)
                this.deleteKey(this.id);
            },
            setKvLocal() {
                this.kvLocal.query = this.getInnerQuery;
                this.setKv({
                    kv: this.kvLocal,
                    search_text: this.key + "_" + this.id
                });

                this.readOnly = true;
                this.cancelButton = true;
                this.open = false;
                this.resetPanelActive()
            },
            queryToShow2(input) {
                // return JSON.stringify(this.getInnerQuery);
                let el = {};
                this.getEmptyElement().forEach(element => {
                    el[element['field']] = element['labelTitle'];
                });

                let outer_list = [];
                // console.log(this.getInnerQuery);
                input.forEach(element => {
                    // console.log(element);
                    let inner_list = [];
                    Object.keys(element).forEach(key => {
                        const value = element[key];
                        inner_list.push(key + ': ' + JSON.stringify(value));
                    });
                    outer_list.push(inner_list.join(", "))
                });

                return "<br/>" + outer_list.join("<br/><b>OR</b><br/>");
            },
        },
        computed: {
            ...mapState(["panelActive"]),
            ...mapGetters({
                compound_query: 'build_query'
            }),
            queryToShow() {
                if (this.precalculatedShowQuery) {
                    return this.precalculatedShowQuery;
                } else {
                    return this.queryToShow2(this.getInnerQuery);
                }
            },
            buttonDisabled() {
                return this.getInnerQuery.length == 0;
            },
            searchDisabled() {
                return this.panelActive.length !== 0
            },
            getInnerQuery() {
                let res_list = []
                this.list_of_conditions.forEach(cond => {
                    // console.log(cond);
                    let res = {}
                    cond.forEach(element => {
                        const value = element['value'];
                        const field = element['field']
                        if (value) {
                            if (Array.isArray(value)) {
                                if (value.length)
                                    res[field] = value;
                            } else {
                                res[field] = value;
                            }
                        }
                    });
                    if (Object.keys(res).length > 0) {
                        res_list.push(res);
                    }
                });
                return res_list;
            },
            isDev() {
                return process.env.NODE_ENV === 'development';
            }

        },
        watch: {
            query: {
                handler() {
                    console.log(this.query);
                    if (this.query) {
                        this.precalculatedShowQuery = this.queryToShow2(this.query.query);
                    }
                }
                ,
                deep: true
            },
            open: {
                handler() {
                    if (!this.readOnly) {
                        this.open[this.open.length] = true
                    }
                }
                ,
                deep: true
            },
        }

    }
</script>

<style lang="sass" scoped>
    .delete-button
        flex: none !important

        .container
            padding-top: 0
            padding-bottom: 0
            min-width: 100%


        .label
            display: block
            font-size: 1.3em
            font-weight: bold

        .info-icon
            font-size: 15px

        .info-button
            width: 10px

        .view
            margin: 15px
            outline: 1px solid black

        .label
            font-size: 1.3em
            font-weight: bold
            padding: 12px


</style>
