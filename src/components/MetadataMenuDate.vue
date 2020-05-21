<template>
    <v-menu
            :close-on-click="false"
            :close-on-content-click="false"
            :nudge-width="200"
            v-model="menu"
            offset-y
            dark
    >
        <v-text-field slot="activator"
                      id="testing"
                      name="input-1"
                      :label="labelTitle"
                      v-model="textBoxValue"
                      :append-icon="menu ? 'arrow_drop_up' : 'arrow_drop_down'"
                      :disabled="menu"
        ></v-text-field>

        <v-card>
            <v-card-title>
                <h4 class="headline mb-0">{{labelTitle}}</h4>
            </v-card-title>
            <v-date-picker v-model="picker" :landscape="landscape" type="month" color="grey" no-title
                           show-current></v-date-picker>
            <v-date-picker v-model="picker" :landscape="landscape" type="month" color="grey" no-title
                           show-current></v-date-picker>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                        color="blue"
                        flat
                        outline
                        @click="setAgeLocal();menu=false;">
                    Apply
                    <v-icon dark right>check_circle</v-icon>
                </v-btn>
                <v-btn
                        color="red"
                        flat
                        outline
                        @click="deleteAgeLocal();menu=false;">
                    Clear
                    <v-icon dark right>remove_circle</v-icon>
                </v-btn>
                <v-btn
                        color="white"
                        flat
                        outline
                        @click="menu=false;">
                    Close
                    <v-icon dark right>remove_circle</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';

    export default {
        name: "MetadataMenuDate",
        props: {
            labelTitle: {type: String, required: true,},
            field: {type: String, required: true,},
        },
        data() {
            return {
                picker: null,
                landscape: false,
                menu: false,
                min: null, //goes to query
                max: null, //goes to query
                minAge: null, //resulting from range available on the currently selected dataset
                maxAge: null,
                isNull: false,
                unit: 1,
                units: [
                    // {'text': 'Days', 'value': 1},
                    //  {'text': 'Weeks', 'value': 7},
                    //  {'text': 'Months', 'value': 30},
                    {'text': 'Years', 'value': 1},
                ],
                selectedAge: {},
            }
        },
        methods: {
            ...mapActions(["setDate", "deleteDate"]),
            deleteAgeLocal() {
                this.deleteDate(this.field);
                this.min = null;
                this.unit = 1;
                this.max = null;
                this.isNull = false;
            },
            loadMinMaxAge() {
                const url = `field/numerical/${this.field}`;

                // eslint-disable-next-line
                axios.post(url, this.compound_query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        this.minAge = res['min_date'];

                        this.maxAge = res['max_date'];

                        if (this.ageItem) {
                            if (this.ageItem['min_date'] != null) {
                                this.min = this.ageItem['min_date'] / this.unit;
                            }
                            this.isNull = this.ageItem['is_null'];
                            if (this.ageItem['max_date'] != null) {
                                this.max = this.ageItem['max_date'] / this.unit;
                            }
                        }
                    });
            },
            setAgeLocal() {
                let c = 0;
                let b = 0;

                if (this.selectedMin) {
                    c = this.selectedMin;
                } else {
                    c = null;
                }

                if (this.selectedMax) {
                    b = this.selectedMax;
                } else {
                    b = null;
                }
                let a = {
                    'min_date': c,
                    'max_date': b,
                    'is_null': this.isNull
                };

                let p = {'field': this.field, 'setting_a': a}

                this.setDate(p)
            },
        },
        mounted() {
            this.loadMinMaxAge()
        },
        watch: {
            compound_query() {
                this.loadMinMaxAge();
            },
            ageItem() {
                if (!this.ageItem) {
                    this.min = null;
                    this.max = null;
                    this.unit = 1;
                    this.isNull = false;
                }
            },
            unit(newVal, oldVal) {
                if (this.min !== null)
                    this.min = Math.floor(this.min * oldVal / newVal);
                if (this.max !== null)
                    this.max = Math.ceil(this.max * oldVal / newVal);
            }
        },
        computed: {
            ...mapState(["panelActive"]),
            ...mapGetters({
                compound_query: 'build_query',
            }),
            //here we will calculate the value of textbox
            textBoxValue() {
                let f = this.min ? ' min: ' + this.min : '';
                f += (this.min && this.max) || (this.min && this.isNull) ? '; ' : '';
                f += this.max ? ' max: ' + this.max : '';
                f += this.max && this.isNull ? '; ' : '';
                f += this.isNull ? ' N/D ' : '';
                return f;
            },
            searchDisabled() {
                return this.panelActive.length !== 0
            },
            ageItem() {
                return this.compound_query.gcm[this.field]
            },
            selectedMin() {
                if (this.min)
                    return this.min * this.unit
            },
            selectedMax() {
                if (this.max)
                    return this.max * this.unit
            },
            maxString() {
                return Math.ceil((this.maxAge / this.unit)).toString();
            },
            minString() {
                return Math.floor((this.minAge / this.unit)).toString();
            },
            maxInt() {
                return Math.ceil((this.maxAge / this.unit))
            },
            minInt() {
                return Math.floor((this.minAge / this.unit))
            },
        }
    }

</script>

<style scoped>

    .mylay2 {
        margin-left: 20px;
        margin-right: -80px;
        padding-right: 0px !important;
    }
</style>
