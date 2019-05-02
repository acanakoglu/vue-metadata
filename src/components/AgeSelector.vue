<template>
    <v-container fluid grid-list-xl>
        <v-layout>
            <v-flex md4>
                <v-text-field v-model="min" type="number" label="Min.age" :hint="minString" persistent-hint
                              :min="minInt" :max="max">
                </v-text-field>
            </v-flex>
            <v-flex md4>
                <v-text-field v-model="max" type="number" label="Max.age" :hint="maxString" persistent-hint
                              :max="maxInt" :min="min">
                </v-text-field>
            </v-flex>
            <v-flex md4>
                <v-select
                        v-model="unit"
                        :items="units"
                        label="Age unit"
                >
                </v-select>
            </v-flex>
            <v-flex md2>
                <v-checkbox v-model="isNull" label="N/D"></v-checkbox>
            </v-flex>
            <v-flex md2>
                <v-btn @click="setAgeLocal" color="info" flat>Apply</v-btn>
                <v-btn @click="deleteAgeLocal" color="error" flat>Reset</v-btn>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: "AgeSelector",
        data() {
            return {
                min: null,
                max: null,
                minAge: "",
                maxAge: "",
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
                this.max = null;
                this.unit = 1;
                this.isNull = false;
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
                let a = {
                    'min_age': this.selectedMin,
                    'max_age': this.selectedMax,
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
            min() {
                if ((this.unit * this.min) < this.minAge)
                    this.min = Math.trunc(this.minAge / this.unit)
            },
            max() {
                if ((this.max * this.unit) > this.maxAge)
                    this.max = Math.trunc(this.maxAge / this.unit)
            },
            unit(newVal, oldVal) {
                this.min = Math.trunc(this.min * oldVal / newVal);
                this.max = Math.trunc(this.max * oldVal / newVal);
            }
        },
        computed: {
            ...mapGetters({
                compound_query: 'build_query'
            }),
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
                return Math.floor((this.maxAge / this.unit)).toString();
            },
            minString() {
                return Math.ceil((this.minAge / this.unit)).toString();
            },
            maxInt() {
                return Math.floor((this.maxAge / this.unit))
            },
            minInt() {
                return Math.ceil((this.minAge / this.unit))
            },
        }
    }
</script>

<style scoped>

</style>