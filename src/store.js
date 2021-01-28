import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        query: {
            taxon_name: ["severe acute respiratory syndrome coronavirus 2"],
            host_taxon_name: ["homo sapiens"]
        },
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
        epiQuerySel: {},
        aminoacidConditions: {},
        countSeq: null,
        countEpi: null,
        showSequenceEpiTable: false,
        chosenEpitope: null,
        showAminoacidVariantEpi: false,
        epitopeAminoacidFields: [],
        disableSelectorEpitopePart: false,
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
        epiSearchDisabled: state => {
            let res = true;
            if(state.query['taxon_name'] && state.query['host_taxon_name'] ){
                if(state.query['taxon_name'].length === 1 && state.query['host_taxon_name'].length === 1 ) {
                    res = false;
                }
            }
            return res;
        },
    },
    mutations: {
        setExampleQueryLoaded:(state)=>{
            console.log("state.exampleQueryLoaded",state.exampleQueryLoaded)
            console.log("snew Date().getTime()",new Date().getTime())
            state.exampleQueryLoaded = new Date().getTime();
            console.log("state.exampleQueryLoaded",state.exampleQueryLoaded)

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
        reloadEpiQuery: (state) => {
            state.epiQuerySel = Object.assign({}, state.epiQuerySel);
        },
        reloadAminoacidConditions: (state) => {
            state.aminoacidConditions = Object.assign({}, state.aminoacidConditions);
        },
        setQueryField: (state, payload) => {
            state.query[payload.field] = payload.fieldQuery;
            // Vue.set(state.query, payload.field, payload.list);
        },
        setEpiQueryField: (state, payload) => {
            state.epiQuerySel[payload.field] = payload.fieldQuery;
        },
        setAminoacidConditions: (state, payload) => {
            state.aminoacidConditions[payload.field] = payload.fieldQuery;
        },
        resetQueryField: (state, field) => {
            delete state.query[field];
            // Vue.delete(state.query, field);
        },
        resetEpiQueryField: (state, field) => {
            delete state.epiQuerySel[field];
        },
        resetAminoacidConditions: (state, field) => {
            delete state.aminoacidConditions[field];
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
        setCountSeq: (state, count) => {
            state.countSeq = count;
        },
        setCountEpi: (state, count) => {
            state.countEpi = count;
        },
        showSeqEpiTable: (state) => {
            state.showSequenceEpiTable = !state.showSequenceEpiTable;
        },
        setChosenEpitope: (state, item) => {
            state.chosenEpitope = item;
        },
        setTrueShowAminoacidVariantEpi: (state) => {
            state.showAminoacidVariantEpi = true;
        },
        setFalseShowAminoacidVariantEpi: (state) => {
            state.showAminoacidVariantEpi = false;
        },
        setEpitopeAminoacidFields: (state, item) => {
            state.epitopeAminoacidFields = item;
        },
        setTrueDisableSelectorEpitopePart: (state) => {
            state.disableSelectorEpitopePart = true;
        },
        setFalseDisableSelectorEpitopePart: (state) => {
            state.disableSelectorEpitopePart = false;
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
        setEpiDropDownSelected({commit, state}, payload) {
            const field = payload.field;

            let newList = payload.list;
            if (!newList)
                newList = [];

            let previousList = state.epiQuerySel[field];
            if (!previousList)
                previousList = [];

            //update if they are not equal
            if (!(JSON.stringify(previousList) === JSON.stringify(newList))) {
                if (newList.length > 0) {
                    const newPayload = {field: field, fieldQuery: newList};
                    commit('setEpiQueryField', newPayload);
                } else
                    commit('resetEpiQueryField', field);
                commit('reloadEpiQuery');
            }
        },
        setAminoacidConditionsSelected({commit, state}, payload) {
            const field = payload.field;

            let newList = payload.list;
            if (!newList)
                newList = [];

            let previousList = state.aminoacidConditions[field];
            if (!previousList)
                previousList = [];

            if (!(JSON.stringify(previousList) === JSON.stringify(newList))) {
                if (newList.length > 0) {
                    const newPayload = {field: field, fieldQuery: newList};
                    commit('setAminoacidConditions', newPayload);
                } else
                    commit('resetAminoacidConditions', field);
                commit('reloadAminoacidConditions');
            }
        },
    },
})
