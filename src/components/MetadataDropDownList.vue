<template>
    <div>
        {{filter}}
        <br>
        <br>

        <!--<div  v-for="field in fields.fields"> {{field}}</div>-->
        <v-container fluid grid-list-xl>
            <v-layout wrap align-center>
                <v-flex xs12 md1 sm6 d-flex v-for="field in fields.fields">

                    <MetadataDropDown
                            :field="field.name"
                            :labelTitle="getTitle(field)"
                            @valueChanged="handleDropDownValue"
                    ></MetadataDropDown>
                </v-flex>
            </v-layout>
        </v-container>

    </div>
</template>

<script>
    import MetadataDropDown from "./MetadataDropDown";
    import axios from 'axios';

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
            }
        },
        methods: {
            handleDropDownValue(field, selected) {
                if (!selected.length)
                    delete this.filter[field];
                else
                    this.filter[field] = selected;
                this.filter = Object.assign({}, this.filter);
                ;
            },
            getTitle(field) {
                return `${field.name} (${field.group})`
            }
        },
        watch: {
            filter() {
                this.$emit('filterChanged', this.filter);
            }
        },
        created() {
            // const url = `/api/value/${this.field}`;
            const url = `/api/field/`;
            this.fields = [];


            axios.get(url)
                .then((res) => {
                    return res.data
                })
                .then((res) => {
                    // console.log(res);
                    this.fields = res;
                    this.isLoading = false;
                });
        }
    }
</script>

<style scoped>

</style>