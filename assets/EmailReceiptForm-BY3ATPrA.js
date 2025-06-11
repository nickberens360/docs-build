const n=`<template>
  <div>
    <VForm v-model="isEmailFormValidated">
      <label
        for="email"
        class="text-primary-lighten-3 text-caption-3"
      >Email Address</label>
      <VTextField
        id="email"
        v-model="emailEntry"
        placeholder="name@email.com"
        class="pt-0"
        :rules="emailRules"
      />
    </VForm>
  </div>
</template>

<script>
import { emailRules } from '@/utils/validationMethods';

export default {
  props: {
    email: {
      type: String,
      default: null,
    },
    isFormValid: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:email', 'update:isFormValid'],
  data() {
    return {
      emailRules,
    };
  },
  computed: {
    emailEntry: {
      get() {
        return this.email;
      },
      set(value) {
        this.$emit('update:email', value);
      }
    },
    isEmailFormValidated: {
      get() {
        return this.isFormValid;
      },
      set(value) {
        this.$emit('update:isFormValid', value);
      }
    },
  },
};
<\/script>

<style scoped lang="scss">
.receipt-wrapper {
  max-width: 349px;
  margin: 0 auto;
}
:deep(.theme--light.v-input input) {
  color: #666666 !important;
}

</style>
`;export{n as default};
