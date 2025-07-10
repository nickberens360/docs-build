const n=`<template>
  <VCard
    class="v-card--reveal h-100"
    elevation="0"
    color="transparent"
  >
    <VCardText class="pb-0">
      <VRow justify="start">
        <VCol>
          <CardItem
            title="Date"
          >
            <template #itemContent>
              <span class="card-item-text">{{ refundDate }}</span>
            </template>
          </CardItem>
        </VCol>
        <VCol>
          <CardItem
            title="Issued By"
          >
            <template #itemContent>
              <span class="card-item-text">{{ issuedBy }}</span>
            </template>
          </CardItem>
        </VCol>
        <VCol>
          <CardItem
            title="Quantity"
          >
            <template #itemContent>
              <span class="card-item-text">{{ quantity }}</span>
            </template>
          </CardItem>
        </VCol>
        <VCol>
          <CardItem
            title="Tax"
          >
            <template #itemContent>
              <span class="card-item-text">{{ $filters.currency(taxTotal) }}</span>
            </template>
          </CardItem>
        </VCol>

        <VCol>
          <CardItem
            title="Total"
          >
            <template #itemContent>
              <span class="card-item-text">{{ $filters.currency(total) }}</span>
            </template>
          </CardItem>
        </VCol>
        <VCol>
          <CardItem
            title="Refunded To"
          >
            <template #itemContent>
              <PaymentType
                :card-number="customerCreditCard.pan"
                :card-type="customerCreditCard.issuer"
                payment-type="card"
              />
            </template>
          </CardItem>
        </VCol>
      </VRow>
      <VRow
        justify="start"
        no-gutters
        class="mt-4"
      >
        <VCol
          v-if="reason"
          cols="3"
          class="flex-grow-0"
        >
          <CardItem
            title="Reason"
          >
            <template #itemContent>
              <span class="card-item-text">{{ reason }}</span>
            </template>
          </CardItem>
        </VCol>
        <VCol v-if="notes">
          <CardItem
            title="Notes"
          >
            <template #itemContent>
              <span class="card-item-text">{{ notes }}</span>
            </template>
          </CardItem>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script>
import { format, parseISO } from 'date-fns';
import { mapGetters } from 'vuex';
import CardItem from '@/components/base/Card/CardItem.vue';
import PaymentType from '@/components/order/PaymentType.vue';

export default {
  components: {
    CardItem,
    PaymentType,
  },
  props: {
    date: {
      type: String,
      default: 'Data not available',
    },
    issuedBy: {
      type: String,
      default: 'Data not available',
    },
    quantity: {
      type: Number,
      default: null,
    },
    tax: {
      type: Number,
      default: null,
    },
    total: {
      type: Number,
      default: null,
    },
    refundTo: {
      type: String,
      default: 'Data not available',
    },
    reason: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  computed: {
    refundDate() {
      const date = parseISO(this.date);

      return format(date, 'MM/dd/yyyy');
    },
    ...mapGetters({
      customerCreditCard: 'order/getCustomerCreditCard',
    }),
    taxTotal() {
      return Math.round(this.tax * this.quantity * 100) / 100;
    }
  },
};
<\/script>

<style lang="scss" scoped>
  .card-item-text {
    color: rgb(var(--v-theme-on-surface-high-contrast-text));
    font-size: 16px;
  }
</style>
`;export{n as default};
