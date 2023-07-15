<template >
  <router-view />
</template>


<script setup lang="ts">
    
import Strapi from "@/stores/strapi"
import LocalDB from "@/stores/localdb"
const strapi = Strapi()
const localDB = LocalDB()
localDB.load()
strapi.init()
</script>

<style src="./assets/scss/index.scss"></style>
