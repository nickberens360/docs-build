const e=`<template>
  <VCard
    class="allow-card-overflow search-form"
    color="surface-light"
  >
    <VCardTitle
      v-if="formTitle || $slots['formTitle']"
    >
      <slot name="formTitle">
        {{ formTitle }}
      </slot>
    </VCardTitle>
    <VCardText class="pa-0">
      <VForm
        ref="searchForm"
        v-model="valid"
        @update:model-value="$emit('valid', $event)"
      >
        <slot name="default" />
      </VForm>
    </VCardText>
  </VCard>
</template>

<script>

export default {
  props: {
    formData: {
      type: Object,
      required: true,
    },
    formTitle: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['update:form-data', 'valid'],
  expose: ['resetForm'],
  data: () => ({
    valid: false,
  }),
  computed: {
    formModel: {
      get() {
        return this.formData;
      },
      set(value) {
        this.$emit('update:form-data', value);
      },
    },
  },
  methods: {
    resetForm() {
      this.$refs.searchForm.reset();
      this.$refs.searchForm.resetValidation();
    },
  },
};
<\/script>

<style lang="scss" scoped>
.search-form {
  box-shadow: 0 2px 4px #00000029;
}
:deep(.v-card-title) {
  border-bottom: 2px solid #cfd8dc;
}
</style>
`;export{e as default};
