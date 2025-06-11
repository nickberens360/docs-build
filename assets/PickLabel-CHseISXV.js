const n=`<template>
  <VCard
    v-for="(labelItems, labelIndex) in splitLabels"
    :key="labelIndex"
    class="pick-label rounded-0 position-relative pa-2"
    height="6in"
    width="4in"
    elevation="0"
  >
    <VCardText class="pick-label__text">
      <p class="d-flex justify-space-between">
        <span>
          <span class="font-weight-medium mr-2">PICK/PACK List</span>
          <span v-if="splitLabels?.length > 1">{{ getLabelPaginationCount(labelIndex) }}</span>
        </span>
        <span data-test="orderDate"><span class="font-weight-medium">Order Date: </span><span>{{ orderDate }}</span></span>
      </p>
      <VRow
        class="my-1"
        no-gutters
      >
        <VCol
          cols="8"
          offset="2"
        >
          <BarcodeGenerator
            v-if="order?.transactionId"
            :key="labelIndex"
            :barcode-text="order.transactionId"
            height=".4in"
          />
        </VCol>
      </VRow>
      <div
        v-if="vehicleYearMakeModel"
        class="mb-2 d-flex"
      >
        <dl
          class="mr-2"
          data-test="vehicle"
        >
          <dt class="font-weight-bold d-inline-block mr-1">
            Vehicle:
          </dt>
          <dd class="d-inline-block">
            {{ vehicleYearMakeModel }}
          </dd>
        </dl>
      </div>
      <div
        v-if="keyway && isEndlessAisleCategory"
        class="mb-2"
      >
        <dl data-test="keyway">
          <dt class="font-weight-bold d-inline-block mr-2">
            Keyway:
          </dt>
          <dd class="d-inline-block">
            {{ keyway }}
          </dd>
        </dl>
      </div>
      <p class="font-weight-bold">
        Items
      </p>
      <ul
        class="pick-list__items flex-grow-1"
      >
        <template
          v-for="(item, itemIndex) in labelItems"
          :key="itemIndex"
        >
          <li
            class="d-flex justify-space-between"
          >
            <span data-test="itemSku">
              <span class="font-weight-bold">
                SKU {{ labelIndex * itemsPerLabel + itemIndex + 1 }}
              </span>
              {{ item?.hillmanSku || item?.sku }}
            </span>
            <span data-test="itemQuantity">
              <span class="font-weight-bold">QTY:</span> {{ item.quantity }}</span>
          </li>
        </template>
      </ul>
      <div class="pick-label__schedule-date">
        <p v-if="mKATName">
          <span class="font-weight-medium">MKAT:</span> {{ mKATName }}
        </p>
        <p v-if="scheduledDate">
          <span class="font-weight-medium">Scheduled Date:</span> {{ scheduledDate }}
        </p>
      </div>
    </VCardText>
  </VCard>
</template>

<script>
import BarcodeGenerator from '@/components/base/BarcodeGenerator.vue';
import { parseISO, format } from 'date-fns';
import { getSkusToFulfill } from '@/utils/orderHelpers';
export default {
  name: 'PickLabel',
  components: { BarcodeGenerator },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      itemsPerLabel: 20,
    };
  },
  computed: {
    mKATName() {
      return this.order?.scheduledAppointment?.mkat || undefined;
    },
    scheduledDate() {
      return this.order?.scheduledAppointment?.date ? this.formatTimestamp(this.order.scheduledAppointment.date) : undefined;
    },
    orderDate() {
      let timestamp = this.order?.timestamp || this.order?.session?.timestamp;
      return timestamp ? this.formatTimestamp(timestamp) : undefined;
    },
    keyway() {
      const keyway = this.order?.keyway || this.order.items[0]?.keyInfo?.blade?.keyway;
      return keyway || undefined;
    },
    isEndlessAisleCategory() {
      return this.order.items?.some(item => item.category === 'endless-aisle-key') ?? false;
    },
    vehicleYearMakeModel() {
      return this.order?.vehicle ? \`\${this.order.vehicle.year} \${this.order.vehicle.make} \${this.order.vehicle.model}\` : undefined;
    },
    itemsToFulfill() {
      return getSkusToFulfill(this.order);
    },
    splitLabels() {
      return this.itemsToFulfill.reduce((result, item, index) => {
        const chunkIndex = Math.floor(index / this.itemsPerLabel);
        if (!result[chunkIndex]) {
          result[chunkIndex] = [];
        }
        result[chunkIndex].push(item);
        return result;
      }, []) || [];
    },
  },
  methods: {
    formatTimestamp(timestamp) {
      return format(parseISO(timestamp), 'MM/dd/yy');
    },
    getLabelPaginationCount(index) {
      return \`\${index + 1}/\${this.splitLabels.length}\`;
    },
  },
};
<\/script>

<style lang="scss" scoped>
.pick-label {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 13px;
    left: 13px;
    right: 13px;
    bottom: 13px;
    border: 1px solid #000000;
  }
  &__items {
    list-style-type: none;
    padding: 0;
  }
  :deep(.v-card-text) {
    font-size: 13px;
  }
  &__schedule-date {
    position: absolute;
    bottom: 24px;
    right: 24px;
    left: 24px;
    display: flex;
    justify-content: space-between;
  }
}
@media print {
  .pick-label {
    page-break-after: always;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @page {
    size: 4in 6in;
    margin: 0;
  }
}
</style>
`;export{n as default};
