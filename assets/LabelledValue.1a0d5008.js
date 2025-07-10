const l=`<template>
  <dl class="labelled-value">
    <dt
      v-if="label || $slots.label"
      class="labelled-value__label"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </dt>
    <dd class="labelled-value__value">
      <slot name="default">
        {{ value }}
      </slot>
    </dd>
  </dl>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    }
  }
};
<\/script>
<style lang="scss" scoped>
.labelled-value {
  margin-bottom: 16px;

  &__label {
    color: rgb(var(--v-theme-on-surface-low-contrast-text));
    font-size: 14px;
  }
  &__value {
    font-size: 20px;
    line-height: 1;
  }
}
</style>
`;export{l as default};
