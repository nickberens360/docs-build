const n=`<template>
  <div :class="\`d-flex justify-\${justify} align-\${align} pb-0 px-0\`">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    align: {
      type: String,
      default: 'start'
    },
    justify: {
      type: String,
      default: 'space-between'
    }
  },
};
<\/script>

<style scoped lang="scss">
  // Temp hack. Need to dig into this more
  .v-card__actions {
    .v-list-item {
      flex: 0 !important;
    }
  }

</style>`;export{n as default};
