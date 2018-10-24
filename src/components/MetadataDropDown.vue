<template>
    <div>
        <label for="select-id">{{labelTitle}}:</label>
        <select id="select-id" v-model="selected" multiple>
            <option v-if="isLoading">
                Loading...
            </option>
            <option v-for="(value, index) in values.values" :value="value.value">
                <span v-if="value.value">
                    {{value.value}}
                </span>
                <span v-else>
                    !!UNKNOWN!!
                </span>
            </option>
        </select>
        <br>
        <span>Selected: {{ selected }}</span>
    </div>
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