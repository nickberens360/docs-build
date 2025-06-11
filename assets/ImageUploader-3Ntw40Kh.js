const n=`<template>
  <VCard
    variant="outlined"
    class="d-flex flex-column justify-center align-center pa-4"
    width="100%"
    @dragover.prevent
    @drop.prevent="onFileChosen($event.dataTransfer.files)"
  >
    <div
      class="d-flex align-center"
      :style="\`height: \${height}px; width: 100%;\`"
    >
      <!-- Product Image -->
      <VImg
        v-if="!failedToLoadImage && (previewURL || img)"
        :lazy-src="lazySrc"
        :src="previewURL || img"
        class="d-block"
        :max-height="height"
        max-width="100%"
        @error="failedToLoadImage = true"
      />

      <!-- No Image Indicator -->
      <VCard
        v-else
        rounded="0"
        flat
        width="100%"
        height="100%"
        color="surface-light"
      >
        <VCardText
          class="d-flex flex-column align-center justify-center h-100"
        >
          <VIcon
            size="x-large"
            class="d-block"
          >
            $image
          </VIcon>
          <div class="text-subtitle-2 mt-4">
            Product Image
          </div>
        </VCardText>
      </VCard>
    </div>

    <!-- Upload Button -->
    <VBtnPrimary
      class="mt-4"
      @click="openUploadDialog"
    >
      <VIcon
        size="small"
        start
      >
        $camera
      </VIcon>{{ (!previewURL && !img) || failedToLoadImage ? "Upload" : "Replace" }}
    </VBtnPrimary>

    <!-- File Input (Invisible) -->
    <input
      v-show="false"
      ref="upload"
      :accept="accept"
      type="file"
      @change="onFileChosen($event.target.files)"
    >

    <VSlideYTransition>
      <VMessages
        v-show="!isValid"
        class="mt-2"
        :value="['*Required']"
        color="error"
      />
    </VSlideYTransition>
  </VCard>
</template>

<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: undefined,
    },
    height: {
      type: [Number, String],
      default: undefined,
    },
    hideSize: Boolean,
    img: {
      type: String,
      default: '',
    },
    lazySrc: {
      type: String,
      default: '',
    },
    accept: {
      type: String,
      default: '',
    },
  },
  emits: ['newImage'],
  data: () => ({
    file: null,
    previewURL: null,
    failedToLoadImage: false,
    isValid: true
  }),
  methods: {
    reset() {
      this.file = this.previewURL = null;
      this.failedToLoadImage = false;
    },
    validate() {
      this.isValid = !!this.file;

      return this.isValid;
    },
    onFileChosen([file]) {
      if (file) {
        this.previewURL = URL.createObjectURL(file);
        this.file = file;

        this.$emit('newImage', {
          file,
          previewURL: this.previewURL
        });
      }

      this.validate();
    },
    openUploadDialog() {
      this.$refs.upload.click();
    },
  },
};
<\/script>`;export{n as default};
