import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        query: {},
        graphSourceId: null,
        extraMetadataSourceId: null,

    },
    getters: {
        showGraphDialog: (state) => state.graphSourceId != null,
        showExtraMetadataDialog: (state) => state.extraMetadataSourceId != null,
    },
    mutations: {
        setDropDownSelected: (state, payload) => {
            if (payload.list.length > 0)
                Vue.set(state.query, payload.field, payload.list);
            else
                Vue.delete(state.query, payload.field);
            //reload, needs to update correctly the watcher
            state.query = Object.assign({}, state.query);
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
        },
    },
    actions: {},
})
