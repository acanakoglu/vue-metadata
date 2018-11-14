<template>
    <v-autocomplete
            v-model="selected"
            :items="values"
            :item-text="rename"
            item-value="value"
            :label="labelTitle"
            multiple
    ></v-autocomplete>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "MetadataDropDown",
        props: {
            labelTitle: {type: String, required: true,},// default: 100,
            field: {type: String, required: true,},// default: 100,
        },
        data() {
            return {
                isLoading: true,
                values: [],//the list of values of the drop-down menu
                selected: [],
            }
        },
        watch: {
            selected() {
                this.$emit('valueChanged', this.field, this.selected);
            }
        },
        methods: {
            rename(inp) {
                if (inp.value !== null)
                    return inp.value;
                else
                    return 'not defined';
            },
        },
        created() {
            const url = `/api/value/${this.field}`;
            this.isLoading = true;
            this.values = [];
            // this.selected = [];

            axios.get(url)
                .then((res) => {
                    return res.data
                })
                .then((res) => {
                    // console.log(res);
                    this.values = res.values;
                    this.isLoading = false;
                });
        }
    }
</script>

<style scoped>


</style>