const n=`<template>
  <VCard class="exception-form">
    <template #title>
      <VCardTitle>
        Raise Exception
      </VCardTitle>
    </template>
    <template #default>
      <VCardText>
        <VForm
          ref="form"
          v-model="isFormValid"
        >
          <VSelect
            v-model="formData.action"
            label="Action"
            :rules="[requiredRule]"
            :items="actionOptions"
            variant="outlined"
          />
          <VTextarea
            v-model="formData.notes"
            :rules="[requiredRule]"
            label="Notes"
            variant="outlined"
          />
        </VForm>
      </VCardText>
    </template>
    <template #actions>
      <div class="exception-form__actions">
        <VBtnSecondary
          :disabled="loading"
          @click="cancel()"
        >
          Cancel
        </VBtnSecondary>
        <VBtnPrimary
          :disabled="!isFormValid"
          :loading="loading"
          @click="submit()"
        >
          Submit
        </VBtnPrimary>
      </div>
    </template>
  </VCard>
</template>
<script>
import { required } from '@/utils/validationMethods';
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'submit'],
  expose: ['reset'],
  data: () => ({
    isFormValid: false,
    requiredRule: required,
    formData: {
      action: undefined,
      notes: ''
    },
    actionOptions: [
      { title: 'Refund', value: 'refund' },
      { title: 'Confirm Back Order', value: 'confirm-back-order' },
      { title: 'Contact Customer', value: 'contact-customer' },
    ]
  }),
  methods: {
    cancel() {
      this.reset();
      this.$emit('cancel');
    },
    submit() {
      this.$emit('submit', JSON.parse(JSON.stringify(this.formData)));
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
<\/script>
<style lang="scss" scoped>
.exception-form {
  min-width: 400px;

  &__actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
`;export{n as default};
