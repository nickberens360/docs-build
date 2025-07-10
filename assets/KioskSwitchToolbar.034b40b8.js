const n=`<template>
  <VToolbar
    color="surface-light"
    class="overflow-visible pl-4"
  >
    <slot name="fab" />
    <VTooltip location="bottom">
      <template #activator="{ props }">
        <VAvatar
          v-if="notMine && selectedKioskHasInfo"
          color="warning"
          class="mr-3"
          size="32"
          v-bind="props"
        >
          <VIcon
            theme="dark"
            size="small"
          >
            $vuetify.icons.userSlash
          </VIcon>
        </VAvatar>
      </template>
      <span>Not My Kiosk</span>
    </VTooltip>
    <VBadge
      v-show="selectedKioskHasInfo"
      class="align-self-center"
      color="info"
    >
      <template #badge>
        <VIcon
          size="x-small"
          theme="dark"
        >
          $vuetify.icons.info
        </VIcon>
      </template>
      <VMenu
        v-model="kioskInfoMenu"
        :close-on-content-click="false"
        location="end"
      >
        <template #activator="{ props }">
          <VAvatar
            color="#fafafa"
            v-bind="props"
          >
            <VImg
              :src="kioskImagePath"
              alt="Machine Type"
            />
          </VAvatar>
        </template>
        <VCard>
          <VList class="pr-50">
            <VListItem>
              <VListItemTitle class="text-body-4">
                {{
                  selectedKioskInfo.serialNumber
                }}
              </VListItemTitle>
              <VListItemSubtitle class="text-body-4">
                ABN: {{ selectedKioskMenuData.abn }}
              </VListItemSubtitle>
              <VListItemSubtitle class="text-body-4">
                {{ selectedKioskInfo.bannerName }}
              </VListItemSubtitle>
            </VListItem>
          </VList>
          <VDivider />
          <VList density="compact">
            <VListItem>
              <VListItemTitle>
                <div>{{ selectedKioskMenuData.address.addressLine1 }}</div>
                <div>{{ selectedKioskMenuData.address.addressLine2 }}</div>
                <div>
                  {{ selectedKioskMenuData.address.city }},
                  {{
                    selectedKioskMenuData.address.state +
                      " " +
                      selectedKioskMenuData.address.postalCode
                  }}
                </div>
                <div class="gmap_canvas">
                  <iframe
                    id="gmap_canvas"
                    width="100%"
                    height="100%"
                    src="https://maps.google.com/maps?q=google&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    frameborder="0"
                    scrolling="no"
                    marginheight="0"
                    marginwidth="0"
                  />
                </div>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <!-- {{ selectedKioskMenuData }} -->
              </VListItemTitle>
            </VListItem>
          </VList>

          <VCardActions>
            <div class="flex-grow-1" />
            <VBtn
              variant="text"
              @click="kioskInfoMenu = false"
            >
              Close
            </VBtn>
          </VCardActions>
        </VCard>
      </VMenu>
    </VBadge>
    <VToolbarTitle
      v-show="selectedKioskHasInfo"
      class="bg-surface-bright"
      style="max-width: 200px;"
    >
      <VList
        color="surface-bright"
        rounded
        class="pa-0"
        elevation="0"
        density="compact"
        variant="flat"
      >
        <VListItem class="bg-surface-bright">
          <VListItemTitle class="text-body-4">
            {{ selectedKioskInfo.serialNumber }}
          </VListItemTitle>
          <VListItemSubtitle
            v-if="selectedKioskInfo.abn"
            class="text-body-4"
          >
            <span>ABN:</span>
            {{ selectedKioskInfo.abn }}
          </VListItemSubtitle>
          <VListItemSubtitle class="text-body-4">
            {{ selectedKioskInfo.bannerName }}
          </VListItemSubtitle>
        </VListItem>
      </VList>
    </VToolbarTitle>
    <div class="flex-grow-1" />
    <KioskSwitchDialog restricted />
  </VToolbar>
</template>

<script>
import KioskSwitchDialog from '@/components/base/KioskSwitchDialog.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    KioskSwitchDialog
  },
  data: () => ({
    kioskInfoMenu: false,
    kioskImagePath: '',
  }),
  computed: {
    ...mapGetters('kiosk', [
      'getCurrentSelectedKioskCC',
      'getMachineTypeChute',
      'selectedKioskInfo'
    ]),
    ...mapState('kiosk', ['userKiosks']),
    notMine() {
      const serialNumber = this.selectedKioskInfo.serialNumber;

      return this.userKiosks.every(k => k.serialNumber != serialNumber);
    },
    selectedKioskMenuData() {
      let hasBanner = this.selectedKioskInfo.bannerName != '';
      let info = {
        abn: hasBanner ? this.getCurrentSelectedKioskCC.site.location.abn : '',
        address: hasBanner
          ? Object.assign(
            {},
            this.getCurrentSelectedKioskCC.site.location.address
          )
          : '',
        address2: hasBanner
          ? this.getCurrentSelectedKioskCC.site.location.address.addressLine2
          : ''
      };

      return info;
    },
    selectedKioskHasInfo() {
      return Object.keys(this.getCurrentSelectedKioskCC).length > 0;
    }
  },
  watch: {
    getCurrentSelectedKioskCC(value) {
      if (Object.keys(value).length <= 0) {
        return;
      }

      this.setMachineHeaders();
    },
  },
  created() {
    if (!this.kioskImagePath) {
      this.setMachineHeaders();
    }
  },
  methods: {
    setMachineHeaders() {
      const kiosk = this.getCurrentSelectedKioskCC;
      let mt = this.getMachineTypeChute.find(obj => obj.type == kiosk.machineType);

      if (mt) {
        this.kioskImagePath = mt.imagePath;
      }
    },
  },
};
<\/script>
`;export{n as default};
