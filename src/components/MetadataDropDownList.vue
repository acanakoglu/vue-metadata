<template>
    <div>
        {{filter}}
        <br>
        <br>

        <!--<div  v-for="field in fields.fields"> {{field}}</div>-->

        <MetadataDropDown v-for="field in fields.fields"
                          :field="field.name"
                          :labelTitle="getTitle(field)"
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
                //reassign: to trigger the event(value changed on the binded listeners)
                var filter = this.filter;
                this.filter = {};
                if (!selected.length)
                    delete filter[field];
                else
                    filter[field] = selected;
                this.filter = filter;
            },
            getTitle(field){
                return `${field.name} (${field.group})`
            }
        },
        watch: {
            filter()  {
                this.$emit('filterChanged', this.filter);
            }
        },
        created() {
            // const url = `/api/value/${this.field}`;
            const url = `/api/field/`;
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