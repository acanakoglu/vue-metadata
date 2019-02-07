<template>
    <v-autocomplete
            :loading="isLoading"
            v-model="selected"
            :items="values"
            :item-text="rename"
            item-value="value"
            :label="labelTitle"
            multiple
            :hint="hint"
            persistent-hint
    >

        <template slot="item" slot-scope="data">
            <span class="item-value-span"> {{ rename(data.item)}}</span>
            <span class="item-count-span">{{data.item.count}}</span>
        </template>
    </v-autocomplete>

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
            hint: {type: String, required: true,},
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
            },
            query() {
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
                let value;
                if (inp.value !== null)
                    value = inp.value;
                else
                    value = 'N/D(not defined)';

                let res;
                if (inp.count)
                    res = `${value}`;
                else
                    res = value;
                return res;
            },
            loadData() {
                const url = `field/${this.field}?voc=${this.synonym}`;
                this.isLoading = true;

                // eslint-disable-next-line
                axios.post(url, this.query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        let vals = res.values
                        // console.log(res);
                        //to clean previously selected values
                        if (this.selected) {
                            // console.log(this.selected);
                            let zero_elements = this.selected.filter(value => !res.values.map(v => v.value).includes(value))
                                .sort().map(v => Object({
                                    value: v,
                                    count: 0
                                }));
                            // console.log(zero_elements);
                            vals = vals.concat(zero_elements);
                        }

                        this.values = vals;
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
    .item-value-span {
        padding-right: 3.5em;
    }

    .item-count-span {
        /*float:right;*/
        position: absolute;
        right: 0.5em;
    }

</style>