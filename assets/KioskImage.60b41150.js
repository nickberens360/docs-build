const n=`<template>
  <VHover>
    <template #default="{ isHovering, props }">
      <VCard
        v-bind="props"
        height="100%"
        class="d-flex flex-column justify-space-between"
      >
        <VCardText class="pb-0 status-msg">
          <VChip
            label
            class="status-msg__chip font-weight-bold mb-2"
            size="small"
            :color="approvalStatus.color"
          >
            {{ approvalStatus.name }}
          </VChip>
          <p
            v-if="image.approvalType === 'U'"
            class="text-warning font-weight-bold"
          >
            Hang tight! Pending review.
          </p>
          <p
            v-if="image.approvalType === 'R'"
            class="text-error font-weight-bold"
          >
            {{ image.approvalDesc || "[ No Issue Description ]" }}
          </p>
          <p
            v-if="image.approvalType === 'A'"
            class="text-success font-weight-bold"
          >
            Congrats! Image approved.
          </p>
        </VCardText>
        <!-- Image (with rotation controls and delete button) -->
        <VResponsive
          :aspect-ratio="$vuetify.display.smAndDown ? undefined : 3/4"
          class="responsive-container"
          @contextmenu.prevent="showContextMenu"
        >
          <S3Image
            :height="imageHeight"
            :blob="image.blob"
            bucket="minutekey-kiosk-images"
            :object-key="objectKey"
            lazy-key="samples/loadingimage.png"
            :v-img-style="\`opacity:\${isRotating || rotationRequestInProgress ? 0.7 : 1};transition:opacity 0.2s ease;transform: rotate(\${relativeRotation}deg);transition: transform 0.2s ease;\`"
            @load="imageLoaded"
          />
          <!-- Context Menu -->

          <VMenu
            v-if="image.imageFilename"
            v-model="isContextMenuShown"
            :style="\`top: \${contextMenuPosition.y}px; left: \${contextMenuPosition.x}px;\`"
            class="position-absolute"
          >
            <VList density="compact">
              <VListItem
                target="_blank"
                :href="\`https://minutekey-kiosk-images.s3.amazonaws.com/\${objectKey}\`"
              >
                <VListItemTitle>View Image</VListItemTitle>
                <template #append>
                  <VIcon size="small">
                    $vuetify.icons.externalLink
                  </VIcon>
                </template>
              </VListItem>
            </VList>
          </VMenu>
          <!-- Apply Rotation Button -->
          <div class="position-absolute top-0 left-0 w-100 h-100">
            <div class="d-flex flex-column align-center justify-center h-100">
              <VFadeTransition>
                <VBtn
                  v-show="isRotating"
                  :loading="rotationRequestInProgress"
                  size="large"
                  @click="confirmRotation"
                >
                  Apply
                  <VIcon end>
                    $vuetify.icons.save
                  </VIcon>
                </VBtn>
              </VFadeTransition>
            </div>
          </div>

          <!-- Rotate/Delete Controls -->
          <div
            v-if="hasEditPermission && !rotationRequestInProgress"
            class="actions"
          >
            <div>
              <VSlideYTransition>
                <VBtn
                  v-show="isHovering"
                  size="x-small"
                  icon
                  @click="rotate(false)"
                >
                  <VIcon>$vuetify.icons.rotateCCW</VIcon>
                </VBtn>
              </VSlideYTransition>
              <VSlideYTransition>
                <VBtn
                  v-show="isHovering"
                  size="x-small"
                  icon
                  @click="rotate(true)"
                >
                  <VIcon>$vuetify.icons.rotateCW</VIcon>
                </VBtn>
              </VSlideYTransition>
            </div>
            <VSlideYTransition>
              <VBtn
                v-show="isHovering"
                size="x-small"
                icon
                @click="deleteDialogOpen = true"
              >
                <VIcon>$trash</VIcon>
              </VBtn>
            </VSlideYTransition>
          </div>

          <div
            v-else-if="!hasEditPermission"
            class="actions"
          >
            <VSlideYTransition>
              <VAlert
                v-show="isHovering"
                color="surface"
                width="100%"
                icon="$vuetify.icons.lock"
              >
                Not Your Image
              </VAlert>
            </VSlideYTransition>
          </div>
        </VResponsive>




        <VCardText class="pb-0">
          <VRow
            class="text-subtitle-2 mx-0 mb-0 w-100 justify-space-between"
          >
            <VCol class="pa-0">
              {{ new Date(image.uploadTimestampUTC).toLocaleDateString() }}
            </VCol>
            <VCol class="pa-0 text-right">
              {{ new Date(image.uploadTimestampUTC).toLocaleTimeString() }}
            </VCol>
          </VRow>

          <VDivider class="my-2" />

          <div class="d-flex align-start justify-space-between">
            <VSelect
              v-model="thisCategory"
              style="flex: 4"
              label="Category"
              class="mt-4 mr-4"
              :disabled="!hasEditPermission"
              density="compact"
              :items="specificCategories"
              :item-title="cat => cat.name"
              :item-value="cat => cat"
            />
            <!-- Approval Section -->
            <div
              v-if="hasApprovalPermission"
              style="min-width: 68px"
            >
              <div class="text-center text-caption">
                Approval
              </div>

              <!-- Request Retake -->
              <VTooltip location="bottom">
                <template #activator="{ props: activatorProps }">
                  <VBtn
                    v-bind="activatorProps"
                    size="x-small"
                    icon
                    :elevation="0"
                    rounded="0"
                    :color="approvalStatus.abbr === 'R' ? 'error' : ''"
                    @click="rejectionDialogOpen = true"
                  >
                    <VIcon>$thumbsDown</VIcon>
                  </VBtn>
                </template>
                <span>Request Retake</span>
              </VTooltip>

              <!-- Approve -->
              <VTooltip location="bottom">
                <template #activator="{ props: activatorProps }">
                  <VBtn
                    v-bind="activatorProps"
                    size="x-small"
                    icon
                    :elevation="0"
                    rounded="0"
                    :color="approvalStatus.abbr === 'A' ? 'success' : ''"
                    @click="approvalChange('APPROVE')"
                  >
                    <VIcon>$thumbsUp</VIcon>
                  </VBtn>
                </template>
                <span>Approve</span>
              </VTooltip>
            </div>
          </div>
        </VCardText>

        <!-- Delete Dialog -->
        <VDialog
          v-model="deleteDialogOpen"
          :max-width="400"
          @click:outside="deleteDialogOpen = false"
        >
          <VCard>
            <VCardTitle>Confirm Delete</VCardTitle>
            <VCardText>
              <p>Are you sure you want to delete this image?</p>
              <p>
                This operation <b>CANNOT</b> be undone. The file will be deleted <b>IMMEDIATELY</b> upon clicking the red
                button.
              </p>
            </VCardText>
            <VCardActions class="align-baseline">
              <VSpacer />
              <VBtn
                variant="text"
                @click="deleteDialogOpen = false"
              >
                Cancel
              </VBtn>
              <VBtn
                class="mr-4 mb-2"
                color="error"
                variant="flat"
                @click="confirmDelete"
              >
                Destroy Image
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>

        <!-- Request Retake Dialog -->
        <VDialog
          v-model="rejectionDialogOpen"
          :max-width="400"
          @click:outside="cancelReject"
        >
          <VCard>
            <VCardTitle>Provide Reason</VCardTitle>
            <VCardText>
              <p>Why do you want to reject this image?</p>
              <VTextField
                v-model="newApprovalDesc"
                autofocus
                :counter="50"
                label="Reason"
                :placeholder="randomPlaceholder"
                maxlength="50"
                @keypress.enter="approvalChange('REJECT')"
              />
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn
                variant="text"
                @click="cancelReject"
              >
                Cancel
              </VBtn>
              <VBtn
                class="mr-4 mb-2"
                color="error"
                variant="flat"
                @click="approvalChange('REJECT')"
              >
                Request Retake
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </VCard>
    </template>
  </VHover>
</template>

<script>
import { mapState } from 'vuex';
import S3Image from '@/components/base/S3Image.vue';
import { rotateImage } from '@/services/kioskImageAPIService';


export default {
  components: {
    S3Image
  },
  props: {
    image: {
      type: Object,
      default: () => ({}),
    },
    categories: {
      type: Array,
      default: () => [],
    },
    hasApprovalPermission: Boolean,
  },
  emits: ['recat', 'rotate', 'delete', 'approvalChange'],
  data: () => ({
    isContextMenuShown: false,
    contextMenuPosition: {
      x: undefined,
      y: undefined
    },
    rejectionDialogOpen: false,
    deleteDialogOpen: false,
    placeholders: [
      'image is too blurry',
      'kiosk is too far away',
      'lighting is too dim',
      'wrong orientation',
      'resolution too low'
    ],
    newApprovalDesc: '',
    relativeRotation: 0,
    rotationRequestInProgress: false,
    imgKey: 0,
    initialAspectRatio: undefined,
  }),
  computed: {
    ...mapState('user', ['user']),
    normalizedRotation() {
      // returns rotation between +/- 270 deg
      return this.relativeRotation % 360;
    },
    objectKey() {
      return \`\${this.image.serialNumber}/\${this.image.imageFilename + (this.image.version ? \`?v=\${this.image.version}\` : '')}\`;
    },
    imageHeight() {
      return this.isInitialAspectRatio ? undefined : this.$el.clientWidth;
    },
    isInitialAspectRatio() {
      return this.relativeRotation % 180 === 0;
    },
    hasEditPermission() {
      return this.hasApprovalPermission || this.image.userId === this.user.id;
    },
    thisCategory: {
      get() {
        return this.categories.find(cat => cat.code === this.image.imageCategory);
      },
      set(value) {
        this.$emit('recat', {kioskImage: this.image, imageCategory: value});
      }
    },
    specificCategories() {
      return this.categories.filter(cat => cat.code !== 'A');
    },
    randomPlaceholder() {
      return this.placeholders[Math.floor(Math.random() * this.placeholders.length)];
    },
    isRotating() {
      return this.relativeRotation % 360 !== 0;
    },
    approvalStatus() {
      switch (this.image.approvalType) {
        case 'A':
          return {
            abbr: 'A',
            name: 'Approved',
            color: 'success',
          };
        case 'R':
          return {
            abbr: 'R',
            name: 'Needs Retake',
            color: 'error',
          };
        default:
          return {
            abbr: 'U',
            name: 'New',
            color: 'warning',
          };
      }
    },
  },
  created() {
    this.newApprovalDesc = this.image.approvalDesc;
  },
  methods: {
    showContextMenu(e) {
      this.isContextMenuShown = false;
      this.contextMenuPosition = {
        x: e.clientX,
        y: e.clientY
      };
      this.$nextTick(() => this.isContextMenuShown = true);
    },
    imageLoaded(element) {
      const { clientWidth, clientHeight } = element;

      this.initialAspectRatio = clientWidth / clientHeight;
    },
    rotate(clockwise) {
      const dR = clockwise ? 90 : -90;

      this.relativeRotation += dR;
    },
    confirmRotation() {
      // there is a possibility to click the button while it's fading out
      if (this.normalizedRotation === 0) {
        return;
      }

      let rotationDirection = '';

      switch (this.normalizedRotation) {
        case 90:
        case -270:
          rotationDirection = 'Right';
          break;
        case 180:
        case -180:
          rotationDirection = 'UpsideDown';
          break;
        case 270:
        case -90:
          rotationDirection = 'Left';
          break;
      }

      this.rotationRequestInProgress = true;
      rotateImage(this.image, rotationDirection).then(({ data: newVersion }) => {
        this.relativeRotation = 0;
        this.rotationRequestInProgress = false;
        this.$emit('rotate', { newVersion, kioskImageId: this.image.KioskImageId });
      });
    },
    confirmDelete() {
      this.deleteDialogOpen = false;
      this.$emit('delete', this.image);
    },
    approvalChange(action) {
      // clsoe dialog if open
      this.rejectionDialogOpen = false;

      if (action === 'APPROVE') {
        this.newApprovalDesc = '';
      }

      this.$emit('approvalChange', {
        action,
        kioskImage: this.image,
        approvalDesc: this.newApprovalDesc
      });
    },
    cancelReject() {
      this.newApprovalDesc = this.image.approvalDesc;
      this.rejectionDialogOpen = false;
    }
  },
};
<\/script>

<style
  lang="scss"
  scoped
>
.status-msg {
  p {
    text-align: center;
    width: 100%;
    margin-bottom: 1em;
    max-height: 45px;
    overflow-y: auto;
  }
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;


  &__chip {
    min-height: 24px;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.0);
  }
  100% {
    transform: scale(0.9);
  }
}

.pulse {
  animation: pulse 2s infinite;
}

.actions {
  transition: opacity 0.2s ease-in-out;
  width: 100%;
  position: absolute;
  top: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

// Keeps images centered in white space between header and footer
.responsive-container {
  display: flex;
  align-items: center;
}
</style>
`;export{n as default};
