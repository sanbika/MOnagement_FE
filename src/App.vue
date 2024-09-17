<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div>
    <NavBar></NavBar>
    <RouterView />
  </div>
</template>
