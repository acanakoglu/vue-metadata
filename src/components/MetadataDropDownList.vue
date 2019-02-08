<template>
    <!--{{filter}}-->
    <v-container fluid grid-list-xl>
        <v-layout wrap align-center class="container" v-for="view in views" :key="view.value">
            <v-flex xs12 sm6 md2 d-flex class="label no-horizontal-padding">
                {{view.text}}:
            </v-flex>
            <v-flex xs12 sm6 md2 d-flex class="no-horizontal-padding"
                    v-for="field in getViewFields(view.value)"
                    :key="field.name">
                <MetadataDropDown
                        :field="field.name"
                        :labelTitle="getFieldTitle(field)"
                ></MetadataDropDown>
                <v-dialog
                        v-model="dialog"
                        width="500"
                >


                    <v-btn slot="activator"
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
                            {{getFieldTitle(field)}}
                        </v-card-title>

                        <v-card-text>
                            {{field.description}}
                        </v-card-text>

                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>

    </v-container>

</template>

<script>
    import MetadataDropDown from "./MetadataDropDown";

    export default {
        name: "MetadataDropDownList",
        components: {MetadataDropDown},
        // props: {
        //     field: {type: String, required: true,},// default: 100,
        // },
        data() {
            return {
                isLoading: true,
                fields: [],
                filter: {},
                // groups: [
                //     {text: 'Project', value: 'Project'},
                //     {text: 'Experiment type', value: 'ExperimentType'},
                //     {text: 'Dataset', value: 'Dataset'},
                //     {text: 'Biosample', value: 'Biosample'},
                //     {text: 'Donor', value: 'Donor'},
                //     {text: 'Replicate', value: 'Replicate'},
                //     {text: 'Item', value: 'Item'},
                //     {text: 'Case study', value: 'CaseStudy'},
                // ],
                views: [
                    {text: 'Management', value: 'management'},
                    {text: 'Extraction', value: 'extraction'},
                    {text: 'Biological ', value: 'biological'},
                    {text: 'Technological', value: 'technological'},
                ],
            }
        },
        methods: {
            // getGroupFields(groupValue) {
            //     return this.fields.filter(field => field.group === groupValue);
            // },
            getViewFields(viewValue) {
                return this.fields.filter(field => field.view === viewValue);
            },
            getFieldTitle: (field) => {
                let upperField = field.name;
                //upperField = upperField === "is_ann" ? "is_annotation": upperField;
                upperField = upperField.charAt(0).toUpperCase() + upperField.slice(1);
                upperField = upperField.replace(/_/g, ' ');
                // return group + " " + upperField;
                // return  upperField;
                if (field.title)
                    return field.title;
                else
                    return upperField;
            },
        },
        created() {
            // const url = `/api/value/${this.field}`;
            const url = `field`;


            this.fields = [];

            let temp_fields = [];

            // eslint-disable-next-line
            axios.get(url)
                .then((res) => {
                    return res.data
                })
                .then((res) => {
                    this.fields = res.fields;
                    this.isLoading = false;
                });
            this.fields = temp_fields;
        }
    }
</script>

<style lang="sass" scoped>
    .container
        padding-top: 0
        padding-bottom: 0
        min-width: 100%;

    .label
        display: block
        font-size: 1.3em
        font-weight: bold

    .info-icon
        font-size: 15px

    .info-button
        width: 10px

</style>
