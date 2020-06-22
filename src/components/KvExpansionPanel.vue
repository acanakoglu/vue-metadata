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


        <v-container v-if="open" v-for="view in list_of_conditions" fluid grid-list-xl>
            <v-layout wrap align-center class="container">
                <v-flex class="no-horizontal-padding xs12 sm6 md2 d-flex">
                    <AnnotDropDown
                            labelTitle="gene_name"
                            field="gene_name"
                            v-model="view['gene_name']"/>
                </v-flex>
                <v-flex class="no-horizontal-padding xs12 sm6 md2 d-flex">
                    <AnnotDropDown
                            labelTitle="product"
                            field="product"
                            v-model="view['product']"/>
                </v-flex>
                <v-flex class="no-horizontal-padding xs12 sm6 md2 d-flex">
                    <AnnotDropDown
                            labelTitle="variant_aa_type"
                            field="variant_aa_type"
                            v-model="view['variant_aa_type']"/>
                </v-flex>

                <v-flex class="no-horizontal-padding xs12 sm6 md2 d-flex">
                    <AnnotDropDown
                            labelTitle="sequence_aa_original"
                            field="sequence_aa_original"
                            v-model="view['sequence_aa_original']"/>
                </v-flex>
                <v-flex class="no-horizontal-padding xs12 sm6 md2 d-flex">
                    <AnnotDropDown
                            labelTitle="sequence_aa_alternative"
                            field="sequence_aa_alternative"
                            v-model="view['sequence_aa_alternative']"/>
                </v-flex>

                <v-flex class="no-horizontal-padding xs12 sm6 md2 d-flex">
                    <AnnotMenu
                            labelTitle="aa_position"
                            field="aa_position"
                            v-model="view['aa_position']"/>
                </v-flex>


            </v-layout>
        </v-container>


        <v-btn color="info" @click="addNewCondition()">
            Add new condition
        </v-btn>

        <br>
        list_of_conditions: {{list_of_conditions}}
        <br>
        getInnerQuery: {{getInnerQuery}}
        <br>

        <v-btn color="info" @click="setKvLocal" :disabled="buttonDisabled">Apply</v-btn>
        <v-btn color="error" @click="cancel(key)">Cancel</v-btn>
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
                return {
                    gene_name: [],
                    product: [],
                    variant_aa_type: [],
                    aa_position: null,
                    sequence_aa_original: [],
                    sequence_aa_alternative: [],
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
                for (const cond_i in this.list_of_conditions) {
                    const cond = this.list_of_conditions[cond_i]
                    console.log('cond', cond)
                    let res = {}
                    for (const ref in cond) {
                        const ref_val = cond[ref];
                        if (ref_val)
                            if (Array.isArray(ref_val)) {
                                if (ref_val.length)
                                    res[ref] = ref_val;
                            } else {
                                res[ref] = ref_val;
                            }

                    }
                    console.log('getInnerQuery', res)
                    console.log(Object.keys(res).length)
                    if (Object.keys(res).length > 0) {
                        res_list.push(res);
                    }
                }
                return res_list;
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
