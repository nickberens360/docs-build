const e=`<template>
  <div>
    <h1>{{text}}</h1>
    <p>{{message}}</p>
  </div>
</template>
<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Hello World'
  },
  message: {
    type: String,
    default: 'Oh Heyyyyyy!!!'
  }
})
<\/script>`;export{e as default};
