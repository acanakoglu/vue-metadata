<template>
    <v-container fluid grid-list-xl>
        <v-layout>
            <v-flex>
                <v-text-field v-model="min" type="number" label="Min.age" :hint="minAge">
                    <!--                              append-outer-icon="add"-->
                    <!--                              @click:append-outer="increment('min')"-->
                    <!--                              prepend-icon="remove" @click:prepend="decrement('min')">-->
                </v-text-field>
            </v-flex>
            <v-flex>
                <v-text-field v-model="max" type="number" label="Max.age" :hint="maxAge">
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
                min: 0,
                max: 0,
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
            ...mapActions(["setAge"]),
            increment(target) {
                if (target === 'min')
                    this.min = parseInt(this.min, 10) + 1;
                else
                    this.max = parseInt(this.max, 10) + 1
            },
            decrement(target) {
                if (target === 'min')
                    this.min = parseInt(this.min, 10) - 1;
                else
                    this.max = parseInt(this.max, 10) - 1
            },
            loadMinMaxAge() {
                const url = `field/age`;

                // eslint-disable-next-line
                axios.post(url, this.compound_query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        this.minAge = res['min_age'].toString();
                        this.maxAge = res['max_age'].toString();
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
            selectedMin() {
                this.setAgeLocal()
            },
            selectedMax() {
                this.setAgeLocal()
            },
            isNull() {
                this.setAgeLocal()
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
        }
    }
</script>

<style scoped>

</style>