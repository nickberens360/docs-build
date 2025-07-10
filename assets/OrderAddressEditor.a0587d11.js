const n=`<template>
  <span class="address-update-overlay">
    <VDialog
      v-if="checkUserPermissions('UpdateShippingAddress')"
      v-model="isDialogActive"
      max-width="400"
      persistent
      @update:model-value="initializeFormData()"
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
            Edit address
          </VTooltip>
        </slot>
      </template>
      <template #default>
        <VCard>
          <VCardTitle class="mb-3">Verify Address</VCardTitle>
          <VForm
            v-model="isFormValid"
            class="px-4"
            :disabled="isSubmittingAddress"
          >
            <VTextField
              v-model="formData.addressLine1"
              :rules="rules.addressLine1"
              label="Address Line 1"
              variant="outlined"
              density="compact"
            />
            <VTextField
              v-model="formData.addressLine2"
              :rules="rules.addressLine2"
              label="Address Line 2"
              variant="outlined"
              density="compact"
            />
            <VTextField
              v-model="formData.city"
              :rules="rules.city"
              label="City"
              variant="outlined"
              density="compact"
            />
            <VTextField
              v-model="formData.state"
              :rules="rules.state"
              label="State"
              variant="outlined"
              density="compact"
            />
            <VTextField
              v-model="formData.postalCode"
              :rules="rules.postalCode"
              label="Postal Code"
              variant="outlined"
              density="compact"
            />
            <VTextField
              v-model="formData.county"
              :rules="rules.county"
              label="County"
              variant="outlined"
              density="compact"
            />
            <VTextField
              v-model="formData.country"
              :rules="rules.country"
              label="Country"
              variant="outlined"
              density="compact"
            />
          </VForm>
          <VCardActions class="pt-0 pb-4">
            <div class="w-100 px-2 d-flex justify-space-between">
              <VBtnSecondary
                :disabled="isSubmittingAddress"
                @click="isDialogActive = false"
              >
                Cancel
              </VBtnSecondary>
              <VBtnPrimary
                :loading="isSubmittingAddress"
                :disabled="!isFormValid"
                @click="submitAddress()"
              >
                Submit
              </VBtnPrimary>
            </div>
          </VCardActions>
        </VCard>
      </template>
    </VDialog>
  </span>
</template>
<script>
import { mapGetters } from 'vuex';
import { required } from '@/utils/validationMethods';

export default {
  data() {
    return {
      formData: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        county: '',
        country: '',
      },
      rules: {
        addressLine1: [required],
        addressLine2: [],
        city: [required],
        state: [required],
        postalCode: [required],
        county: [],
        country: [],
      },
      isFormValid: false,
      isDialogActive: false,
      isSubmittingAddress: false,
    };
  },
  computed: {
    ...mapGetters('order', [
      'orderDetails'
    ]),
    ...mapGetters('user', ['checkUserPermissions']),
  },
  methods: {
    initializeFormData() {
      this.formData.addressLine1 = this.orderDetails?.shippingAddress?.street || '';
      this.formData.addressLine2 = this.orderDetails?.shippingAddress?.street2 || '';
      this.formData.city = this.orderDetails?.shippingAddress?.city || '';
      this.formData.state = this.orderDetails?.shippingAddress?.state || '';
      this.formData.postalCode = this.orderDetails?.shippingAddress?.zip || '';
      this.formData.county = this.orderDetails?.shippingAddress?.county || '';
      this.formData.country = this.orderDetails?.shippingAddress?.country || '';
    },
    async submitAddress() {
      this.isSubmittingAddress = true;
      try {
        await this.$store.dispatch('order/updateAddress', this.formData);
        this.closeEditor();
        this.$store.dispatch('app/setSnackbar', {
          message: 'Address verified',
        });
      } catch (error) {
        this.$store.dispatch('app/setSnackbar', {
          message: error?.response?.data || 'Failed to update order address',
          color: 'error',
        });
      }
      this.isSubmittingAddress = false;
    },
    closeEditor() {
      this.isDialogActive = false;
    },
  }
};
<\/script>
<style lang="scss" scoped>
</style>
`;export{n as default};
