<template>
    <select>
        <option v-for="value in values">
            {{value.value}}
        </option>
    </select>
</template>

<script>
    export default {
        name: "MetadataDropdown",
        props: {
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