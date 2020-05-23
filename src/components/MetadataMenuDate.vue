<template>
    <v-menu
            :close-on-click="true"
            :close-on-content-click="false"
            :nudge-width="200"
            v-model="menu"
            offset-y
    >
        <v-text-field slot="activator"
                      id="testing"
                      name="input-1"
                      :label="labelTitle"
                      v-model="shown_value"
                      :append-icon="menu ? 'arrow_drop_up' : 'arrow_drop_down'"
                      :disabled="menu"
        ></v-text-field>

        <v-card>
            <v-card-title>
                <h4 class="headline mb-0">{{labelTitle}} interval</h4>

            </v-card-title>
            <v-layout row wrap>
                <v-flex xs12 sm6>
                    <!--<v-subheader>From date</v-subheader>-->
                    <v-date-picker v-model="min" :landscape="landscape" show-current no-title></v-date-picker>
                </v-flex>
                <v-flex xs12 sm6 class="hidden-xs-only">
                    <!--<v-subheader>To date</v-subheader>-->
                    <v-date-picker v-model="max" :landscape="landscape" show-current no-title></v-date-picker>
                </v-flex>
            </v-layout>
            <v-card-actions>
                <v-spacer></v-spacer>
                 <v-flex md2 class="age-comp">
                        <v-checkbox v-model="isNull"
                                    :disabled="searchDisabled"
                                    label="N/D"
                                    input-value="true">
                        </v-checkbox>
                    </v-flex>
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
                    <v-icon dark right>block</v-icon>
                </v-btn>
                <!--<v-btn
                        color="white"
                        flat
                        outline
                        @click="menu=false;">
                    Close
                    <v-icon dark right>remove_circle</v-icon>
                </v-btn>-->
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
                landscape: false,
                menu: false,
                shown_value: null,
                min: null, //goes to query
                max: null, //goes to query
                minAge: null, //resulting from range available on the currently selected dataset
                maxAge: null,
                isNull: false,
                selectedAge: {},
            }
        },
        methods: {
            ...mapActions(["setDate", "deleteDate"]),
            deleteAgeLocal() {
                this.deleteDate(this.field);
                this.min = null;
                this.max = null;
                this.isNull = false;
                this.shown_value = null;
            },
            loadMinMaxAge() {
                const url = `field/numerical/${this.field}`;

                // eslint-disable-next-line
                axios.post(url, this.compound_query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        this.minAge = res['min_val'];

                        this.maxAge = res['max_val'];

                        if (this.ageItem) {
                            if (this.ageItem['min_val'] != null) {
                                this.min = this.ageItem['min_val'];
                            }
                            this.isNull = this.ageItem['is_null'];
                            if (this.ageItem['max_val'] != null) {
                                this.max = this.ageItem['max_val'];
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
                    'min_val': c,
                    'max_val': b,
                    'is_null': this.isNull
                };

                let p = {'field': this.field, 'setting_a': a}

                this.setDate(p)
                this.shown_value = this.textBoxValue;
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
                    this.isNull = false;
                }
            },
            /*unit(newVal, oldVal) {
                if (this.min !== null)
                    this.min = Math.floor(this.min * oldVal / newVal);
                if (this.max !== null)
                    this.max = Math.ceil(this.max * oldVal / newVal);
            }*/
        },
        computed: {
            ...mapState(["panelActive"]),
            ...mapGetters({
                compound_query: 'build_query',
            }),
            //here we will calculate the value of textbox
            textBoxValue() {
                let f = this.min ? this.min + ' < ' : '';
                f += this.min || this.max ? 'date' : '';
                f += this.max ? ' < ' + this.max : '';
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
                    return this.min
            },
            selectedMax() {
                if (this.max)
                    return this.max
            },
            maxString() {
                return Math.ceil(this.maxAge).toString();
            },
            minString() {
                return Math.floor(this.minAge).toString();
            },
            maxInt() {
                return Math.ceil(this.maxAge)
            },
            minInt() {
                return Math.floor(this.minAge)
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
