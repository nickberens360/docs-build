const n=`<template>
  <VForm v-model="isTextFormValidated">
    <label
      for="phone"
      class="text-primary-lighten-3 text-caption-3"
    >Phone Number </label>
    <VTextField
      id="phone"
      v-model="phoneEntry"
      placeholder="555-555-5555"
      :rules="rules.phoneNumRules"
      class="pt-0"
    />
  </VForm>
</template>

<script>
import { phoneNumRules } from '@/utils/validationMethods';

export default {
  props: {
    phone: {
      type: String,
      default: null,
    },
    isFormValid: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:phone', 'update:isFormValid'],
  data() {
    return {
      rules: {
        phoneNumRules
      }
    };
  },
  computed: {
    phoneEntry: {
      get() {
        return this.phone;
      },
      set(value) {
        this.$emit('update:phone', value);
      }
    },
    isTextFormValidated: {
      get() {
        return this.isFormValid;
      },
      set(value) {
        this.$emit('update:isFormValid', value);
      }
    }
  },

};
<\/script>

<style scoped lang="scss">
  :deep(.theme--light.v-input input) {
  color: #666666 !important;
}
</style>`;export{n as default};
