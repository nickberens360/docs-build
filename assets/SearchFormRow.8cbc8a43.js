const n=`<template>
  <div class="row-wrapper d-flex align-center flex-grow-1">
    <VRow
      class="ma-auto"
      v-bind="rowProps"
      align="center"
    >
      <slot name="default" />
    </VRow>
    <slot name="end-of-row" />
  </div>
</template>

<script>
export default {
  name: 'SearchFormRow',
  inheritAttrs: false,
  props: {
    rowProps: {
      type: Object,
      default: () => ({}),
    },
  },
};
<\/script>

<style lang="scss" scoped>
.row-wrapper {
  border-bottom: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  &:last-child {
    border-bottom: none;
  }
}
</style>`;export{n as default};
