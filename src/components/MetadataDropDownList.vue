<template>
        <!--{{filter}}-->
        <v-container fluid grid-list-xl>
            <v-layout wrap align-center class="container" v-for="group in groups" :key="group.value">
                <v-flex xs12 sm6 md2 d-flex class="label no-horizontal-padding">
                    {{group.text}}:
                </v-flex>
                <v-flex xs12 sm6 md2 d-flex class="no-horizontal-padding"
                        v-for="field in getGroupFields(group.value)"
                        :key="field.name">
                    <MetadataDropDown
                            :field="field.name"
                            :labelTitle="getFieldTitle(field)"
                            :hint="field.description"
                    ></MetadataDropDown>
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
                groups: [
                    {text: 'Project', value: 'Project'},
                    {text: 'Experiment type', value: 'ExperimentType'},
                    {text: 'Dataset', value: 'Dataset'},
                    {text: 'Biosample', value: 'Biosample'},
                    {text: 'Donor', value: 'Donor'},
                    {text: 'Replicate', value: 'Replicate'},
                    {text: 'Item', value: 'Item'},
                    {text: 'Case study', value: 'Case'},
                ],
            }
        },
        methods: {
            getGroupFields(groupValue) {
                return this.fields.filter(field => field.group === groupValue);
            },
            getFieldTitle: (field) => {
                let upperField = field.name;
                upperField = upperField === "is_ann" ? "is_annotation": upperField;
                upperField = upperField.charAt(0).toUpperCase() + upperField.slice(1);
                upperField = upperField.replace('_', ' ');
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
    /*.container*/
        /*padding: 0*/

    .label
        display: block
        font-size: 1.3em
        font-weight: bold
</style>