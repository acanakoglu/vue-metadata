<template>
    <div>
        <MetadataDropDown v-for="field in fields"
                          :field="field.value"
                          :labelTitle="field.value"
                          @valueChanged="handleDropDownValue"/>
    </div>
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
            }
        },
        methods: {
            handleDropDownValue(field, selected) {
                console.log(field, selected);
                console.log(this);
                console.log(selected.length);
                if (!selected.length)
                    delete this.filter[field];
                else
                    this.filter[field] = selected;
            }
        },
        created() {
            // const url = `/api/value/${this.field}`;
            const url = `/api/value/`;
            this.fields = [];

            fetch(url)
                .then((res) => {
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