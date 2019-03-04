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
        setQuery: (state, query) => {
            state.query = query;
        },
        setKv: (state, kv) => {
            state.kv = kv;
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
