const e=`<template>
  <div class="sku-resolution-editor">
    <VDialog
      v-if="checkUserPermissions('ResolveSku')"
      v-model="isDialogActive"
      max-width="400"
      persistent
    >
      <template #activator="{ props }">
        <slot
          name="activator"
          :props="props"
        >
          <VTooltip>
            <template #activator="{ props: tooltipProps }">
              <span v-bind="tooltipProps">
                <VIcon
                  icon="$edit"
                  size="16"
                  color="primary"
                  v-bind="props"
                />
              </span>
            </template>
            Resolve SKU
          </VTooltip>
        </slot>
      </template>
      <template #default>
        <VCard>
          <VCardTitle class="mb-3">
            <div class="d-flex justify-space-between align-center">
              Resolve SKU
              <div class="text-right">
                <a
                  href="https://mykeycounter.com"
                  target="_blank"
                  class="text-meru-anchor-link text-caption d-block"
                >My Key Counter</a>
                <a
                  v-if="myKeyCounterSelectedUrl"
                  :href="myKeyCounterSelectedUrl"
                  target="_blank"
                  class="text-meru-anchor-link text-caption d-block"
                >My Key Counter Selection Details</a>
              </div>
            </div>
          </VCardTitle>
          <VForm
            ref="skuForm"
            v-model="valid"
            class="px-4"
            :disabled="isSubmittingSku"
          >
            <VCombobox
              v-model="selectedSku"
              :label="possibleSkuItems.length ? 'Select or Enter SKU' : 'Enter a SKU'"
              :items="possibleSkuItems"
              item-title="hillmanSku"
              return-object
              auto-select-first="exact"
              :rules="[required]"
              variant="outlined"
              clearable
              :loading="isSubmittingSku || isFetchingPossibleSkus"
              @update:model-value="icCardNumber = undefined"
            />
            <VSelect
              v-if="icCardItems.length"
              v-model="icCardNumber"
              label="IC Card Number"
              :items="icCardItems"
              item-title="cardNumber"
              item-value="cardNumber"
              hint="Optional"
              persistent-hint
              variant="outlined"
              clearable
              class="mb-3"
            />
            <VTextarea
              v-model="notes"
              label="Notes"
              hint="Optional"
              persistent-hint
              variant="outlined"
            />
          </VForm>
          <VCardActions class="py-4">
            <div class="w-100 px-2 d-flex justify-space-between">
              <VBtnSecondary
                :loading="isSubmittingSku"
                @click="closeDialog()"
              >
                Cancel
              </VBtnSecondary>
              <VBtnPrimary
                :disabled="!valid"
                :loading="isSubmittingSku || isFetchingPossibleSkus"
                @click="handleResolveSku()"
              >
                Submit
              </VBtnPrimary>
            </div>
          </VCardActions>
        </VCard>
      </template>
    </VDialog>
  </div>
</template>
<script>
import { getCarKeySkus } from '@/utils/orderHelpers';
import { mapActions, mapGetters } from 'vuex';
import {required} from '@/utils/validationMethods';

export default {
  props: {
    skuType: {
      type: String,
      required: false,
      default: 'car-key',
      validator: (value) => ['car-key', 'remote'].includes(value),
    },
  },
  emits: ['sku-resolved'],
  data() {
    return {
      selectedSku: null,
      notes: undefined,
      valid: false,
      possibleSkuItems: [],
      isDialogActive: false,
      isFetchingPossibleSkus: false,
      isSubmittingSku: false,
      icCardNumber: undefined,
    };
  },
  computed: {
    ...mapGetters('user', ['checkUserPermissions']),
    ...mapGetters('order', ['orderDetails']),

    existingRemoteSku() {
      return getCarKeySkus(this.orderDetails.items?.[0]).remote;
    },
    existingCarKeySku() {
      return getCarKeySkus(this.orderDetails.items?.[0]).key;
    },
    existingSku() {
      if (this.skuType === 'remote') {
        return this.existingRemoteSku;
      }
      return this.existingCarKeySku;
    },
    myKeyCounterSelectedUrl() {
      return this.selectedSku?.mkcUrl;
    },
    icCardItems() {
      return this.selectedSku?.keyInfo?.blade?.cards || [];
    },
    formData() {
      return {
        hillmanSku: this.selectedSku?.hillmanSku || this.selectedSku,
        existingSku: this.existingSku,
        icCard: this.icCardNumber,
        notes: this.notes,
      };
    },
  },
  watch: {
    isDialogActive(isActive) {
      if (isActive) {
        this.fetchPossibleSkus();
      }
    },
  },
  methods: {
    ...mapActions('order', ['resolveSku']),
    required,
    async handleResolveSku() {
      this.isSubmittingSku = true;
      try {
        await this.resolveSku(this.formData);
        this.$emit('sku-resolved', true);
        this.$store.dispatch('app/setSnackbar', {
          message: 'SKU: ' + this.formData.hillmanSku + ' resolved',
        });
        this.closeDialog();
      } catch (error) {
        console.error(error);
        this.$store.dispatch('app/setSnackbar', {
          message: error?.response?.data || 'Could not resolve SKU',
          color: 'error',
        });
      }
      this.isSubmittingSku = false;
    },
    async fetchPossibleSkus() {
      this.isFetchingPossibleSkus = true;
      try {
        let possibleSkus = await this.$store.dispatch('order/fetchPossibleSkus');
        let skuType = this.skuType === 'remote' ? 'remotes' : 'keys';
        if (possibleSkus[skuType].length) {
          this.possibleSkuItems = possibleSkus[skuType];
        }
      } catch (error) {
        console.error(error);
        this.$store.dispatch('app/setSnackbar', {
          message: error?.response?.data || 'Could not fetch possible SKUs',
          color: 'error',
        });
      }
      this.isFetchingPossibleSkus = false;
    },
    resetForm() {
      if (this.$refs.skuForm) {
        this.$refs.skuForm.reset();
      }
    },
    closeDialog() {
      this.isDialogActive = false;
      this.resetForm();
    },
  }
};
<\/script>
<style lang="scss" scoped>

</style>
`;export{e as default};
