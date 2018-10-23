<template>
    <div class="home">
        <MetadataDropDown title="cell_line" field="cell_line"/>
        <MetadataDropDownList/>



        <!--<img alt="Vue logo" src="../assets/logo.png">-->
        <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    </div>
</template>

<script>
    // @ is an alias to /src
    // import HelloWorld from '@/components/HelloWorld.vue'
    import MetadataDropDown from "../components/MetadataDropDown";
    import MetadataDropDownList from "../components/MetadataDropDownList";

    export default {
        name: 'home',
        components: {
            MetadataDropDownList,
            MetadataDropDown,
            // HelloWorld
        }
    }
</script>
