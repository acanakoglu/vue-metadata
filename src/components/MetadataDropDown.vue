<template>
    <div>
        <label for="select-id">{{labelTitle}}:</label>
        <select id="select-id" v-model="selected" multiple>
            <option v-if="isLoading">
                Loading...
            </option>
            <option v-for="(value, index) in values.values" :value="value.value">
                {{index}} -
                {{value.value}}
            </option>
        </select>
        <br>
        <span>Selected: {{ selected }}</span>
    </div>
</template>

<script>
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
            selected()  {
                this.$emit('valueChanged', this.field, this.selected);
            }
        },
        created() {
            const url = `/api/value/${this.field}`;
            this.isLoading = true;
            this.values = [];
            this.selected = [];

            // setTimeout(() => {
            fetch(url)
                .then((res) => {
                    // console.log(res)
                    return res.json()
                })
                .then((res) => {
                    this.values = res;
                    this.isLoading = false;
                });
            // }, 3000);
        }
    }
</script>

<style scoped>
    label {
        color: red;
        padding: 8px;
    }
</style>