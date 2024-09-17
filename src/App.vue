<style scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.left {
  width: 400px;
}
.right {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>

<template>
  <div class="container">
    <div class="left"><SideBar></SideBar></div>

    <div class="right"><NavBar></NavBar> <RouterView /></div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'
</script>
