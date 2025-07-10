const n=`<template>
  <div style="position: relative">
    <VTabs
      v-model="tabIdx"
      show-arrows
      :mobile-breakpoint="1"
    >
      <VTab>Active SKUs</VTab>
      <VTab>Deprecated SKUs</VTab>
    </VTabs>

    <div
      v-if="tabIdx === 0"
      class="d-flex justify-end"
    >
      <VBtn
        color="primary"
        @click="showDialog = true"
      >
        Add Sku
      </VBtn>
    </div>

    <MeruDataTable
      :no-data-text="\`No \${['Active', 'Deprecated'][tabIdx]} SKUs\`"
      :loading="loading"
      disable-pagination
      hide-default-footer
      disable-sort
      :headers="[
        {
          title: 'SKU',
          key: 'sku',
          minWidth: 200
        },
        {
          title: 'Std Cost',
          key: 'standardCost',
          width: 150
        },
        {
          title: 'BC',
          key: 'bc',
        },
        {
          title: 'Primary',
          key: 'primary',
          width: 50
        },
        {
          title: 'Secondary',
          key: 'secondary',
          width: 50
        },
        {
          title: 'Image',
          key: 'image',
        },
        {
          title: 'Keyway',
          key: 'keyway',
        },
        {
          title: 'Compatible Machines',
          key: 'compatibleMachines',
          minWidth: 150
        },
        {
          title: 'Actions',
          key: 'actions',
        }
      ]"
      :items="[activeSkus, deprecatedSkus][tabIdx]"
    >
      <template #[\`column.bc\`]="{column}">
        <VTooltip location="top">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ column.title }}<VIcon
                size="small"
                class="ml-1 text-primary-lighten-3"
                style="position: relative; bottom: 1px"
              >$questionCircle</VIcon>
            </span>
          </template>
          <span>Barcode: inferred from sku</span>
        </VTooltip>
      </template>

      <template #[\`column.keyway\`]="{column}">
        <VTooltip location="top">
          <template #activator="{ props }">
            <span v-bind="props">
              {{ column.title }}<VIcon
                size="small"
                class="ml-1 text-primary-lighten-3"
                style="position: relative; bottom: 1px"
              >$questionCircle</VIcon>
            </span>
          </template>
          <span>Keyway: inferred from sku</span>
        </VTooltip>
      </template>

      <template #[\`item.standardCost\`]="{item}">
        <CurrencyInput
          v-model.lazy="item.standardCost"
          :options="{ allowNegative: false, precision: 4 }"
          placeholder="none"
          @focus="selectAll"
        />
      </template>

      <template #[\`item.bc\`]="{item}">
        <VIcon
          v-if="isBarcode(item.sku)"
          style="vertical-align: bottom"
        >
          $vuetify.icons.barcode
        </VIcon>
        <span v-else>N/A</span>
      </template>

      <template #[\`item.primary\`]="{item}">
        <VTextField
          v-model="item.primaryQty"
          :rules="[required, positiveInteger]"
        />
      </template>

      <template #[\`item.secondary\`]="{item}">
        <VTextField
          v-model="item.secondaryQty"
          :rules="[positiveInteger]"
        />
      </template>

      <template #[\`item.image\`]="{item}">
        <ProductImage
          :src="item.imgData && item.imgData.previewURL || (environment.skuImageBaseUrl + (item.imgData ? 'tmp/' : '') + item.sku + '?' + item.imageHash)"
          :product-type="item.productClass"
          width="190px"
          height="80px"
          class="my-2"
        />
      </template>

      <template #[\`item.keyway\`]="{item}">
        <span :class="!getKeyway(item.sku) ? 'text-error font-weight-bold' : ''">{{ getKeyway(item.sku) || "Unknown" }}</span>
      </template>

      <template #[\`item.compatibleMachines\`]="{item}">
        <VSelect
          v-model="item.compatibleMachines"
          class="my-2"
          variant="outlined"
          multiple
          hide-details
          :items="machineTypes"
          :item-title="mt => mt.desc"
          :item-value="mt => mt.code"
        >
          <template #selection="{ index }">
            <span v-if="index === 0">
              <VChip
                v-for="(compatibleMachineItem, i) in [...item.compatibleMachines].sort()"
                :key="i"
              >{{ compatibleMachineItem }}</VChip>
            </span>
          </template>
        </VSelect>
      </template>

      <template #[\`item.actions\`]="{item}">
        <div class="d-flex align-center justify-space-between">
          <VTooltip location="bottom">
            <template #activator="{ props }">
              <VBtn
                icon
                @click="replaceImageInline(item.sku)"
              >
                <VIcon
                  v-bind="props"
                >
                  $image
                </VIcon>
              </VBtn>
            </template>
            <span>Replace Image</span>
          </VTooltip>
          <VTooltip
            v-if="item.imgData && item.skuId !== undefined"
            location="bottom"
          >
            <template #activator="{ props }">
              <VBtn
                icon
                @click="resetSkuImage(item.sku)"
              >
                <VIcon
                  v-bind="props"
                >
                  $undo
                </VIcon>
              </VBtn>
            </template>
            <span>Reset Sku</span>
          </VTooltip>
          <VTooltip
            v-if="item.skuId === undefined"
            location="bottom"
          >
            <template #activator="{ props }">
              <VBtn
                v-bind="props"
                icon
                @click="deleteSku(item)"
              >
                <VIcon>$trash</VIcon>
              </VBtn>
            </template>
            <span>Delete Sku</span>
          </VTooltip>
          <VBtn
            v-if="item.skuId !== undefined"
            variant="outlined"
            @click="$emit('toggle-deprecation-status', item)"
          >
            {{ item.deprecated ? 'Restore' : 'Deprecate' }}
          </VBtn>
        </div>
      </template>

      <template #footer>
        <div
          v-if="hasBeenValidated && !design.skus.length"
          class="text-center text-caption text-error"
        >
          must be at least one SKU
        </div>
      </template>
    </MeruDataTable>

    <!-- Add a SKU -->
    <VDialog v-model="showDialog">
      <VCard
        flat
        rounded="0"
        color="surface-light"
      >
        <VCardTitle>Add a Sku</VCardTitle>
        <VCardText>
          <VCard
            flat
            color="surface"
          >
            <VContainer>
              <VRow class="align-stretch">
                <VCol
                  cols="12"
                  sm="6"
                >
                  <VForm
                    ref="form"
                    v-model="formIsValid"
                  >
                    <VRow>
                      <VCol cols="12">
                        <VTextField
                          v-model="newSku.sku"
                          class="text-uppercase"
                          autofocus
                          label="New SKU"
                          :rules="[required, ...skuValidationRules]"
                          :error-messages="skuValidationErrors"
                          :counter="15"
                          @update:model-value="validateSkuUnique"
                        />
                      </VCol>
                      <VCol cols="6">
                        <VTextField
                          v-model.number="newSku.primaryQty"
                          type="number"
                          label="Primary Qty"
                          :rules="[required, positiveInteger]"
                        />
                      </VCol>
                      <VCol cols="6">
                        <VTextField
                          v-model.number="newSku.secondaryQty"
                          type="number"
                          label="Secondary Qty"
                          :rules="[positiveInteger]"
                        />
                      </VCol>
                      <VCol cols="6">
                        <VSelect
                          v-model="newSku.compatibleMachines"
                          multiple
                          hide-details
                          label="Compatible Machines"
                          :items="machineTypes"
                          :item-title="mt => mt.desc"
                          :item-value="mt => mt.code"
                        >
                          <template #selection="{ index }">
                            <span v-if="index === 0">
                              <VChip
                                v-for="item in [...newSku.compatibleMachines].sort()"
                                :key="item"
                              >{{ item }}</VChip>
                            </span>
                          </template>
                        </VSelect>
                      </VCol>
                      <VCol cols="6">
                        <CurrencyInput
                          v-model.lazy="newSku.standardCost"
                          :options="{ allowNegative: false, precision: 4 }"
                          label="Standard Cost"
                          placeholder="none"
                          hide-details
                          @focus="selectAll"
                        />
                      </VCol>
                    </VRow>
                  </VForm>
                </VCol>

                <VCol
                  cols="12"
                  sm="6"
                >
                  <ImageUploader
                    ref="uploader"
                    :rules="[required]"
                    accept="image/jpeg,image/png"
                    height="150"
                    width="380"
                    @new-image="newSku.imgData = $event"
                  />
                </VCol>
              </VRow>
            </VContainer>
          </VCard>
        </VCardText>
        <VCardActions class="pb-4 pt-0 px-4">
          <VBtnSecondary @click="cancelAddSku">
            Cancel
          </VBtnSecondary>
          <VSpacer />
          <VBtnPrimary
            :disabled="!formIsValid"
            class="ml-2"
            light
            @click="addSku"
          >
            Add
          </VBtnPrimary>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- File Input (Invisible) -->
    <input
      v-show="false"
      ref="upload"
      accept="image/jpeg,image/png"
      type="file"
      @change="onNewImage($event.target.files[0])"
    >
  </div>
</template>

<script>
import MeruDataTable from '@/components/core/MeruDataTable.vue';
import { mapGetters } from 'vuex';
import inventoryAPIService from '@/services/inventoryAPIService';
import ImageUploader from '@/components/base/ImageUploader.vue';
import CurrencyInput from '@/components/base/CurrencyInput.vue';
import { required, skuValidationRules } from '@/utils/validationMethods';
import { keywayCodeToKeyway } from '@/utils/keyway';
import ProductImage from '@/components/base/ProductImage.vue';

export default {
  components: {
    MeruDataTable,
    ProductImage,
    ImageUploader,
    CurrencyInput,
  },
  props: {
    loading: Boolean,
    design: {
      type: Object,
      default: () => ({})
    },
    machineTypes: {
      type: Array,
      default: () => []
    }
  },
  emits: ['reset-sku-image', 'new-image', 'add-sku', 'delete-sku', 'toggle-deprecation-status'],
  data: () => ({
    lazyKeyImage: new URL('@/assets/images/keys/KE-no-image.png', import.meta.url).href,
    showDialog: false,
    tabIdx: undefined,
    formIsValid: undefined,
    replaceImageSku: null,
    newSku: {
      sku: '',
      primaryQty: '',
      secondaryQty: '',
      imgData: '',
      compatibleMachines: [],
      standardCost: null
    },
    skuValidationErrors: [],
    hasBeenValidated: false,
    test: undefined
  }),
  computed: {
    ...mapGetters({
      environment: 'app/getEnvConfigs',
    }),
    activeSkus() {
      return this.design.skus && this.design.skus.filter(_ => !_.deprecated) || [];
    },
    deprecatedSkus() {
      return this.design.skus && this.design.skus.filter(_ => _.deprecated) || [];
    },
    skuValidationRules() {
      return skuValidationRules(this.design.designCode);
    },
  },
  watch: {
    showDialog(show) {
      if (show && this.design.skus.length) {
        this.newSku.compatibleMachines = this.design.skus[this.design.skus.length - 1].compatibleMachines;
      }
    },
  },
  methods: {
    required,
    selectAll(e, select = true) {
      if (select) {
        e.target.select();
      }
    },
    validate() {
      this.hasBeenValidated = true;

      return this.design.skus.length > 0;
    },
    isBarcode(sku) {
      return sku.substr(3, 2) === 'BC';
    },
    getKeyway(sku) {
      return keywayCodeToKeyway[sku.substr(1,2)];
    },
    resetSkuImage(sku) {
      this.$emit('reset-sku-image', sku);
    },
    replaceImageInline(sku) {
      this.replaceImageSku = sku;
      this.$refs.upload.click();
    },
    onNewImage(file) {
      this.$emit('new-image', { file, sku: this.replaceImageSku });
      this.replaceImageSku = null;
    },
    cancelAddSku() {
      this.showDialog = false;
      this.$refs.form.reset();
      this.$refs.uploader.reset();
    },
    async addSku(e) {
      e.target.blur();
      const isValidImage = await this.$refs.uploader.validate();

      if (!(this.formIsValid && isValidImage)) {
        return;
      }

      this.showDialog = false;

      const { compatibleMachines, standardCost } = this.newSku;
      const newSku = {
        sku: this.newSku.sku.toUpperCase(),
        compatibleMachines,
        standardCost,
        imgData: this.newSku.imgData,
        designId: this.design.id,
        primaryQty: this.newSku.primaryQty,
        secondaryQty: this.newSku.secondaryQty
      };

      this.$emit('add-sku', newSku);
      this.$refs.form.reset();
      this.$refs.uploader.reset();
      // focus active sku tab
      this.tabIdx = 0;
    },
    deleteSku(item) {
      this.$emit('delete-sku', item);
    },
    positiveInteger(value) {
      return !value || /^\\d+$/.test(value) || 'must be a positive integer';
    },
    validateSkuUnique(sku) {
      if (sku && sku.length === 15) {
        inventoryAPIService.checkSkuExistence(this.newSku.sku)
          .then(({ data }) => {
            this.skuValidationErrors = data.exists ? ['sku already exists'] : [];
          });
      } else {
        this.skuValidationErrors = [];
      }
    }
  },
};
<\/script>
`;export{n as default};
