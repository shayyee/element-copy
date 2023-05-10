<template>
    <div id="app">
        <img alt="Vue logo" src="./logo.png" />
        <h1>Welcome to My Vue.js UI By WebPack!</h1>
        <JSX></JSX>
    </div>
</template>

<script>
import JSX from "./JSX.vue";

export default {
    name: "App",
    components: {JSX},
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
