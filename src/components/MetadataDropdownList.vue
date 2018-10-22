<template>
    <div>
        <h1>hello</h1>
        <MetadataDropdown v-for="field in fields" :field="field.value" :title="field.value"/>
    </div>
</template>

<script>
    import MetadataDropdown from "./MetadataDropdown";

    export default {
        name: "MetadataDropdownList",
        components: {MetadataDropdown},
        // props: {
        //     field: {type: String, required: true,},// default: 100,
        // },
        data() {
            return {
                isLoading: true,
                fields: [],
            }
        },


        created() {
            // const url = `/api/value/${this.field}`;
            const url = `/api/value/`;
            this.fields = [];

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
                    this.fields = res;
                    this.isLoading = false;
                });
        }
    }
</script>

<style scoped>

</style>