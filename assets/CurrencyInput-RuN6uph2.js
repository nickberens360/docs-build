const n=`<template>
  <VTextField
    ref="inputRef"
    v-model="formattedValue"
  />
</template>

<script>
import { useCurrencyInput } from 'vue-currency-input';
const defaultOptions = {
  currency: 'USD',
  precision: 2,
  hideCurrencySymbolOnFocus: false,
  hideNegligibleDecimalDigitsOnFocus: false,
};

export default {
  props: {
    modelValue: {
      type: Number,
      required: false,
      default: undefined
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const {
      inputRef,
      formattedValue,
      setValue,
      setOptions
    } = useCurrencyInput(Object.assign({}, defaultOptions, props.options));

    return {
      inputRef,
      formattedValue,
      setValue,
      setOptions
    };
  },
  watch: {
    options(options) {
      this.setOptions(
        Object.assign({}, defaultOptions, options)
      );
    },
    modelValue(value) {
      this.setValue(value);
    }
  }
};
<\/script>
`;export{n as default};
