const n=`<template>
  <VCard class="mark-as-form">
    <template #title>
      <VCardTitle class="text-capitalize">
        Mark As {{ actionType }}
      </VCardTitle>
    </template>
    <template #default>
      <VCardText>
        <VForm
          ref="form"
          v-model="isFormValid"
        >
          <VTextField
            v-if="actionType === 'cut'"
            v-model="formData.validationScanId"
            label="Validation Scan ID"
            hint="Optional"
            persistent-hint
            variant="outlined"
            class="mb-2"
          />
          <VTextarea
            v-model="formData.notes"
            label="Notes"
            hint="Optional"
            persistent-hint
            variant="outlined"
          />
        </VForm>
      </VCardText>
    </template>
    <template #actions>
      <div class="mark-as-form__actions">
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
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    actionType: {
      type: String,
      default: 'cut',
      validator: (value) => {
        return ['cut', 'programmed'].includes(value);
      },
    },
  },
  emits: ['cancel', 'submit'],
  expose: ['reset'],
  data: () => ({
    isFormValid: false,
    formData: {
      validationScanId: undefined,
      notes: ''
    },
  }),
  methods: {
    cancel() {
      this.reset();
      this.$emit('cancel');
    },
    submit() {
      this.$emit('submit', {
        formData: JSON.parse(JSON.stringify(this.formData)),
        actionType: this.actionType
      });
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
<\/script>
<style lang="scss" scoped>
.mark-as-form {
  min-width: 400px;

  &__actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
`;export{n as default};
