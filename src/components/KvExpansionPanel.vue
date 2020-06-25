<template>
    <v-expansion-panel-content :readonly="readOnly" @input="setOpen()" :value="open" hide-actions>
        <div slot="header">
            <h3>Selected Query: </h3>
            <p style="font-family:monospace;">{{ queryToShow }}</p>
        </div>
        <v-spacer></v-spacer>
        <v-btn :disabled="searchDisabled" class="delete-button" v-if="cancelButton" slot="header" color="error" flat
               @click="deleteKvLocal()">
            Delete Kv
        </v-btn>


        <v-container v-if="open" v-for="cond in list_of_conditions" fluid grid-list-xl>
            <v-layout wrap align-center class="container">
                <v-flex v-for="element in cond" class="no-horizontal-padding xs12 sm6 md2 d-flex">
                    <AnnotDropDown v-if="element['type'] == 'dropdown'"
                                   :labelTitle="element['labelTitle']"
                                   :field="element['field']"
                                   v-model="element['value']"/>

                    <AnnotMenu v-else
                               :labelTitle="element['labelTitle']"
                               :field="element['field']"
                               v-model="element['value']"/>
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
                open: [true],

                isLoading: false,
                key: "",
                panel: [],
                kvLocal: {
                    type_query: this.query_type,
                    exact: this.exact_match,
                    query: {}
                },
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
            }
        },
        methods: {
            ...mapMutations(["deleteKey", "setPanelActive", "resetPanelActive", "deleteKvField"]),
            ...mapActions(["setKv", "deleteKv"]),
            addNewCondition() {
                this.list_of_conditions.push(this.getEmptyElement())
            },
            getEmptyElement() {
                if (this.query_type === 'aa') {
                    return [
                        {
                            type: 'dropdown',
                            labelTitle: 'Gene name',
                            field: 'gene_name',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Product protein',
                            field: 'product',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Change type',
                            field: 'variant_aa_type',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Original sequence',
                            field: 'sequence_aa_original',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Alternative sequence',
                            field: 'sequence_aa_alternative',
                            value: [],
                        },
                        {
                            type: 'min-max',
                            labelTitle: 'Position range',
                            field: 'aa_position',
                            value: null
                        },
                    ];
                } else if (this.query_type === 'nuc') {
                    return [
                        {
                            type: 'dropdown',
                            labelTitle: 'Annotation type',
                            field: 'n_feature_type',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Gene name',
                            field: 'n_gene_name',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Product protein',
                            field: 'n_product',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Variant type',
                            field: 'variant_type',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Original sequence',
                            field: 'sequence_original',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Alternative sequence',
                            field: 'sequence_alternative',
                            value: [],
                        },
                        {
                            type: 'min-max',
                            labelTitle: 'Position range',
                            field: 'var_position',
                            value: null
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Effect',
                            field: 'effect',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Putative impact',
                            field: 'putative_impact',
                            value: [],
                        },
                        {
                            type: 'dropdown',
                            labelTitle: 'Impacted gene',
                            field: 'impact_gene_name',
                            value: [],
                        },
                    ];
                }

            },
            setOpen() {
                this.open = [false];
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
        },
        computed: {
            ...mapState(["panelActive"]),
            ...mapGetters({
                compound_query: 'build_query'
            }),
            queryToShow() {
                return JSON.stringify(this.kvLocal.query);
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
                    console.log(cond);
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


</style>
