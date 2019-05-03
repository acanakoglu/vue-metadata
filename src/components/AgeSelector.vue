<template>
    <v-container fluid grid-list-xl>
        <v-layout>
            <v-flex md4>
                <v-text-field v-model="min" type="number" label="Min.age" :hint="minString" persistent-hint
                              :min="minInt" :max="max" :disabled="searchDisabled">
                </v-text-field>
            </v-flex>
            <v-flex md4>
                <v-text-field v-model="max" type="number" label="Max.age" :hint="maxString" persistent-hint
                              :min="min" :max="maxInt" :disabled="searchDisabled">
                </v-text-field>
            </v-flex>
            <v-flex md4>
                <v-select
                        v-model="unit"
                        :items="units"
                        label="Age unit"
                        :disabled="searchDisabled"
                >
                </v-select>
            </v-flex>
            <v-flex md2>
                <v-checkbox v-model="isNull" :disabled="searchDisabled" label="N/D"></v-checkbox>
            </v-flex>
            <v-flex md2>
                <v-btn @click="setAgeLocal" :disabled="searchDisabled" color="info" flat>Apply</v-btn>
                <v-btn @click="deleteAgeLocal" :disabled="searchDisabled" color="error" flat>Reset</v-btn>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';

    export default {
        name: "AgeSelector",
        data() {
            return {
                min: null,
                max: null,
                minAge: null,
                maxAge: null,
                isNull: false,
                unit: 1,
                units: [
                    {'text': 'Days', 'value': 1},
                    {'text': 'Weeks', 'value': 7},
                    {'text': 'Months', 'value': 30},
                    {'text': 'Years', 'value': 365},
                ],
                selectedAge: {},
            }
        },
        methods: {
            ...mapActions(["setAge", "deleteAge"]),
            deleteAgeLocal() {
                this.deleteAge();
                this.min = null;
                this.unit = 1;
                this.max = null;
                this.isNull = false;
                console.log(this.min)
            },
            loadMinMaxAge() {
                const url = `field/age`;

                // eslint-disable-next-line
                axios.post(url, this.compound_query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        this.minAge = res['min_age'];
                        this.maxAge = res['max_age'];
                        if (this.ageItem) {
                            this.min = this.ageItem['min_age'] / this.unit;
                            this.isNull = this.ageItem['null'];
                            this.max = this.ageItem['max_age'] / this.unit;
                        }
                    });
            },
            setAgeLocal() {
                let c =0;
                let b =0;

                if(this.selectedMin) {
                    c = this.selectedMin;
                    console.log("min not null")
                } else {
                    c = this.minInt * this.unit;
                    console.log("min null")
                }
                console.log(c);

                if(this.selectedMax)
                    b = this.selectedMax;
                else b = this.maxInt * this.unit;

                let a = {
                    'min_age': c,
                    'max_age': b,
                    'null': this.isNull
                };
                this.setAge(a)
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
            min(newVal) {
                if(newVal !== null)
                    if ((newVal * this.min) < this.minAge)
                        this.min = Math.floor(this.minAge / this.unit)
            },
            max(newVal) {
                if(newVal !== null)
                    if ((newVal* this.unit) > this.maxAge)
                    this.max = Math.ceil(this.maxAge / this.unit)
            },
            unit(newVal, oldVal) {
                if(this.min !== null)
                    this.min = Math.floor(this.min * oldVal / newVal);
                if(this.max !== null)
                    this.max = Math.ceil(this.max * oldVal / newVal);
            }
        },
        computed: {
            ...mapState(["panelActive"]),
            ...mapGetters({
                compound_query: 'build_query',
            }),
            searchDisabled() {
                return this.panelActive.length !== 0
            },
            ageItem() {
                return this.compound_query.gcm.age
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

</style>