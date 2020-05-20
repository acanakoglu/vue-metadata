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
                      label="Label Text"
                      v-model="textBoxValue"
                      :append-icon="menu ? 'arrow_drop_up' : 'arrow_drop_down'"
                      :disabled="menu"
        ></v-text-field>

        <v-card>
            <v-list>
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <img src="/static/doc-images/john.jpg" alt="John">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>John Leider</v-list-tile-title>
                        <v-list-tile-sub-title>Founder of Vuetify.js</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-btn
                                :class="fav ? 'red--text' : ''"
                                icon
                                @click="fav = !fav"
                        >
                            <v-icon>favorite</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
            <v-divider></v-divider>
            <v-list>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-switch v-model="message" color="purple"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title>Enable messages</v-list-tile-title>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-switch v-model="hints" color="purple"></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-title>Enable hints</v-list-tile-title>
                </v-list-tile>
            </v-list>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="menu = false">Cancel</v-btn>
                <v-btn color="primary" flat @click="menu = false">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';

    export default {
        name: "MetadataMenu",
        data() {
            return {
                menu: false,
                //    TODO REMOVE
                fav: true,
                message: false,
                hints: true,

                min: null, //goes to query
                max: null, //goes to query
                minAge: null, //resulting from range available on the currently selected dataset
                maxAge: null,
                range: [40, 60],
                isNull: false,
                unit: 1,
                units: [
                    {'text': 'Years', 'value': 1},
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
                // if (this.fav || this.message || this.hints) {
                let f = this.fav ? ' fav ' : '';
                f += this.message ? ' message ' : '';
                f += this.hints ? ' hints ' : '';
                return f;
                // }
                // else
                //   return null;
            },
            searchDisabled() {
                return this.panelActive.length !== 0
            },
            ageItem() {
                return this.compound_query.gcm.age
            },
            selectedMin() {
                if (this.range[0])
                    return this.range[0] * this.unit
            },
            selectedMax() {
                if (this.range[1])
                    return this.range[1] * this.unit
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

    .myslider {
        transform: scale(0.8);
        transform-origin: left;
    }

</style>
