<template>
    <div class="home">
        <MetadataDropDownList/>
    </div>
</template>

<script>
    // @ is an alias to /src
    import MetadataDropDownList from "../components/MetadataDropDownList";

    export default {
        name: 'home',
        components: {
            MetadataDropDownList,
        }
    }
</script>
