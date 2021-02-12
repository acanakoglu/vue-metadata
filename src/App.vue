<template>
  <v-app>

    <!--<div v-if="isEpitope" >
      <App2></App2>
    </div>
    <div v-else >
      <App1></App1>
    </div>-->

    <AppMain></AppMain>

  </v-app>
</template>

<script>

import {mapMutations, mapState, mapActions, mapGetters} from 'vuex'
//import App2 from "./components/App2";
import AppMain from "./components/AppMain";

export default {
  name: 'App',
  components: {
    //App2,
    AppMain
  },
  computed: {
    isEpitope() {
      if (this.$route.hash === '#epitope')
        return true;
      else
        return false;
    },
  }
}

</script>
<style>

</style>
