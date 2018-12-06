<template>
    <v-autocomplete
            v-model="selected"
            :items="values"
            :item-text="rename"
            item-value="value"
            :label="labelTitle"
            multiple
    ></v-autocomplete>

        <!--<v-autocomplete-->
            <!--:value="getValue()"-->
            <!--@input="changedValue"-->
            <!--:items="values"-->
            <!--:item-text="rename"-->
            <!--:label="labelTitle"-->
            <!--multiple=""-->
    <!--&gt;</v-autocomplete>-->
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'


    export default {
        name: "MetadataDropDown",
        props: {
            labelTitle: {type: String, required: true,},
            field: {type: String, required: true,},
        },
        data() {
            return {
                isLoading: true,
                values: [],//the list of values of the drop-down menu
            }
        },
        computed: {
            ...mapGetters([
                'fullQuery',
            ]),
            selected: {
                get() {
                    // console.log("GET" + this.fullQuery[this.field]);
                    return this.fullQuery[this.field];
                },
                set(value) {
                    // console.log("SET" + value);
                    this.setDropDownSelected({field: this.field, list: value})
                }
            },
        },
        methods: {
            ...mapMutations([
                'setDropDownSelected',
            ]),
            //for the alternative solution
            // getValue() {
            //     console.log("GET" + this.fullQuery[this.field]);
            //
            //     return this.fullQuery[this.field];
            // },
            // changedValue(value) {
            //     console.log("SET" + value);
            //     this.setDropDownSelected({field: this.field, list: value})
            //     // this.$store.dispatch('setDropDownSelected', {field: this.field, list: ['TCGA']});
            // },
            rename(inp) {
                if (inp.value)
                    return inp.value;
                else
                    return 'N/D(not defined)';
            },
        },
        created() {
            const url = `field/${this.field}`;
            this.isLoading = true;
            this.values = [];

            // eslint-disable-next-line
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