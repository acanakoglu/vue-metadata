import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        query: {},
        synonym: false,
        kv: {},
        type: 'original',
        graphSourceId: null,
        extraMetadataSourceId: null,
        count: null,
        showGraphQuery: false,
        keys: [],
        panelActive: [],
        numerical: new Set(),
        exampleQueryLoaded: null,
        gisaidOnly: false,
    },
    getters: {
        showGraphDialog: (state) => state.graphSourceId != null,
        showExtraMetadataDialog: (state) => state.extraMetadataSourceId != null,
        build_query: state => {
            let res = {};
            Object.assign(res, {"gcm": state.query}, {"type": state.type}, {"kv": state.kv})
            return res
        },
        keysEmpty: (state) => state.keys.length === 0,
        panels: state => Object.keys(state.kv),
    },
    mutations: {
        setExampleQueryLoaded:(state)=>{
            console.log("state.exampleQueryLoaded",state.exampleQueryLoaded)
            console.log("snew Date().getTime()",new Date().getTime())
            state.exampleQueryLoaded = new Date().getTime();
            console.log("state.exampleQueryLoaded",state.exampleQueryLoaded)

        },
        setGisaidOnly: (state, value) => {
            state.gisaidOnly = value;
        },
        setPanelActive: (state, value) => {
            state.panelActive.push(value);
        },
        resetPanelActive: (state) => {
            state.panelActive = [];
        },
        setSearch: (state, value) => {
            state.searchDisabled = value;
        },
        pushKey: (state, key) => {
            // let filtered = state.keys.filter(function (value) {
            //     return (
            //         value.query_text === key.query_text &&
            //         value.query_type=== key.query_type &&
            //         value.exact === key.exact
            //     )
            // });
            // if (filtered.length === 0) {
            state.keys.push(key);
            // } else {
            //     window.alert("Duplicate Key")
            // }
        },
        deleteKey: (state, key) => {
            var filtered = state.keys.filter(function (value) {
                return value.id !== key
            });
            state.keys = Object.assign([], filtered)
        },
        setQuery: (state, query) => {
            state.query = Object.assign({}, query);
        },
        setKvField: (state, payload) => {
            state.kv[payload.search_text] = payload.kv
        },
        reloadKv: (state) => {
            state.kv = Object.assign({}, state.kv);
        },
        resetKvField: (state, field) => {
            delete state.kv[field]
        },
        resetKv: (state) => {
            state.keys = [];
            state.kv = {}
        },
        setType: (state, type) => {
            state.type = type;
        },
        resetType: (state) => {
            state.type = 'original';
        },
        //reload the query
        reloadQuery: (state) => {
            state.query = Object.assign({}, state.query);
        },
        setQueryField: (state, payload) => {
            state.query[payload.field] = payload.fieldQuery;
            // Vue.set(state.query, payload.field, payload.list);
        },
        resetQueryField: (state, field) => {
            delete state.query[field];
            // Vue.delete(state.query, field);
        },
        resetQuery: (state) => {
            state.query = {}
        },
        openGraphDialog: (state, sourceId) => {
            state.graphSourceId = sourceId;
        },
        openExtraMetadataDialog: (state, sourceId) => {
            state.extraMetadataSourceId = sourceId;
        },
        closeDialog: (state) => {
            state.graphSourceId = null;
            state.extraMetadataSourceId = null;
            state.showGraphQuery = false;
        },
        setCount: (state, count) => {
            state.count = count;
        },
        setQueryGraph: (state, input) => {
            state.showGraphQuery = input;
        },
    },
    actions: {
        deleteKv({commit}, field) {
            commit('resetKvField', field);
            commit('reloadKv');
        },
        setKv({commit}, payload) {
            commit('setKvField', payload);
            commit('reloadKv');
        },
        setKvFull: ({commit, state}, payload) => {
            commit('resetKv');
            let i=0;
            Object.keys(payload).forEach(key => {
                const val = payload[key];
                let a = {
                        'id': i,
                        'query_text': val.type_query,
                        'query_type': val.type_query,
                        'exact': false
                    };
                i=i+1;
                commit('pushKey', a)
            });
            if (Object.keys(payload).length === 0)
                commit('resetKv');
            else
                state.kv = payload;
            commit('reloadKv')
        },
        /*setAge({commit, state}, age_item) {
            state.query['age'] = age_item;
            commit('reloadQuery')
        },
        deleteAge({commit}) {
            commit('resetQueryField', 'age');
            commit('reloadQuery')
        },*/

        setNumerical({commit, state}, payload) {
            const field = payload.field;
            state.query[field] = payload.setting_a;
            state.numerical.add(field);
            commit('reloadQuery')
        },

        deleteNumerical({commit}, field) {
            commit('resetQueryField', field);
            commit('reloadQuery')
        },

        setDate({commit, state}, payload) {
            const field = payload.field;
            state.query[field] = payload.setting_a;
            state.numerical.add(field);
            commit('reloadQuery')
        },

        deleteDate({commit}, field) {
            commit('resetQueryField', field);
            commit('reloadQuery')
        },

        setDropDownSelected({commit, state}, payload) {
            const field = payload.field;

            let newList = payload.list;
            if (!newList)
                newList = [];

            let previousList = state.query[field];
            if (!previousList)
                previousList = [];

            //update if they are not equal
            if (!(JSON.stringify(previousList) === JSON.stringify(newList))) {
                if (newList.length > 0) {
                    const newPayload = {field: field, fieldQuery: newList};
                    commit('setQueryField', newPayload);
                } else
                    commit('resetQueryField', field);
                commit('reloadQuery');
            }
        },
    },
})
