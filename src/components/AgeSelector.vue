<template>
    <v-container fluid grid-list-xl>
        <v-layout>
            <v-flex>
                <v-text-field v-model="min" type="number" label="Min.age" :hint="minString">
                    <!--                              append-outer-icon="add"-->
                    <!--                              @click:append-outer="increment('min')"-->
                    <!--                              prepend-icon="remove" @click:prepend="decrement('min')">-->
                </v-text-field>
            </v-flex>
            <v-flex>
                <v-text-field v-model="max" type="number" label="Max.age" :hint="maxString">
                    <!--                              append-outer-icon="add"-->
                    <!--                              @click:append-outer="increment('max')"-->
                    <!--                              prepend-icon="remove" @click:prepend="decrement('max')">-->
                </v-text-field>
            </v-flex>
            <v-flex>
                <v-select
                        v-model="unit"
                        :items="units"
                        label="Age unit"
                >
                </v-select>
            </v-flex>
            <v-flex>
                <v-checkbox v-model="isNull" label="N/D"></v-checkbox>
<!--                <v-btn color="error" flat @click="deleteAgeLocal()">Reset</v-btn>-->
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
                    {'text': 'Reset', 'value': null}
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
            unit() {
                if (this.unit == null)
                    this.deleteAgeLocal()
            },
            compound_query() {
                this.loadMinMaxAge();
            },
            selectedMin() {
                if(this.selectedMin)
                    this.setAgeLocal()
            },
            selectedMax() {
                if(this.selectedMax)
                    this.setAgeLocal()
            },
            isNull() {
                this.setAgeLocal()
            },
            min() {
                if ((this.unit * this.min) < this.minAge)
                    this.min = Math.trunc(this.minAge / this.unit)
            },
            max() {
                if ((this.max * this.unit) > this.maxAge)
                    this.max = Math.trunc(this.maxAge / this.unit)
            }
        },
        computed: {
            ...mapGetters({
                compound_query: 'build_query'
            }),
            selectedMin() {
                return this.min * this.unit
            },
            selectedMax() {
                return this.max * this.unit
            },
            maxString() {
                return Math.trunc((this.maxAge/ this.unit)).toString();
            },
            minString() {
                return Math.trunc((this.minAge / this.unit)).toString();
            },
        }
    }
</script>

<style scoped>

</style>