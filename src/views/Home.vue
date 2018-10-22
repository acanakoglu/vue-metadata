<template>
    <div class="home">
        <MetadataDropdown field="cell_line"/>



        <!--<img alt="Vue logo" src="../assets/logo.png">-->
        <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    </div>
</template>

<script>
    // @ is an alias to /src
    // import HelloWorld from '@/components/HelloWorld.vue'
    import MetadataDropdown from "../components/MetadataDropdown";

    export default {
        name: 'home',
        components: {
            MetadataDropdown,
            // HelloWorld
        }
    }
</script>
