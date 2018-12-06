import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        query: {},
    },
    getters: {
        fullQuery(state) {
            return state.query
        }

        // query(state){
        //     return state.query;
        // }
    },
    mutations: {
        //it is possible to send as payload
        setDropDownSelected: (state, payload) => {
            if (payload.list.length > 0)
                Vue.set(state.query, payload.field, payload.list);
            else
                Vue.delete(state.query, payload.field);
        },

    },
    actions: {},
})
