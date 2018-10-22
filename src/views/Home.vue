<template>
    <div class="home">
        <MetadataDropdown title="cell_line" field="cell_line"/>
        <MetadataDropdownList/>



        <!--<img alt="Vue logo" src="../assets/logo.png">-->
        <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    </div>
</template>

<script>
    // @ is an alias to /src
    // import HelloWorld from '@/components/HelloWorld.vue'
    import MetadataDropdown from "../components/MetadataDropdown";
    import MetadataDropdownList from "../components/MetadataDropdownList";

    export default {
        name: 'home',
        components: {
            MetadataDropdownList,
            MetadataDropdown,
            // HelloWorld
        }
    }
</script>
