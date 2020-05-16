<template>
    <!--{{filter}}-->
    <v-container fluid grid-list-xl style="background:#FFFFFF">
        <div v-for="view in views" :key="view.value" class="view" :style="{}">
            <h4 style="text-align: center">{{view.text}}</h4>
            <v-layout wrap align-center class="container">
                <!--<v-flex xs12 sm6 md2 d-flex class="label no-horizontal-padding">-->
                <!--{{view.text}}:-->
                <!--</v-flex>-->
                <v-flex :class="getClass(field.name)"
                        v-for="field in getViewFields(view.value)"
                        :key="field.name">
                    <MetadataDropDown
                            v-if="field.name!=='age'"
                            :field="field.name"
                            :labelTitle="getFieldTitle(field)"
                    ></MetadataDropDown>
                    <AgeSelector v-else></AgeSelector>
                    <v-dialog width="500">
                        <v-btn v-if="field.name==='age'"
                               slot="activator"
                               class="info-button"
                               small
                               flat icon color="blue" style="margin-top: -30px; margin-left: -0.4em;">
                            <v-icon class="info-icon">info</v-icon>
                        </v-btn>
                        <v-btn v-else
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
                                {{getFieldTitle(field)}}
                            </v-card-title>

                            <v-card-text>
                                {{field.description}}
                            </v-card-text>

                        </v-card>
                    </v-dialog>
                </v-flex>
            </v-layout>
        </div>
    </v-container>

</template>

<script>
    import MetadataDropDown from "./MetadataDropDown";
    import AgeSelector from "./AgeSelector";

    export default {
        name: "MetadataDropDownList",
        components: {AgeSelector, MetadataDropDown},
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
                    {text: 'Technology', value: ['technological'], color: '#DEFFC5'},
                    {text: 'Organization', value: ['organizational'], color: '#FFBF5B'},
                    {text: 'Biology-virus', value: ['biological_v', 'biological_h'], color: '#FFA9BF'},
                    // {text: 'Biology-host', value: [], color: '#FFA9BF'},
                    // {text: 'Analysis', value: 'analytical', color: '#B3E1FF'},
                ],
            }
        },
        methods: {
            // getGroupFields(groupValue) {
            //     return this.fields.filter(field => field.group === groupValue);
            // },
            getClass(field) {
                if (field === 'age')
                    return "no-horizontal-padding xs12 sm12 md6 d-flex";
                else
                    return "no-horizontal-padding xs12 sm6 md2 d-flex"
            },
            getViewFields(viewValue) {
                return this.fields.filter(field => viewValue.includes(field.view));
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
