<template>


    <v-flex xs12 md3 sm6 d-flex>
        <v-select
                v-model="selected"
                :items="values.values"
                :item-text="rename"
                item-value="value"
                :label="labelTitle"
                multiple
                chips
        ></v-select>
    </v-flex>
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
                values: [],
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
                if (inp.value)
                    return inp.value
                else
                    return 'Not defined'
            }
        },
        created() {
            const url = `/api/value/${this.field}`;
            this.isLoading = true;
            this.values = [];
            this.selected = [];

            axios.get(url)
                .then((res) => {
                    return res.data
                })
                .then((res) => {
                    console.log(res);
                    this.values = res;
                    this.isLoading = false;
                });
        }
    }
</script>

<style scoped>
    label {
        color: red;
        padding: 8px;
    }
</style>