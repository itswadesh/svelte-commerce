<template>
  <content-loader
    :height="100"
    :speed="2"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="30" y="15" rx="4" ry="4" width="60" height="60" />
    <rect x="100" y="15" rx="4" ry="4" width="120" height="15" />
    <rect x="100" y="35" rx="4" ry="4" width="60" height="15" />
    <!-- <rect x="290" y="45" rx="10" ry="10" width="20" height="20" />
    <rect x="320" y="45" rx="10" ry="10" width="20" height="20" /> -->
  </content-loader>
</template>

<script>
import { ContentLoader } from 'vue-content-loader'
export default {
  components: { ContentLoader }
}
</script>

<style></style>
