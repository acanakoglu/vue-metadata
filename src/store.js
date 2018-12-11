import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        query: {},
        // showGraphDialog: false,
        graphSourceId: null,
        // showExtraMetadataDialog: false,
        extraMetadataSourceId: null,

    },
    getters: {
        showGraphDialog: (state) => state.graphSourceId != null,
        showExtraMetadataDialog: (state) => state.extraMetadataSourceId != null,
    },
    mutations: {
        //it is possible to send as payload
        setDropDownSelected: (state, payload) => {
            if (payload.list.length > 0)
                Vue.set(state.query, payload.field, payload.list);
            else
                Vue.delete(state.query, payload.field);
            //reload
            state.query = Object.assign({}, state.query);
        },
        openGraphDialog: (state, sourceId) => {
            console.log(sourceId);
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
