<template>
    <div>
        <label for="select-id">{{title}}</label>
        <select id="select-id" multiple>
            <option v-for="value in values" :key="value.value">
                {{value.value}}
            </option>
        </select>
    </div>
</template>

<script>
    export default {
        name: "MetadataDropdown",
        props: {
            title: {type: String, required: true,},// default: 100,
            field: {type: String, required: true,},// default: 100,
        },
        data() {
            return {
                values: [],
            }
        },

        created() {
            const url = `/api/value/${this.field}`;
            // const url = `/api/value/`;
            this.url = url;
            this.values = [];

            fetch(url)
                .then((res) => {
                    console.log(url);
                    console.log(url);
                    console.log(url);

                    console.log(res);
                    // this.res = res;
                    // this.res2 = res.json();
                    // console.log(this.res2);
                    return res.json()
                })
                .then((res) => {
                    this.values = res;
                    this.isLoading = false;
                });
        }
    }
</script>

<style scoped>

</style>