const n=`<template>
  <VContainer>
    <VRow>
      <!-- Compatible Vehicles -->
      <VCol
        cols="12"
        sm="6"
        md="8"
        class="text-center"
      >
        <div class="text-subtitle-1">
          Compatible Vehicles
        </div>
        <VRow>
          <VCol
            v-for="vehicle in compatibleVehicles"
            :key="vehicle.id"
            cols="6"
            md="4"
            lg="3"
            xl="2"
          >
            <VCard height="100%">
              <VCardText>
                <b>{{ vehicle.make }}</b> <br>
                {{ vehicle.model }} <br>
                {{ vehicle.year.start }} - {{ vehicle.year.end }}
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCol>

      <!-- Price & Additional Information -->
      <VCol
        cols="12"
        sm="6"
        md="4"
        class="text-center"
      >
        <div class="text-subtitle-1 mb-4">
          Product Image
        </div>
        <ImageUploader
          :lazy-src="\`\${environment.skuImageBaseUrl}DRE4RT0000GM014\`"
          :img="sku.imgData && sku.imgData.previewURL || (environment.skuImageBaseUrl + (sku.imgData ? 'tmp/' : '') + sku.sku + '?' + sku.imageHash)"
          width="380"
          height="150"
          enforce-size-constraint
          @new-image="imageReplaced"
        />

        <VRow>
          <VCol cols="5">
            <div class="text-subtitle-1">
              Price
            </div>
            <div class="text-h5">
              {{ $filters.currency(design.price) }}
            </div>
          </VCol>
          <VCol cols="7">
            <div class="text-subtitle-1">
              Key Type
            </div>
            <div class="text-h5">
              {{ design.carKeyDesign.keyType }}
            </div>
          </VCol>
        </VRow>

        <VDivider class="my-4" />

        <div class="text-subtitle-1 mb-2">
          Push to Start
        </div>
        <VAvatar
          class="font-weight-bold"
          :color="isSmartKey ? 'primary' : 'primary-lighten-4'"
        >
          {{ isSmartKey ? 'Yes' : 'No' }}
        </VAvatar>

        <VDivider class="my-4" />

        <VBadge
          inline
          class="font-weight-bold"
          :content="design.carKeyDesign.buttons.length"
        >
          <div class="text-subtitle-1">
            Buttons
          </div>
        </VBadge>
        <VRow justify="center">
          <VCol
            v-for="button in buttons"
            :key="button.name"
            class="text-center"
            cols="4"
            sm="3"
          >
            <VAvatar
              color="primary"
              class="font-weight-bold"
            >
              <VIcon>
                $vuetify.icons.{{ button.icon || 'question' }}
              </VIcon>
            </VAvatar>
            <div class="text-caption">
              {{ button.name }}
            </div>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapGetters } from 'vuex';
import ImageUploader from '@/components/base/ImageUploader.vue';

export default {
  components: {
    ImageUploader
  },
  props: {
    design: {
      type: Object,
      default: () => ({})
    },
  },
  emits: ['car-key-image-replaced'],
  computed: {
    ...mapGetters({ environment: 'app/getEnvConfigs' }),
    sku() {
      return this.design.skus[0];
    },
    buttons() {
      // [displayName, iconName]
      const buttonInfo = {
        L: { name: 'Lock', icon: 'lock' },
        U: { name: 'Unlock', icon: 'unlock' },
        P: { name: 'Panic', icon: 'sirenOn' },
        T: { name: 'Trunk', icon: 'carSide' },
        H: { name: 'Hatch', icon: 'carSide' },
        G: { name: 'Glass Hatch', icon: 'carSide' },
        SD: { name: 'Sliding Door', icon: 'shuttleVan' },
        RS: { name: 'Remote Start', icon: 'signalStream' },
        TGR: { name: 'Tailgate Release', icon: 'truckPickup' },
        GC: { name: 'Gas Cap', icon: 'gasPump' },
        AS: { name: 'Air Suspension', icon: 'truckMonster' }
      };

      return this.design.carKeyDesign.buttons.map(code => buttonInfo[code] || { name: 'Unknown', icon: '' });
    },
    compatibleVehicles() {
      // group make model years by make and model, using year as a range
      return this.design.carKeyDesign.compatibleVehicles.reduce((acc, cv) => {
        const sameModelIdx = acc.findIndex(v => (v.make === cv.make && v.model === cv.model));

        if (sameModelIdx === -1) {
          return [...acc, { ...cv, year: {
            start: cv.year,
            end: cv.year
          } }];
        } else {
          acc.splice(sameModelIdx, 1, {
            ...acc[sameModelIdx],
            year: this.updateYearRange(acc[sameModelIdx].year, cv.year)
          });

          return acc;
        }
      }, []);
    },
    isSmartKey() {
      return this.design?.carKeyDesign?.keyType === 'Smart';
    }
  },
  methods: {
    imageReplaced(imgData) {
      // add image data to sku for upload
      this.$emit('car-key-image-replaced', imgData);
    },
    updateYearRange(existing, newYear) {
      if (newYear < existing.start) {
        return { ...existing, start: newYear };
      } else if (newYear > existing.end) {
        return { ...existing, end: newYear };
      } else {
        return existing;
      }
    }
  }
};
<\/script>
`;export{n as default};
