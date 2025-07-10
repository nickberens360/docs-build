const n=`<template>
  <VForm v-model="isCouponFormValidated">
    <label
      for="amount"
      class="text-primary-lighten-3 text-caption-3"
    >Amount</label>
    <VTextField
      id="amount"
      v-model="amountEntry"
      placeholder="10.00"
      class="pt-0 mb-4"
      prepend-icon="$dollarSignLight"
      style="max-width: 95px;"
      :rules="[required]"
    />
    <label
      for="reason"
      class="text-primary-lighten-3 text-caption-3 mb-2 d-block"
    >Reason</label>
    <VTextarea
      id="reason"
      v-model="reasonEntry"
      bg-color="white"
      rows="3"
      :rules="[required]"
      class="mb-6"
    />
  </VForm>
</template>

<script>
import { required } from '@/utils/validationMethods';

export default {
  emits: ['update:amount', 'update:reason', 'update:isFormValid'],
  data() {
    return {
      amount: '',
      reason: '',
      isFormValid: false,
    };
  },
  computed: {
    amountEntry: {
      get() {
        return this.amount;
      },
      set(value) {
        this.$emit('update:amount', value);
      }
    },
    reasonEntry: {
      get() {
        return this.reason;
      },
      set(value) {
        this.$emit('update:reason', value);
      }
    },
    isCouponFormValidated: {
      get() {
        return this.isFormValid;
      },
      set(value) {
        this.$emit('update:isFormValid', value);
      }
    },
  },
  methods: {
    required,
  },
};
<\/script>`;export{n as default};
