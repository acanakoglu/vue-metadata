<template>
    <v-menu
            :close-on-content-click="false"
            :nudge-width="200"
            v-model="menu"
            offset-y
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
            <v-container fluid grid-list-xl class="mylay2">
                <!--<v-layout class="container view">-->
                <v-layout>
                    <v-flex md4 class="age-comp">
                        <v-text-field v-model="min" type="number" label="Min years" :hint="minString" persistent-hint
                                      :min="minInt" :max="max" :disabled="searchDisabled">
                        </v-text-field>
                    </v-flex>
                    <v-flex md4 class="age-comp">
                        <v-text-field v-model="max" type="number" label="Max years" :hint="maxString" persistent-hint
                                      :min="min" :max="maxInt" :disabled="searchDisabled">
                        </v-text-field>
                    </v-flex>
                    <!--<v-flex md4 class="age-comp">
                        <v-select
                                v-model="unit"
                                :items="units"
                                label="Age unit"
                                :disabled="searchDisabled"
                        >
                        </v-select>
                    </v-flex>-->
                    <v-flex md2 class="age-comp">
                        <v-checkbox v-model="isNull"
                                    :disabled="searchDisabled"
                                    label="N/D"
                                    input-value="true">
                        </v-checkbox>
                    </v-flex>

                    <!--<v-flex md3 class="age-comp">
                        <v-btn tiny @click="setAgeLocal" :disabled="searchDisabled" color="info" flat>Apply</v-btn>
                        <v-btn small @click="deleteAgeLocal" :disabled="searchDisabled" color="error" flat>Clear</v-btn>
                    </v-flex>-->

                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                        color="primary"
                        flat
                        @click="setAgeLocal();menu=false;">
                    Apply
                </v-btn>
                <v-btn
                        color="error"
                        flat
                        @click="deleteAgeLocal();menu=false;">
                    Clear
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';
    //import AgeSelector from "./AgeSelector";

    export default {
        name: "MetadataMenu",
        props: {
            labelTitle: {type: String, required: true,},
            field: {type: String, required: true,},
        },
        //components: {AgeSelector},
        data() {
            return {
                menu: false,
                //    TODO REMOVE
                //fav: true,
                //message: false,
                //hints: true,
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
            ...mapActions(["setNumerical", "deleteNumerical"]),
            deleteAgeLocal() {
                this.deleteNumerical(this.field);
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
                        this.minAge = res['min_age'];

                        this.maxAge = res['max_age'];

                        if (this.ageItem) {
                            if (this.ageItem['min_age'] != null) {
                                this.min = this.ageItem['min_age'] / this.unit;
                            }
                            this.isNull = this.ageItem['is_null'];
                            if (this.ageItem['max_age'] != null) {
                                this.max = this.ageItem['max_age'] / this.unit;
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
                    'min_age': c,
                    'max_age': b,
                    'is_null': this.isNull
                };

                let p = {'field': this.field, 'setting_a': a}

                this.setNumerical(p)
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
                f += this.min && this.max ? '; ' : '';
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
