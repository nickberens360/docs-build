const n=`<template>
  <VCard
    flat
    class="details-list-item p-0 rounded-0"
    :color="refunded ? '#FEE6E5' : ''"
    :class="{ 'is-checked': isItemChecked, 'is-refunded': refunded }"
    :ripple="false"
  >
    <VCardText class="on-surface-high-contrast-text px-4">
      <VRow
        justify="space-between"
        align="center"
      >
        <VCol
          v-if="item.type !== 'DN'"
          cols="2"
          class="d-flex flex-column align-center justify-center text-primary-lighten-1"
        >
          <ProductImage
            :sku="item.sku"
            :product-type="item.type"
            width="65px"
          />
          <p class="mb-0 mt-3 text-primary-lighten-1">
            {{ item.sku }}
          </p>
        </VCol>
        <VCol
          v-if="item.type === 'DN'"
          cols="2"
        />
        <VCol class="text-left on-surface-high-contrast-text">
          {{ item.description }}
        </VCol>

        <VCol v-if="showFrontBackText">
          <VRow
            no-gutters
            class="mb-1"
          >
            <VCol
              cols="1"
              class="d-flex justify-center align-center"
            >
              <VIcon
                class="mt-1"
                color="primary-lighten-2"
                size="20"
              >
                $bringForward
              </VIcon>
            </VCol>
            <VCol
              cols="11"
              class="d-flex align-center"
            >
              <ul
                v-if="itemCustomizationText.front"
                class="list-reset ml-4 on-surface-high-contrast-text"
              >
                <li
                  v-for="(line, index) in itemCustomizationText.front"
                  :key="index"
                >
                  {{ line }}
                </li>
              </ul>
              <span
                v-else
                class="ml-4 text-primary-lighten-1"
              >
                No Front Text
              </span>
            </VCol>
          </VRow>
          <VRow no-gutters>
            <VCol
              cols="1"
              class="d-flex justify-center align-center"
            >
              <VIcon
                class="mt-1"
                color="primary-lighten-2"
                size="20"
              >
                $sendBackward
              </VIcon>
            </VCol>
            <VCol
              cols="11"
              class="d-flex align-center"
            >
              <ul
                v-if="itemCustomizationText.back"
                class="list-reset ml-4 on-surface-high-contrast-text"
              >
                <li
                  v-for="(line, index) in itemCustomizationText.back"
                  :key="index"
                >
                  {{ line }}
                </li>
              </ul>
              <span
                v-else
                class="ml-4 text-primary-lighten-1"
              >
                No Back Text
              </span>
            </VCol>
          </VRow>
        </VCol>

        <VCol
          v-if="isOmniProduct"
          cols="3"
          class="d-flex align-center"
        >
          <VSheet
            :color="omniItemTextColor"
            class="color-preview-square"
          />
          <VCol class="on-surface-high-contrast-text">
            {{ item.customization.frontSideText }}
          </VCol>
        </VCol>

        <VCol
          cols="3"
          class="d-flex justify-space-between"
          :class="refunded ? 'text-error font-weight-bold' : 'on-surface-high-contrast-text'"
        >
          <VMenu
            v-if="item.discounts.length"
            open-on-hover
            location="top"
          >
            <template #activator="{ props }">
              <VIcon
                v-bind="props"
                class="icon-duotone-coupon ml-7"
              >
                $duoCoupon
              </VIcon>
            </template>
            <VCard class="pb-2">
              <VCardTitle class="on-surface-high-contrast-text pb-2">
                {{ item.discounts.length > 1 ? 'Discount Codes' : 'Discount Code' }}
              </VCardTitle>
              <VDivider class="mx-4 pb-2" />
              <VCardText
                v-for="(discountCode, i) in item.discounts"
                :key="i + discountCode"
                class="py-1"
              >
                <span class="text-primary-lighten-1">
                  {{ discountCode }}
                </span>
              </VCardText>
            </VCard>
          </VMenu>
          <VSpacer v-else />

          <div class="flex-grow-0 pr-4 text-no-wrap">
            <span
              v-if="item.quantity > 1"
              class="mr-4"
            >
              <VChip
                color="primary"
                size="small"
              >
                {{ item.quantity }}
              </VChip>
            </span>
            <span
              v-if="item.quantity > 1"
              class="mr-4 text-caption"
            >{{ $filters.currency(item.total) }} <span>/ea</span></span>
            <span>{{ $filters.currency(item.total*item.quantity) }}</span>
          </div>
        </VCol>

        <VCol
          v-if="!isRefundable"
          class="flex-grow-0"
        >
          <VIcon
            size="40"
            color="error"
            class="ml-15"
            style="cursor: not-allowed"
          >
            $checkSquare
          </VIcon>
        </VCol>

        <VCol
          v-else
          class="flex-grow-0"
        >
          <div
            class="d-flex align-center on-surface-low-contrast-text text-caption-2"
          >
            Refund
            <VIcon
              size="40"
              color="primary-lighten-2"
              class="ml-5"
              @click="toggleSelectedItem(item)"
            >
              {{ isItemChecked ? '$checkSquare' : '$checkboxOff' }}
            </VIcon>
          </div>
        </VCol>
      </VRow>
    </VCardText>
    <VCardActions
      v-if="refunded"
      class="justify-end"
    >
      <VBtn
        class="expand-trigger rounded-0 rounded-ts-lg text-capitalize font-weight-regular letter-spacing-0 bg-error"
        elevation="0"
        shaped
        @click.stop="itemDetailsVisible = !itemDetailsVisible"
      >
        {{ (refundedQuantity === item.quantity) ? 'Refunded' : 'Partial Refund' }}
        <VIcon
          class="ml-1"
          size="17"
        >
          {{ itemDetailsVisible ? "$caretUp" : "$caretDown" }}
        </VIcon>
      </VBtn>
    </VCardActions>
    <VExpandTransition>
      <div v-if="itemDetailsVisible">
        <ItemRefundDetails
          v-for="(refund, index) in item.refunds"
          :key="index"
          :date="refund.timestamp"
          :issued-by="refund.username"
          :quantity="refund.quantity"
          :tax="item.tax"
          :total="refund.amount"
          :reason="refund.reason"
          :notes="refund.notes"
          class="pb-8"
        />
      </div>
    </VExpandTransition>
  </VCard>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import ItemRefundDetails from '@/components/order/ItemRefundDetails.vue';
import {
  getIsOmniProductType,
  getOmniCustomizationTextColor
} from '@/utils/orderHelpers';
import ProductImage from '@/components/base/ProductImage.vue';

export default {
  components: {
    ProductImage,
    ItemRefundDetails
  },
  props: {
    item: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      itemDetailsVisible: false
    };
  },
  computed: {
    ...mapGetters({
      environment: 'app/getEnvConfigs',
      selectedItems: 'order/selectedItems',
      isOrderEligibleForRefund: 'order/isOrderEligibleForRefund',
    }),
    isItemChecked() {
      return this.selectedItems.includes(this.item);
    },
    itemCustomizationText() {
      return {
        front: this.item.customization?.frontSideText?.split('\\n'),
        back: this.item.customization?.backSideText?.split('\\n')
      };
    },
    isOmniProduct() {
      return getIsOmniProductType(this.item.type);
    },
    omniItemTextColor() {
      // TODO: https://minutekey.atlassian.net/browse/LIN-89 Need to update return to include hex values like how kiosk handles coloring
      return getOmniCustomizationTextColor(this.item.customization.textColor);
    },
    refundedQuantity() {
      return this.item.refunds.reduce((acc, refund) => acc + refund.quantity, 0);
    },
    isRefundable() {
      return this.isOrderEligibleForRefund && this.item.quantity > this.refundedQuantity;
    },
    refunded() {
      return this.item.refunds.length;
    },
    showFrontBackText() {
      return this.item.type !== 'DN' && this.item.type !== 'KE' && !this.isOmniProduct;
    }
  },
  methods: {
    ...mapMutations({
      toggleSelectedItem: 'order/toggleSelectedItem'
    }),
  }
};
<\/script>

<style scoped lang="scss">
.details-list-item.v-card {
  border-bottom: 1px solid rgb(var(--v-theme-primary-lighten-5)) !important;
  background-color: rgb(var(--v-theme-surface));
  transition: background-color 0.25s;

  &:hover {
    background-color: rgb(var(--v-theme-surface-light)) !important;
  }

  &:focus {
    background: none !important;
  }

  &:before {
    background: none !important;
  }

  &.is-checked {
    background-color: rgba(var(--v-theme-surface-variant), .6) !important;

    &:hover {
      background-color: rgba(var(--v-theme-surface-variant), .6) !important;
    }
  }

  &.is-refunded {
    &:hover {
      background-color: #fee6e5 !important;
    }
  }
}

.color-preview-square {
  border: 2px solid rgb(var(--v-theme-primary-lighten-1)) !important;
  border-radius: 3px;
  height: 26px;
  width: 26px;
}

.expand-trigger {
  position: absolute;
  z-index: 1;
  bottom: 0;
  right: 0;
  height: 25px;
}

:deep(.v-select) {
  .v-input__control {
    max-width: 75px !important;
    width: 75px !important;
  }
}
</style>
`;export{n as default};
