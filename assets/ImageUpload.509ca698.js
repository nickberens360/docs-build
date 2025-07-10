const e=`<template>
  <!-- put a loader on this after upload -->
  <VTooltip location="start">
    <template #activator="{ props }">
      <VFabTransition>
        <VBtn
          v-show="show"
          :loading="loading"
          color="secondary"
          v-bind="props"
          icon
          position="fixed"
          size="large"
          :style="$vuetify.display.smAndDown ? 'bottom: 80px' : ''"
          location="bottom end"
          @click.stop="chooseFile"
        >
          <VIcon>$vuetify.icons.camera</VIcon>
          <VDialog
            v-model="uploadModal"
            :max-width="800"
            :fullscreen="$vuetify.display.smAndDown"
            @click:outside="closeUploadProcess"
          >
            <VCard>
              <VCardTitle>Upload {{ selectedCategory.name }} Image</VCardTitle>
              <VCardSubtitle class="mt-1 text-subtitle-2">
                {{ selectedCategory.desc }}
              </VCardSubtitle>
              <VCardText class="pb-0">
                <VRow align="stretch">
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <VCard flat>
                      <VCarousel
                        cycle
                        interval="5000"
                        :show-arrows="selectedCategory.qty > 1"
                        hide-delimiters
                        height="100%"
                        next-icon="$vuetify.icons.angleRight"
                        prev-icon="$vuetify.icons.angleLeft"
                      >
                        <VCarouselItem
                          v-for="i in selectedCategory.qty"
                          :key="i"
                        >
                          <S3Image
                            bucket="minutekey-kiosk-images"
                            :object-key="\`samples/\${selectedCategory.code}\${i}.jpg\`"
                            lazy-key="samples/loadingimage.png"
                            :aspect-ratio="$vuetify.display.smAndDown ? undefined : 3/4"
                          />
                        </VCarouselItem>
                      </VCarousel>
                    </VCard>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <VHover v-slot="{ hover }">
                      <VResponsive :aspect-ratio="$vuetify.display.smAndDown ? 4/3 : 3/4">
                        <VCard
                          :ripple="previewURLs.length === 0"
                          link
                          flat
                          :class="\`droppable-area bg-primary-lighten-\${hover || dragOver ? 4 : 5}\`"
                          @drop.prevent="onFilesChosen($event.dataTransfer.files)"
                          @dragleave.prevent="dragOver = false"
                          @dragover.prevent="dragOver = true"
                          @click="openSystemDialog"
                        >
                          <VProgressLinear
                            v-if="previewLoading"
                            :height="25"
                            absolute
                            location="top"
                            color="secondary"
                            :model-value="livePreviewPercent"
                          />
                          <VCard
                            v-if="previewURLs.length"
                            flat
                            height="100%"
                          >
                            <VCarousel
                              :show-arrows="queuedFiles.length > 1"
                              hide-delimiters
                              height="100%"
                              next-icon="$vuetify.icons.angleRight"
                              prev-icon="$vuetify.icons.angleLeft"
                              @click.stop
                            >
                              <VCarouselItem
                                v-for="(url, i) in previewURLs"
                                :key="i"
                              >
                                <VImg
                                  :aspect-ratio="$vuetify.display.smAndDown ? undefined : 3/4"
                                  :src="url"
                                />
                              </VCarouselItem>
                            </VCarousel>
                          </VCard>
                          <VRow
                            v-else
                            align="center"
                            class="fill-height"
                          >
                            <VCol>
                              <div class="font-weight-bold text-primary subtitle text-center">
                                <VIcon
                                  class="mx-auto mb-4"
                                  size="x-large"
                                >
                                  $vuetify.icons.image
                                </VIcon>
                                <div v-if="$vuetify.display.smAndDown">
                                  Tap to Upload
                                </div>
                                <div v-else>
                                  Drop your image here <br> or click to upload
                                </div>
                              </div>
                            </VCol>
                          </VRow>
                        </VCard>
                      </VResponsive>
                    </VHover>
                  </VCol>
                </VRow>
                <VRow
                  v-if="!$vuetify.display.smAndDown"
                  class="font-weight-bold text-center"
                >
                  <VCol cols="6">
                    Example {{ selectedCategory.name }} Image{{ selectedCategory.qty > 1 ? 's' : '' }}
                  </VCol>
                  <VCol cols="6">
                    Your Image{{ queuedFiles.length > 1 ? 's' : '' }}
                  </VCol>
                </VRow>
              </VCardText>
              <VCardActions>
                <VExpandTransition>
                  <VAlert
                    v-show="oversizedUpload"
                    icon="$vuetify.icons.exclamationTriangle"
                    class="mx-4 mb-0"
                    variant="outlined"
                    width="100%"
                    type="error"
                  >
                    Total file size is too large. Please try again with less images.
                  </VAlert>
                </VExpandTransition>
              </VCardActions>
              <VCardActions>
                <VSpacer />
                <VBtnSecondary @click="closeUploadProcess">
                  Cancel
                </VBtnSecondary>
                <VBtnPrimary
                  class="mr-4"
                  :disabled="!queuedFiles.length || oversizedUpload"
                  @click="onUpload"
                >
                  Upload
                </VBtnPrimary>
              </VCardActions>
            </VCard>
          </VDialog>
        </VBtn>
      </VFabTransition>
      <input
        ref="upload"
        class="hidden"
        accept=".jpg,.jpg,.png"
        type="file"
        multiple
        @change="onFilesChosen($event.target.files)"
      >
    </template>
    <span>Add Photo</span>
  </VTooltip>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import S3Image from '@/components/base/S3Image.vue';

const MAX_PAYLOAD_SIZE = 26214400; // 25 MB

export default {
  components: {
    S3Image
  },
  props: {
    loading: Boolean,
    show: Boolean,
    selectedCategory: {
      type: Object,
      default: () => ({}),
    },
    exampleImagePrefix: {
      type: String,
      default: '',
    },
  },
  emits: ['upload'],
  data: () => ({
    queuedFiles: [],
    previewURLs: [],
    dragOver: false,
    previewLoading: false,
    previewPercent: 0,
    oversizedUpload: false,
  }),
  computed: {
    ...mapState('app', ['uploadModal']),
    livePreviewPercent() {
      return this.previewPercent;
    }
  },
  methods: {
    ...mapMutations('app', ['setUploadModal']),
    onUpload() {
      this.$emit('upload', { files: this.queuedFiles, blobs: this.previewURLs });
      this.closeUploadProcess();
    },
    onFilesChosen(files) {
      if (!files.length) {
        return;
      }

      this.previewPercent = 0;
      this.previewLoading = true;

      // attempt to downscale each image
      this.downscaleQueuedImages(files).then(processedImages => {
        // set preview URLs to the uploaded file blob URLs
        this.previewURLs = processedImages.map(file => URL.createObjectURL(file));

        // store copy of files in state before reset
        this.queuedFiles = Array.from(processedImages);

        this.previewLoading = false;

        // reset the file input
        this.$refs.upload.value = null;
      }).catch(reason => {
        this.previewLoading = false;

        switch (reason) {
          case 'oversize':
            this.$refs.upload.value = null;
            break;
        }
      });
    },
    downscaleQueuedImages(imageFiles) {
      return new Promise((resolve, reject) => {
        const maxLongestDimension = 1080;
        let processedImages = [];
        let totalPayloadSize = 0;
        const onImageComplete = (newImage) => {
          processedImages.push(newImage);
          totalPayloadSize += newImage.size;

          // update progress bar (yes, I know this is bad math)
          this.previewPercent = processedImages.length * 170.0 / imageFiles.length;

          if (processedImages.length === imageFiles.length) {
            this.oversizedUpload = totalPayloadSize > MAX_PAYLOAD_SIZE;

            if (this.oversizedUpload) {
              console.warn(\`Total file size not within payload limit: \${totalPayloadSize}/\${MAX_PAYLOAD_SIZE}\`);
              reject('oversize');
            } else {
              console.log('files compressed, within payload size limits');
            }
            resolve(processedImages);
          }
        };

        for (const imageFile of imageFiles) {
          const reader = new FileReader();

          reader.onerror = error => console.error(error);
          reader.onload = event => {
            const img = new Image();

            img.onload = () => {
              // only downscale images larger than 1080x1080
              if (img.width >= maxLongestDimension || img.height >= maxLongestDimension) {
                let destWidth, destHeight;

                if (img.width >= img.height) {
                  destWidth = maxLongestDimension;
                  destHeight = img.height * destWidth / img.width;
                } else {
                  destHeight = maxLongestDimension;
                  destWidth = img.width * destHeight / img.height;
                }

                const canvas = document.createElement('canvas');

                canvas.width = destWidth;
                canvas.height = destHeight;
                const context = canvas.getContext('2d');

                context.drawImage(img, 0, 0, destWidth, destHeight);
                context.canvas.toBlob(blob => {
                  const generatedFile = new File([blob], imageFile.name, { type: imageFile.type });

                  onImageComplete(generatedFile);
                }, imageFile.type, 1);
              } else {
                // skip images that are the correct size
                onImageComplete(imageFile);
              }
            };

            // load the image
            img.src = event.target.result;
          };

          // execute image resize
          reader.readAsDataURL(imageFile);
        }
      });
    },
    chooseFile() {
      this.setUploadModal(true);
    },
    closeUploadProcess() {
      this.setUploadModal(false);
      this.queuedFiles = [];
      this.previewURLs = [];
      this.oversizedUpload = false;
    },
    openSystemDialog() {
      this.$refs.upload.click();
    }
  },
};
<\/script>

<style lang="scss" scoped>
    .droppable-area {
        height: 100%;
        transition: background-color 0.2s ease-in-out;
    }

    .hidden {
        display: none;
    }
</style>
`;export{e as default};
