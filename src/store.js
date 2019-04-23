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
        searchDisabled: false,
    },
    getters: {
        showGraphDialog: (state) => state.graphSourceId != null,
        showExtraMetadataDialog: (state) => state.extraMetadataSourceId != null,
        build_query: state => {
            let res = {};
            Object.assign(res, {"gcm": state.query}, {"type": state.type}, {"kv": state.kv})
            return res
        },
    },
    mutations: {
        setSearch: (state, value) => {
            state.searchDisabled = value;
        },
        pushKey: (state, key) => {
            if (!state.keys.includes(key)){
                state.keys.push(key);
            }
            else {
                window.alert("Duplicate Key")
            }
        },
        deleteKey: (state, key) => {
            var filtered = state.keys.filter(function (value) {
                return value !== key
            });
            state.keys = Object.assign([], filtered)
        },
        setQuery: (state, query) => {
            state.query = Object.assign({}, query);
        },
        setKv: (state, payload) => {
            state.kv = Object.assign(payload.kv)
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
        setSynonym: (state, synonym) => {
            state.synonym = synonym;
            if (synonym)
                state.type = 'synonym';
            else
                state.type = 'original';
        },
        setCount: (state, count) => {
            state.count = count;
        },
        setQueryGraph: (state, input) => {
            state.showGraphQuery = input;
        },
    },
    actions: {
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
