const n=`<template>
  <VDialog
    fullscreen
    :model-value="dialogOpen"
    @after-leave="$emit('update', false)"
  >
    <VCard
      class="pt-4"
      flat
      rounded="0"
    >
      <!-- Skeleton Loader -->
      <VCardText v-if="loading">
        <VSkeletonLoader
          type="heading, table-heading, card, table"
        />
      </VCardText>

      <!-- Main Page -->
      <VCardText
        v-else-if="!!editableDesign"
        class="pb-16"
      >
        <div
          v-if="!existsInDatabase"
          class="text-center py-4"
        >
          <VForm ref="productClass">
            <VSelect
              v-model="editableDesign.productClass"
              label="Product Class"
              hide-details
              :items="allowedProductClasses"
              item-value="0"
              item-title="1"
              density="compact"
              :rules="[required]"
            />
          </VForm>
        </div>
        <div
          v-else
          class="text-center text-h6 py-4"
        >
          {{ productClasses[editableDesign.productClass] }}
        </div>

        <!-- Header -->
        <DesignHeader
          ref="header"
          v-model:design="editableDesign"
          :is-new="isNew"
          :exists-in-database="existsInDatabase"
          :existing-design-codes="existingDesignCodes"
          :initial-design-code="initialDesign && initialDesign.designCode"
          @update-design-code="editableDesign.designCode = $event"
          @update-blacklisted="editableDesign.carKeyDesign.blacklisted = $event"
          @update-deprecated="deprecateCarKey($event)"
        />

        <!-- Pricing/Design Groups -->
        <VCard
          v-if="!isCarKey"
          class="my-4"
        >
          <VCardText>
            <VRow>
              <!-- Design Group -->
              <VCol
                cols="12"
                sm="6"
              >
                <VSelect
                  v-model="editableDesign.groups"
                  multiple
                  label="Design Group"
                  :items="designGroupOptions"
                  item-title="name"
                  return-object
                  density="compact"
                />
              </VCol>

              <!-- Pricing Group -->
              <VCol
                cols="12"
                sm="6"
              >
                <VForm ref="pricingGroup">
                  <VSelect
                    v-model="editableDesign.pricingGroup"
                    label="Pricing Group"
                    item-title="name"
                    :items="pricingGroupOptions"
                    :rules="[required]"
                    return-object
                    density="compact"
                  />
                </VForm>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Translations -->
        <VExpansionPanels
          v-if="!isCarKey"
          class="my-4"
        >
          <VExpansionPanel>
            <VExpansionPanelTitle expand-icon="$vuetify.icons.chevronDown">
              Translations
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <DesignTranslationsTable
                :design="editableDesign"
                @delete-translation="handleDeleteTranslation"
                @add-translation="handleAddTranslation"
              />
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>

        <!-- Additional Information Specific to Product Class -->
        <VCard class="my-4 pa-4">
          <CarKeyInfo
            v-if="isCarKey"
            :design="editableDesign"
            @car-key-image-replaced="handleCarKeyImageReplaced"
          />
          <KeySkuTable
            v-else-if="editableDesign.productClass === 'KE'"
            ref="skus"
            :design="editableDesign"
            :machine-types="machineTypes"
            @reset-sku-image="handleResetSkuImage"
            @new-image="handleOnNewImage"
            @add-sku="handleAddNewSku"
            @delete-sku="handleDeleteSku"
            @toggle-deprecation-status="toggleHopKeyDeprecationStatus"
          />
          <div
            v-else
            class="py-4 text-center"
          >
            No Additional Info for this Product Class
          </div>
        </VCard>
      </VCardText>

      <!-- Footer -->
      <VFooter>
        <VBtnSecondary @click="$emit('update', false)">
          Cancel
        </VBtnSecondary>
        <VSpacer />
        <VBtnPrimary
          :loading="processing"
          :disabled="!changesMade"
          @click="saveDesign"
        >
          Save
        </VBtnPrimary>
      </VFooter>
    </VCard>
  </VDialog>
</template>

<script>
// will not display these product classes as an option for new designs
const blacklistedProductClasses = ['CK'];

import inventory from '@/services/inventoryAPIService';
import DesignHeader from '@/components/inventory/DesignHeader.vue';
import DesignTranslationsTable from '@/components/inventory/DesignTranslationsTable.vue';
import KeySkuTable from '@/components/inventory/KeySkuTable.vue';
import CarKeyInfo from '@/components/inventory/CarKeyInfo.vue';
import { cloneDeep, isEqual, pickBy, mergeWith, differenceWith, unionWith } from 'lodash-es';
import { required } from '@/utils/validationMethods';

export default {
  components: {
    DesignHeader,
    DesignTranslationsTable,
    KeySkuTable,
    CarKeyInfo,
  },
  props: {
    dialogOpen: Boolean,
    design: {
      type: Object,
      default: () => ({}),
    },
    isNew: Boolean,
    productClasses: {
      type: Object,
      default: () => ({}),
    },
    existingDesignCodes: {
      type: Array,
      default: () => [],
    },
    selectedProductClass: {
      type: Object,
      default: () => ({}),
    }
  },
  emits: ['update'],
  data: () => ({
    inputsAreValid: undefined,
    editableDesign: undefined,
    dbDesign: undefined,
    initialDesign: undefined,
    loading: true,
    processing: false,
    pricingGroupOptions: [],
    designGroupOptions: [],
    machineTypes: [],
    valid: {
      nameAndDesignCode: false,
      pricingGroup: false,
      productClass: false
    }
  }),
  computed: {
    isCarKey() {
      return this.design && this.design.productClass === 'CK';
    },
    changesMade() {
      return !isEqual(this.initialDesign, this.editableDesign);
    },
    isUncommitted() {
      return this.isNew || !this.editableDesign.id || !this.design.skus;
    },
    existsInDatabase() {
      return this.editableDesign.id !== undefined;
    },
    allowedProductClasses() {
      return Object.entries(this.productClasses)
        .filter(([code]) => !blacklistedProductClasses.includes(code));
    },
    productClass() {
      return this.editableDesign && this.editableDesign.productClass;
    },
  },
  watch: {
    productClass() {
      // update pricing group options on product class change
      if (this.productClass && !this.isCarKey && this.editableDesign) {
        inventory.getPricingGroupsByProductClass(this.editableDesign.productClass)
          .then(({ data }) => this.pricingGroupOptions = data);
        inventory.getMachineTypes(this.editableDesign.productClass)
          .then(({ data }) => this.machineTypes = data);
      }
    },
    dialogOpen(isOpen) {
      // Dialog is Closed
      if (!isOpen) {
        this.editableDesign = this.dbDesign = this.initialDesign = undefined;

        return;
      }

      this.processing = false;

      // Design is New
      if (this.isNew) {
        // generate blank Design
        this.editableDesign = {
          designCode: '',
          pricingGroup: null,
          productClass: this.allowedProductClasses.find(([code]) => code === this.selectedProductClass.productClasses[0])[0],
          dateAdded: (new Date).toISOString().substring(0, 10),
          size: null,
          shape: null,
          thickness: null,
          price: null,
          groups: [],
          names: [
            {
              locale: 'en',
              name: '',
            }
          ],
          skus: []
        };

        // nothing else to load
        this.loading = false;

        return;
      }

      this.loading = true;

      if (this.design.id) {
        inventory.getDesign(this.design.id)
          .then(({ data: dbDesign }) => {
            // save a copy of the original design for change comparison
            this.dbDesign = cloneDeep(dbDesign);

            // merge full design with the changes passed in through design prop
            const mergedDesign = this.mergeDesigns(dbDesign, this.design);

            this.editableDesign = {
              ...mergedDesign,
              skus: mergedDesign.skus.map(sku => ({
                ...sku,
                primaryQty: sku.fullBoxIsPrimary ? sku.itemsPerBox : sku.itemsPerHalfBox,
                secondaryQty: sku.fullBoxIsPrimary ? sku.itemsPerHalfBox : sku.itemsPerBox
              }))
            };

            // save a copy of the original design for change comparison
            this.initialDesign = cloneDeep(this.editableDesign);
          })
          .finally(() => this.loading = false);
      } else {
        // make a component-level copy of this design
        const clonedDesign = cloneDeep(this.design);
        this.editableDesign = {
          ...clonedDesign,
          skus: clonedDesign.skus.map(sku => ({
            ...sku,
            primaryQty: sku.fullBoxIsPrimary ? sku.itemsPerBox : sku.itemsPerHalfBox,
            secondaryQty: sku.fullBoxIsPrimary ? sku.itemsPerHalfBox : sku.itemsPerBox
          }))
        };
        this.loading = false;
      }
    }
  },
  created() {
    inventory.getAllDesignGroups().then(({ data }) => this.designGroupOptions = data);
  },
  methods: {
    required,
    generatePatch(newDesign, dbDesign) {
      if (!dbDesign) {
        return newDesign;
      }

      let patch = pickBy(newDesign, (value, key) => ['id', 'designCode'].includes(key) || !isEqual(value, dbDesign[key]));

      if (patch.carKeyDesign) {
        patch.carKeyDesign = {
          blacklisted: patch.carKeyDesign.blacklisted,
          id: patch.carKeyDesign.id
        };
      }
      for (const key of Object.keys(patch)) {
        // generating is seeming more and more like a bad idea, and I think a PUT would be much simpler
        if (Array.isArray(patch[key])) {
          patch[key] = differenceWith(patch[key], dbDesign[key], isEqual);
        }
      }

      return patch;
    },
    saveDesign() {
      const designIsValid = Object.values(this.$refs).reduce(async (acc, cv) => {
        const { valid } = await cv.validate();
        return !cv || (valid && acc);
      }, true);

      if (!designIsValid) {
        return;
      }

      this.editableDesign.designCode = this.editableDesign.designCode.toUpperCase();

      // add name prop for table display/search
      this.editableDesign.name = this.editableDesign.name || this.editableDesign.names.find(n => n.locale === 'en').name;

      // add firstSku property for display in main table
      const firstSku = this.editableDesign.skus[0] || {};

      this.editableDesign.firstSku = (firstSku.imgData !== undefined ? 'tmp/' : '') + firstSku.sku;

      // update deprecated flag for main table
      this.editableDesign.deprecated = this.editableDesign.skus.reduce((acc, sku) => acc && sku.deprecated, true);

      this.editableDesign.skus.forEach((sku) => {
        sku.secondaryQty ||= 0;
        [sku.itemsPerBox, sku.itemsPerHalfBox, sku.fullBoxIsPrimary] = sku.primaryQty >= sku.secondaryQty ?
          [sku.primaryQty, sku.secondaryQty, true] :
          [sku.secondaryQty, sku.primaryQty, false];
        delete sku.primaryQty;
        delete sku.secondaryQty;
      });

      const patch = this.generatePatch(this.editableDesign, this.dbDesign);

      this.$emit('update', patch);

      this.processing = true;
    },
    selectAll(e, select = true) {
      if (select) {
        e.target.select();
      }
    },
    mergeDesigns(initialDesign, designPatchfromDDb) {
      return mergeWith(initialDesign, designPatchfromDDb, (dbDesign, patch, key) => (
        Array.isArray(dbDesign) ? this.designUnion(key, patch, dbDesign) : undefined
      ));
    },
    // performs union operation on array properties of design objects with different identifiers
    designUnion(key, patch, existing) {
      return unionWith(patch, existing, (p, e) => {
        switch (key) {
          case 'names':
            return p.locale === e.locale;
          case 'skus':
            return p.sku === e.sku;
          default:
            return undefined;
        }
      });
    },
    handleResetSkuImage(sku) {
      const existingSkuIdx = this.editableDesign.skus.findIndex(s => s.sku === sku);
      if (existingSkuIdx === -1) {
        return;
      }
      this.editableDesign.skus[existingSkuIdx].imgData = undefined;
    },
    handleOnNewImage($event) {
      const file = $event.file;
      const sku = $event.sku;
      const skuIdx = this.editableDesign.skus.findIndex(s => s.sku === sku);
      const existingSku = this.editableDesign.skus[skuIdx];

      this.editableDesign.skus.splice(skuIdx, 1, {
        ...existingSku,
        imgData: {
          previewURL: URL.createObjectURL(file),
          file
        }
      });
    },
    handleAddNewSku(sku) {
      this.editableDesign.skus.push(sku);
    },
    handleDeleteSku(item) {
      this.editableDesign.skus.splice(this.editableDesign.skus.indexOf(item), 1);
    },
    handleCarKeyImageReplaced(imgData) {
      this.editableDesign.skus.splice(0, 1, {
        ...this.editableDesign.skus[0],
        imgData
      });
    },
    handleDeleteTranslation(item) {
      this.editableDesign.names.splice(this.editableDesign.names.indexOf(item), 1);
    },
    handleAddTranslation($event) {
      this.editableDesign.names.push({ ...$event.newTranslation, designId: $event.designId });
    },
    deprecateCarKey(isDeprecated) {
      if (this.isCarKey && this.editableDesign.skus.length > 0) {
        this.editableDesign.skus[0].deprecated = isDeprecated;
      }
    },
    toggleHopKeyDeprecationStatus(item) {
      const sku = (this.editableDesign.skus || []).find(sku => sku.skuId === item.skuId);
      if (sku) {
        sku.deprecated = !sku.deprecated;
      }
    }
  },
};
<\/script>
`;export{n as default};
