<template>
    <v-autocomplete
            :loading="isLoading"
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
    import {mapActions, mapState} from 'vuex'


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
        watch: {
            synonym() {
                this.loadData();
            }
        },
        computed: {
            ...mapState([
                'query', 'synonym',
            ]),
            selected: {
                get() {
                    // console.log("GET" + this.fullQuery[this.field]);
                    return this.query[this.field];
                },
                set(value) {
                    // console.log("SET" + value);
                    this.setDropDownSelected({field: this.field, list: value})
                }
            },
        },
        methods: {
            ...mapActions([
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
            loadData() {
                const url = `field/${this.field}?voc=${this.synonym}`;
                this.isLoading = true;

                // eslint-disable-next-line
                axios.get(url)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        // console.log(res);
                        this.values = res.values;
                        //to clean previously selected values
                        if (this.selected) {
                            // console.log(this.selected);
                            this.selected = this.selected.filter(value => res.values.map(v => v.value).includes(value));
                        }
                        this.isLoading = false;
                    });

                // console.log(this.selected.get().filter(v => this.values.indexOf(v) > -1));
//
                // this.selected.set(this.selected.get().filter(v => this.values.indexOf(v) > -1));
            },
        },
        created() {
            this.loadData();
        }
    }
</script>

<style scoped>


</style>