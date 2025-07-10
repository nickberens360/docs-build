const e=`<template>
  <div class="d-flex align-center flex-grow-1">
    <VIcon
      v-if="prependIcon"
      class="mr-4"
      color="primary-lighten-2"
      :icon="prependIcon"
    />
    <VueDatepicker
      ref="datePicker"
      auto-apply
      class="date-picker"
      :close-on-auto-apply="false"
      :enable-time-picker="false"
      hide-input-icon
      :keep-action-row="false"
      :model-value="modelValue"
      :month-change-on-scroll="false"
      six-weeks
      utc="preserve"
      week-start="0"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
import VueDatepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: { VueDatepicker },
  inheritAttrs: false,
  props: {
    // https://vue3datepicker.com/
    // NOTE - model-value is mode dependent, be sure to use the proper configuration
    modelValue: {
      type: [
        Array,  // range & week-picker
        Number, // year picker
        Object, // month-picker
        String  // single dates & multi-calendars & quarter-picker
      ],
      default: null
    },
    inputFontSize: {
      type: String,
      default: '12px'
    },
    inputHeight: {
      type: String,
      default: '44px'
    },
    prependIcon: {
      type: String,
      default: ''
    }
  },
  methods: {
    resetPicker() {
      this.$refs.datePicker.clearValue();
    }
  }
};
<\/script>
<style scoped lang="scss">
.date-picker {
  // overrides for VUEPIC Datepicker component to align with vuetify styling
  :deep(.dp__input) {
    border: transparent;
    box-shadow: 0px 3px 1px -2px rgba(#000, 0.2),
    0px 2px 2px 0px rgba(#000, 0.14), 0px 1px 5px 0px rgba(#000, 0.12);
    color: rgb(var(--v-theme-primary));
    font-size: v-bind(inputFontSize);
    height: v-bind(inputHeight);
  }
}
</style>
`;export{e as default};
