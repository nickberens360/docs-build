const e=`<template>
  <VueDatepicker
    ref="timePicker"
    auto-apply
    class="time-picker"
    :close-on-auto-apply="false"
    :enable-seconds="false"
    hide-input-icon
    :model-value="modelValue"
    v-bind="$attrs"
  />
</template>

<script>
import VueDatepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: { VueDatepicker },
  props: {
    // https://vue3datepicker.com/
    // NOTE - model-value is mode dependent, be sure to use the proper configuration
    modelValue: {
      type: Object, // time-picker
      default: null
    },
    inputFontSize: {
      type: String,
      default: '12px'
    },
    inputHeight: {
      type: String,
      default: '44px'
    }
  },
  methods: {
    resetPicker() {
      this.$refs.timePicker.clearValue();
    }
  }
};
<\/script>
<style scoped lang="scss">
.time-picker {
  // overrides for VUEPIC Datepicker component to align with vuetify styling
  :deep(.dp__input) {
    border: transparent;
    box-shadow: 0px 3px 1px -2px rgba(#000, 0.2),
    0px 2px 2px 0px rgba(#000, 0.14), 0px 1px 5px 0px rgba(#000, 0.12);
    color: rgb(var(--v-theme-primary));
    font-size: v-bind(inputFontSize);
    height: v-bind(inputHeight);
  }
  :deep(.dp__pm_am_button) {
    color: white;
    background-color: rgb(var(--v-theme-primary));
  }
}
</style>
`;export{e as default};
