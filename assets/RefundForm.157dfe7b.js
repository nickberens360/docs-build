const n=`<template>
  <VCard
    color="surface-light"
    class="rounded-0 elevation-0 allow-card-overflow d-flex flex-column"
  >
    <VCardTitle class="detail-form-header bg-primary mb-0 elevation-3">
      Refund
    </VCardTitle>
    <VForm
      v-if="isFormShown"
      v-model="isRefundFormValid"
      class="d-flex flex-column flex-grow-1 justify-space-between"
    >
      <VRadioGroup
        v-if="selectedItems.length > 1"
        v-model="activeReason"
        hide-details
        height="32"
        class="detail-form-radio-group pl-9 pt-4 ma-0"
      >
        <VRadio
          value="sameReason"
          class="mr-8"
          label="Reason is same for all"
        />
        <VRadio
          value="differentReason"
          class="mr-8"
          label="Different reasons"
        />
      </VRadioGroup>
      <VCardText class="px-8 py-6">
        <div
          v-for="(item) in formData.items"
          :key="item.itemId"
        >
          <RefundFormItem
            v-model:quantity="item.quantity"
            v-model:reason="item.reason"
            v-model:notes="item.notes"
            :amount="item.amount"
            :item-id="item.itemId"
            :show-reason="activeReason === 'differentReason'"
            class="mb-4"
          />
        </div>
        <div
          v-if="activeReason === 'sameReason'"
          class="mt-4"
        >
          <VSelect
            v-model="formData.reason"
            :rules="selectRules"
            :items="reasonOptions"
            label="Reason"
            variant="outlined"
            density="compact"
            bg-color="surface"
            color="primary-lighten-2"
          />
          <VTextarea
            v-if="formData.reason === 'Other'"
            v-model="formData.notes"
            :rules="textareaRules"
            autofocus
            bg-color="white"
            rows="3"
          />
        </div>
      </VCardText>
      <VSpacer />
      <VCardActions class="detail-form-footer d-block bg-surface-light elevation-3">
        <VContainer class="d-flex pt-0">
          <VCol
            cols="6"
            class="d-flex flex-column align-start pl-3"
          >
            <VCheckboxBtn
              v-if="isShippingRefundable"
              v-model="includeShipping"
              color="primary"
              density="compact"
              hide-details
              :ripple="false"
              class="ml-n1"
            >
              <template #label>
                <span class="on-surface-high-contrast-text text-subtitle-2">Include Shipping:</span>
                <span
                  v-if="includeShipping"
                  class="ml-2 font-weight-bold"
                >
                  {{ $filters.currency(refundShippingCost) }}
                </span>
              </template>
            </VCheckboxBtn>
            <VSpacer />
            <CardItem
              title="Payment"
              class="pa-0"
            >
              <template #itemContent>
                <PaymentType
                  :card-number="order.payment.card.pan"
                  :card-type="order.payment.card.issuer"
                  :payment-type="order.payment.type"
                />
              </template>
            </CardItem>
          </VCol>
          <VCol
            cols="6"
            class="d-flex flex-column text-no-wrap on-surface-high-contrast-text text-subtitle-2"
          >
            <VRow no-gutters>
              <VCol cols="5">
                Subtotal:
              </VCol>
              <VCol
                cols="5"
                offset="2"
                class="text-right font-weight-bold"
              >
                {{ $filters.currency((refundSubtotal) || 0) }}
              </VCol>
            </VRow>
            <VRow no-gutters>
              <VCol cols="5">
                Taxes:
              </VCol>
              <VCol
                cols="5"
                offset="2"
                class="text-right font-weight-bold"
              >
                {{ $filters.currency(refundTaxTotal) }}
              </VCol>
            </VRow>
            <VRow no-gutters>
              <VCol cols="5">
                Discounts:
              </VCol>
              <VCol
                cols="5"
                offset="2"
                class="text-right font-weight-bold"
                :class="refundDiscountTotal ? 'text-error' : 'on-surface-high-contrast-text'"
              >
                {{ $filters.currency(refundDiscountTotal) }}
              </VCol>
            </VRow>
            <VRow
              no-gutters
              class="mt-2 text-body-2 font-weight-medium"
            >
              <VCol cols="5">
                Total:
              </VCol>
              <VCol
                cols="6"
                offset="1"
                class="text-right font-weight-bold"
              >
                {{ $filters.currency(refundTotal) }}
              </VCol>
            </VRow>
          </VCol>
        </VContainer>
        <div class="px-6">
          <VBtnPrimary
            block
            density="comfortable"
            class="mb-2"
            :disabled="!isRefundFormValid || isFormProcessing"
            size="large"
            @click="triggerConfirmation"
          >
            Submit
          </VBtnPrimary>
        </div>
      </VCardActions>
    </VForm>

    <VExpandTransition>
      <VCardText
        v-if="isConfirmationShown"
        key="confirmation"
        class="rounded-0 h-100 pa-0"
        color="transparent"
      >
        <div
          v-if="isFormProcessing"
          class="d-flex flex-column align-center justify-center position-relative"
        >
          <VProgressLinear class="position-absolute w-100 top-0" />
        </div>
        <VCardText
          class="pt-6 mx-auto"
          :class="{ 'form-is-processing': isFormProcessing }"
          style="max-width: 400px"
        >
          <div class="d-flex flex-column align-center pb-30">
            <SuccessAnimation
              class="w-100"
              :use-success-check-icon="false"
            >
              <template #icon>
                <VIcon
                  size="124"
                  class="icon-duotone-eye"
                >
                  $duoToneEye
                </VIcon>
              </template>
              <template #heading>
                <p class="font-weight-bold mb-6 text-body-3 text-primary">
                  Looking Good?
                </p>
              </template>
              <template #message>
                <div class="mx-auto">
                  <ul class="px-0 mb-4">
                    <li
                      v-for="item in selectedItems"
                      :key="item.itemId"
                      class="d-flex justify-space-between mb-2"
                    >
                      <span>{{ item.description }}</span>
                      <span class="font-weight-bold">{{
                        $filters.currency(item.total)
                      }}</span>
                    </li>
                  </ul>
                  <VDivider class="mb-4" />
                  <div class="text-right">
                    <ul
                      class="pa-0 ma-0"
                      style="list-style: none"
                    >
                      <li v-if="includeShipping">
                        <span class="mr-11">Shipping:</span>
                        <span class="font-weight-bold">{{
                          $filters.currency(refundShippingCost)
                        }}</span>
                      </li>
                      <li>
                        <span class="mr-11">Taxes:</span>
                        <span class="font-weight-bold">{{
                          $filters.currency(refundTaxTotal)
                        }}</span>
                      </li>
                      <li class="mt-2">
                        <span class="mr-4 font-weight-medium text-body-2">Total:</span>
                        <span class="font-weight-bold text-body-2">{{
                          $filters.currency(refundTotal)
                        }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </SuccessAnimation>
          </div>
        </VCardText>
        <div
          class="confirm-footer text-right py-4 px-8 elevation-3 bg-surface-light"
        >
          <VForm
            v-model="isEmailFormValid"
            class="text-left mb-3"
          >
            <label
              for="email"
              class="on-surface-low-contrast-text  text-caption-2 mb-1 d-block"
            >Enter Email Address for Receipt: (optional)
            </label>
            <VTextField
              id="email"
              v-model="formData.email"
              :rules="emailRules"
              variant="solo"
              density="compact"
              class="pt-0"
              hide-details
            />
          </VForm>
          <div>
            <VBtnSecondary
              class="mr-2"
              @click="handleCancelConfirmation"
            >
              Cancel
            </VBtnSecondary>
            <VBtn
              color="primary"
              :disabled="!isEmailFormValid"
              @click="handleRefundConfirm"
            >
              Yes, Refund
            </VBtn>
          </div>
        </div>
      </VCardText>
      <VCardText
        v-else-if="errorMessage || isEportError"
        key="error-message"
        class="rounded-0 fill-height pa-0"
        color="transparent"
      >
        <div class="text-center pt-6">
          <p v-if="!isEportError">
            {{ errorMessage }}
          </p>
          <div v-else>
            <VIcon
              size="134"
              class="mb-8 icon-duotone-eye-warning"
            >
              $duoToneEye
            </VIcon>
            <div class="font-weight-bold mb-6 text-body-3 text-primary">
              <div class="text-warning mb-6">
                Must go to SeedLive to process refund
              </div>
              <div>
                Device Trans Id: {{ order?.payment?.eportTransactionId || "" }}
              </div>
              <div v-show="order?.payment?.serialNumber || false">
                Device Serial Number: {{ order.payment.serialNumber }}
              </div>
            </div>
          </div>
        </div>
      </VCardText>
    </VExpandTransition>
  </VCard>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import CardItem from '@/components/base/Card/CardItem.vue';
import SuccessAnimation from '@/components/base/SuccessAnimation.vue';
import RefundFormItem from '@/components/order/RefundFormItem.vue';
import PaymentType from '@/components/order/PaymentType.vue';
import { refundReasons } from '@/utils/orderHelpers';

export default {
  components: {
    CardItem,
    SuccessAnimation,
    RefundFormItem,
    PaymentType,
  },
  emits: ['refunded'],
  data() {
    return {
      isRefundFormValid: false,
      isEmailFormValid: false,
      selectRules: [v => !!v || 'Reason required'],
      textareaRules: [v => !!v || 'Description required'],
      emailRules: [
        v =>
          !v ||
          /^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) ||
          'Invalid email'
      ],
      activeReason: 'sameReason',
      includeShipping: false,
      isFormShown: true,
      isConfirmationShown: false,
      isSuccessAnimationShown: false,
      isFormProcessing: false,
      reasonOptions: refundReasons,
      errorMessage: null,
      isEportError: null,
      formData: {
        items: [],
        reason: null, // required
        notes: null, // required
        email: null, // if present will send refund receipt
        mailRefund: false, // if true only create refund record, don't submit to payment processor
        zoneOffset: '-06:00' // timezone offset of CS agent - TODO: get from current user
      }
    };
  },
  computed: {
    ...mapGetters({
      order: 'order/orderDetails',
      selectedItems: 'order/selectedItems',
      refundableItems: 'order/getRefundableItems',
      orderShipping: 'order/getOrderShipping',
      isShippingRefundable: 'order/getIsShippingRefundable'
    }),
    refundDiscountTotal() {
      let sum = 0;
      this.formData.items.forEach((item) => {
        const itemDiscount = this.order.items.find(({ itemId }) => itemId === item.itemId)?.discountTotal || 0;
        const quantity = item.quantity || 0;
        sum += (itemDiscount * quantity);
      });
      return Math.round(sum * 100) / 100;
    },
    refundShippingCost() {
      return this.includeShipping ? (this.order.payment.shippingTotal || 0) : 0;
    },
    refundSubtotal() {
      let sum = 0;
      this.formData.items.forEach((item) => {
        const itemPrice = this.order.items.find(({ itemId }) => itemId === item.itemId)?.price || 0;
        const quantity = item.quantity || 0;
        sum += (itemPrice * quantity);
      });
      return Math.round(sum * 100) / 100;
    },
    refundTaxTotal() {
      let sum = 0;
      this.formData.items.forEach((item) => {
        const itemTax = this.order.items.find(({ itemId }) => itemId === item.itemId)?.tax || 0;
        const quantity = item.quantity || 0;
        sum += (itemTax * quantity);
      });
      if (this.includeShipping) {
        sum += (this.order.payment.shippingTotal || 0) * (this.order.payment.shippingTaxRate || 0);
      }
      return Math.round(sum * 100) / 100;
    },
    refundTotal() {
      let discounts = this.order.payment.couponTotal ? this.refundDiscountTotal : 0;
      let total = this.refundTaxTotal + this.refundSubtotal + this.refundShippingCost - discounts;
      return Math.round(total * 100) / 100;
    },
  },
  watch: {
    selectedItems: {
      handler(selectedItems) {
        const updatedFormItems = this.formData.items.filter(({ itemId }) => !!selectedItems.find((item) => item.itemId === itemId));
        selectedItems.forEach((orderItem) => {
          const refundItemIndex = this.formData.items.findIndex(({ itemId }) => itemId === orderItem.itemId);
          if (refundItemIndex < 0) {
            updatedFormItems.push({
              itemId: orderItem.itemId,
              notes: null,
              reason: null,
              quantity: orderItem.quantity,
              amount: orderItem.total
            });
          }
        });
        this.formData.items = updatedFormItems;
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.includeShipping = this.isShippingRefundable;
    this.formData.email = this.order?.customer?.email || null;
  },
  methods: {
    ...mapActions('order', ['submitOrderRefund', 'refreshOrderDetailsAndOrders']),
    ...mapMutations('order', ['setSelectedItems']),
    triggerConfirmation() {
      this.isFormShown = false;
      this.isConfirmationShown = true;
    },
    handleCancelConfirmation() {
      this.isConfirmationShown = false;
      this.isFormShown = true;
    },
    async handleRefundConfirm() {
      if (this.isFormProcessing) {
        return;
      }
      this.isFormProcessing = true;

      if (this.includeShipping) {
        this.formData.items.push({
          itemId: this.orderShipping.itemId,
          amount: this.orderShipping.total,
          reason: 'Shipping Refund'
        });
      }

      try {
        await this.submitOrderRefund({
          sessionId: this.order.session.sessionId,
          formData: this.formData
        });
        this.isSuccessAnimationShown = true;
        this.$emit('refunded', this.refundTotal);
      } catch (error) {
        if (error.response.status === 403) {
          this.errorMessage =
            'Something went wrong, this user is not authorized to perform this action. Please try again, or contact support.';
        } else if (error.response.status === 404) {
          this.errorMessage =
            'Something went wrong, this order was not found. Please try again, or contact support.';
        } else if (error.response.status === 503) {
          // make sure that this is really an eport error
          if (this.order.payment.card.processor === 'Eport') {
            this.isEportError = true;
          } else {
            // This is a real 503
            this.errorMessage = 'Something went wrong. Please try again, or contact support.';
          }
        } else {
          this.errorMessage =
            'Something went wrong. Please try again, or contact support.';
        }
      }
      await this.refreshOrderDetailsAndOrders();
      this.isFormProcessing = false;
      this.isConfirmationShown = false;
    },
  }
};
<\/script>

<style scoped lang="scss">
.detail-form-header {
  position: sticky;
  top: 0;
  z-index: 1;
}

.detail-form-radio-group {
  :deep(.v-label) {
    opacity: unset;
  }
}

.form-is-processing {
  opacity: 0.5;
}

.detail-form-footer,
.confirm-footer {
  position: sticky;
  bottom: 0;
}

</style>
`;export{n as default};
