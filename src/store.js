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
        query: (state) => state.query,
        showGraphDialog: (state) => state.graphSourceId != null,
        // state.showGraphDialog,
        graphSourceId: (state) => state.graphSourceId,
        showExtraMetadataDialog: (state) => state.extraMetadataSourceId != null,
        // state.showExtraMetadataDialog,
        extraMetadataSourceId: (state) => state.extraMetadataSourceId,


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
        openGraphDialog: (state, sourceId) => {
            console.log(sourceId);
            state.graphSourceId = sourceId;
            // state.showGraphDialog = true;
        },
        openExtraMetadataDialog: (state, sourceId) => {
            state.extraMetadataSourceId = sourceId;
            // state.showExtraMetadataDialog = true;
        },
        closeDialog: (state) => {
            state.graphSourceId = null;
            state.extraMetadataSourceId = null;
        },
        // closeExtraMetadataDialog: (state) => state.showExtraMetadataDialog = false,

    },
    actions: {},
})
