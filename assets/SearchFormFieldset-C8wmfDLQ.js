const e=`<template>
  <VCol
    v-bind="colProps"
    class="search-form-fieldset pa-0"
    :class="{'search-form-fieldset--border-bottom': showBorderBottom}"
  >
    <fieldset>
      <VRow
        class="ma-0"
        v-bind="rowProps"
      >
        <slot name="default" />
      </VRow>
    </fieldset>
  </VCol>
</template>

<script>
export default {
  name: 'SearchFormFieldset',
  props: {
    colProps: {
      type: Object,
      default: () => ({cols: 'auto'}),
    },
    rowProps: {
      type: Object,
      default: () => ({}),
    },
    showBorderBottom: {
      type: Boolean,
      default: false,
    },
  },
};
<\/script>

<style lang="scss" scoped>
.search-form-fieldset  {
  border-left: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  &:first-child {
    border-left: none;
  }
  &--border-bottom {
    border-bottom: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  }
}
fieldset {
  border: none;
}
</style>`;export{e as default};
