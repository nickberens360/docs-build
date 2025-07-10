const n=`<template>
  <VDialog
    v-model="confirmDialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <VCard>
      <VToolbar
        :color="options.color"
        density="compact"
      >
        <VToolbarTitle :class="options.textColor">
          <VIcon
            v-if="options.titleIcon"
            :icon="options.titleIcon"
          /> {{ title }}
        </VToolbarTitle>
      </VToolbar>
      <VCardText
        v-show="!!message"
        class="pa-4"
      >
        {{ message }}
        <p
          v-if="options.supportingMessage"
          class="text-body-4 mt-4"
        >
          {{ options.supportingMessage }}
        </p>
      </VCardText>
      <VCardActions class="pt-0 px-4">
        <VBtnSecondary @click="cancel">
          {{ options.cancelBtnText }}
        </VBtnSecondary>
        <VSpacer />
        <VBtnPrimary @click="agree">
          {{ options.confirmBtnText }}
        </VBtnPrimary>
      </VCardActions>
      <slot name="below-actions" />
    </VCard>
  </VDialog>
</template>

<script>

export default {
  data: () => ({
    confirmDialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: 'primary',
      textColor: undefined,
      width: 290,
      zIndex: 30,
      confirmBtnText: 'Yes',
      cancelBtnText: 'Cancel',
      titleIcon: undefined,
      supportingMessage: undefined,
    }
  }),
  methods: {
    open(title, message, options) {
      this.confirmDialog = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.confirmDialog = false;
    },
    cancel() {
      this.resolve(false);
      this.confirmDialog = false;
    }
  }
};
<\/script>
`;export{n as default};
