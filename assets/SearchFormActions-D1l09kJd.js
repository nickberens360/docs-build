const n=`<template>
  <div class="px-4 d-flex">
    <VSpacer />
    <VBtnSecondary
      prepend-icon="$times"
      class="mr-4"
      @click="$emit('reset')"
    >
      {{ resetBtnLabel }}
    </VBtnSecondary>
    <VBtnPrimary
      :disabled="disabled"
      :prepend-icon="submitBtnIcon"
      @click="$emit('submit')"
    >
      {{ submitBtnLabel }}
    </VBtnPrimary>
  </div>
</template>

<script>

export default {
  name: 'SearchFormActions',
  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
    submitBtnLabel: {
      type: String,
      default: 'Submit',
    },
    submitBtnIcon: {
      type: String,
      default: undefined,
    },
    resetBtnLabel: {
      type: String,
      default: 'Reset',
    },
  },
  emits: ['reset', 'submit'],
};
<\/script>`;export{n as default};
