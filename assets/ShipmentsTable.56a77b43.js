const e=`<template>
  <VContainer>
    <MeruDataTable
      v-model:expanded="expandedRows"
      v-model:sort-by="sortBy"
      :search="search"
      :headers="tableHeaders"
      :items="tableItems"
      show-expand
      item-value="pickNumber"
      hover
      :loading="isLoadingShipments"
      loading-text="Loading... Please wait"
      sort-asc-icon="$vuetify.icons.arrowUp"
      sort-desc-icon="$vuetify.icons.arrowDown"
      @update:expanded="toggleShipmentDetails"
    >
      <template #expanded-row="{ columns }">
        <tr class="bg-primary-lighten-4">
          <td
            :colspan="columns.length"
            class="pa-1"
          >
            <div>
              <MeruDataTable
                :headers="expandedShipmentTableHeaders"
                :items="expandedShipmentTableItems"
                density="compact"
                hover
                :loading="expandedLoading"
                loading-text="Loading... Please wait"
              />
            </div>
          </td>
        </tr>
      </template>
      <template #[\`item.status.title\`]="{ item }">
        <VChip
          :color="item.status.color"
          size="small"
          text-color="white"
          class="font-weight-bold"
        >
          {{ item.status.title }}
        </VChip>
      </template>
      <template #[\`item.availableActions\`]="{ item }">
        <VTooltip location="bottom">
          <template #activator="{ props }">
            <VBtn
              v-if="item.availableActions.edit"
              color="success"
              icon="$vuetify.icons.edit"
              size="x-small"
              v-bind="props"
              class="mr-1"
              @click="$emit('edit', item)"
            />
          </template>
          <span>Edit</span>
        </VTooltip>

        <VTooltip location="bottom">
          <template #activator="{ props }">
            <VBtn
              v-if="item.availableActions.receive"
              color="success"
              icon="$vuetify.icons.handHoldingBox"
              size="x-small"
              v-bind="props"
              class="mr-1"
              @click="$emit('receive', item)"
            />
          </template>
          <span>Receive</span>
        </VTooltip>

        <VTooltip location="bottom">
          <template #activator="{ props }">
            <VBtn
              v-if="item.availableActions.remind"
              color="info"
              icon="$vuetify.icons.alarmClock"
              size="x-small"
              v-bind="props"
              class="mr-1"
              @click="$emit('remind', item)"
            />
          </template>
          <span>Remind</span>
        </VTooltip>

        <VTooltip location="bottom">
          <template #activator="{ props }">
            <VBtn
              v-if="item.availableActions.close"
              color="primary-lighten-3"
              icon="$vuetify.icons.doorClosed"
              size="x-small"
              v-bind="props"
              class="mr-1"
              @click="$emit('close', item)"
            />
          </template>
          <span>Close</span>
        </VTooltip>

        <VTooltip location="bottom">
          <template #activator="{ props }">
            <VBtn
              v-if="item.availableActions.clear"
              color="white"
              icon="$vuetify.icons.eraser"
              size="x-small"
              v-bind="props"
              class="mr-1"
              @click="$emit('clear', item)"
            />
          </template>
          <span>Clear</span>
        </VTooltip>

        <VTooltip location="bottom">
          <template #activator="{ props }">
            <VBtn
              v-if="item.availableActions.void"
              color="error-lighten-2"
              icon="$vuetify.icons.trash"
              size="x-small"
              v-bind="props"
              class="mr-1"
              @click="$emit('void', item)"
            />
          </template>
          <span>Void</span>
        </VTooltip>
      </template>
    </MeruDataTable>
  </VContainer>
</template>
<script>
import MeruDataTable from '@/components/core/MeruDataTable.vue';
import { mapState } from 'vuex';

export default {
  components: { MeruDataTable },
  props: {
    shipmentStatus: {
      type: String,
      required: true,
      validator: (type) => ['in-transit', 'partial', 'received', 'all'].includes(type)
    },
    search: {
      type: String,
      default: '',
    },
  },
  emits: [
    'edit',
    'receive',
    'close',
    'void',
    'remind',
    'clear',
    'error',
  ],
  exposes: ['loadShipments'],
  data() {
    return {
      isLoadingShipments: true,
      expandedLoading: false,
      expandedRows: [],
      sortBy: [{key: 'shipDate', order: 'desc'}],
      expandedShipmentTableHeaders: [
        {
          sortable: true,
          title: 'SKU',
          key: 'sku',
        },
        {
          sortable: true,
          title: 'Description',
          key: 'description',
        },
        {
          sortable: false,
          title: 'Whole Boxes',
          key: 'boxes',
        },
        {
          sortable: false,
          title: 'Whole Boxes Received',
          key: 'boxesReceived',
        },
        {
          sortable: false,
          title: 'Half Boxes',
          key: 'halfBoxes',
        },
        {
          sortable: false,
          title: 'Half Boxes Received',
          key: 'halfBoxesReceived',
        },
        {
          sortable: false,
          title: 'Singles',
          key: 'individualItems',
        },
        {
          sortable: false,
          title: 'Singles Received',
          key: 'individualItemsReceived',
        },
      ],
      expandedShipmentTableItems: [],
      expandedShipment: {},
      baseHeaders: [
        { title: 'Status', value: 'status.title', sortable: true, width: 150 },
        {
          title: 'Pick Number',
          key: 'pickNumber',
        },
        {
          title: 'Ship Date',
          key: 'shipDate'
        },
        {
          title: 'From',
          key: 'from'
        },
        {
          title: 'To',
          key: 'to',
        },
        {
          sortable: false,
          align: 'end',
          title: 'Actions',
          key: 'availableActions',
          width: 150,
        }
      ],
    };
  },
  computed: {
    ...mapState('inventory', ['skusById']),
    ...mapState('user', ['user']),
    ...mapState('shipments', {
      pendingShipments: 'pending',
      partiallyReceivedShipments: 'partiallyReceived',
      receivedShipments: 'received'
    }),
    tableHeaders() {
      let headers = [...this.baseHeaders];
      if (this.shipmentStatus === 'received') {
        headers.splice(2, 0, {
          sortable: true,
          title: 'Received Date',
          key: 'receiveDate',
        });
      }
      return headers;
    },
    tableItems() {
      let items = [];
      switch (this.shipmentStatus) {
        case 'in-transit':
          items = this.formatShipmentTableItems(this.pendingShipments, 'in-transit');
          break;
        case 'partial':
          items = this.formatShipmentTableItems(this.partiallyReceivedShipments, 'partial');
          break;
        case 'received':
          items = this.formatShipmentTableItems(this.receivedShipments, 'received');
          break;
        case 'all':
          items = [
            ...this.formatShipmentTableItems(this.pendingShipments, 'in-transit'),
            ...this.formatShipmentTableItems(this.partiallyReceivedShipments, 'partial'),
            ...this.formatShipmentTableItems(this.receivedShipments, 'received'),
          ];
          break;
      }
      return items;
    },
    expandedPickNumber() {
      return this.expandedRows[0];
    }
  },
  watch: {
    shipmentStatus() {
      this.loadShipments();
    }
  },
  mounted() {
    this.loadShipments();
  },
  methods: {
    getFormattedExpandedShipmentItems(shipment) {
      let items = shipment.sent.transferSkus;
      for (const received of shipment.received) {
        for (const sku of received.transferSkus) {
          if (!this.expandedShipmentTableItems.find((i) => i.skuId === sku.skuId)) {
            this.expandedShipmentTableItems.push({
              ...sku,
              boxes: 0,
              halfBoxes: 0,
              individualItems: 0,
            });
          }
        }
      }
      return items.map(item => {
        const sku = this.getSku(item);
        const received = this.getReceived(item);
        return {
          ...item,
          sku: sku?.sku || '',
          description: sku ? sku.description : '',
          boxesReceived: received.boxes || 0,
          halfBoxesReceived: received.halfBoxes || 0,
          individualItemsReceived: received.individualItems || 0,
        };
      });
    },
    toggleSingleExpand() {
      this.expandedRows = this.expandedRows.slice(-1);
    },
    async toggleShipmentDetails() {
      this.toggleSingleExpand();
      await this.loadExpandedShipment();
    },
    async loadExpandedShipment(refreshData) {
      let isRequestStale = false;
      let pickNumber = this.expandedPickNumber;
      let isShipmentLoaded = pickNumber === this.expandedShipment?.sent?.pickNumber ;
      if (!pickNumber || (isShipmentLoaded && !refreshData)) {
        return;
      }
      this.expandedLoading = true;
      this.expandedShipmentTableItems = [];
      try {
        const shipment = await this.$store.dispatch('shipments/loadShipment', {
          pickNumber,
        });
        await this.skusPromise();
        isRequestStale = pickNumber !== this.expandedPickNumber;
        if (!isRequestStale) {
          this.expandedShipment = shipment;
          this.expandedShipmentTableItems = this.getFormattedExpandedShipmentItems(shipment);
        }
      } catch (error) {
        this.$emit('error', \`Failed to load shipment: \${pickNumber}\`);
        this.expandedShipment = undefined;
      }
      if (!isRequestStale || !this.expandedPickNumber) {
        this.expandedLoading = false;
      }
    },
    isReceiving(shipment) {
      return shipment.toUser.id === this.user.id;
    },
    getSku(transferSku) {
      return this.skusById[transferSku.skuId];
    },
    getReceived(transferSku) {
      const shipment = this.expandedShipment;

      function reducer(field) {
        return (acc, receivedShipment) => {
          const receivedSku = receivedShipment.transferSkus.find(
            (i) => i.skuId === transferSku.skuId
          );

          if (receivedSku) {
            return acc + receivedSku[field];
          } else {
            return acc;
          }
        };
      }

      if (shipment.sent) {
        return {
          boxes: shipment.received.reduce(reducer('boxes'), 0),
          halfBoxes: shipment.received.reduce(reducer('halfBoxes'), 0),
          individualItems: shipment.received.reduce(
            reducer('individualItems'),
            0
          ),
        };
      } else {
        return {};
      }
    },
    skusPromise() {
      if (Object.entries(this.skusById).length > 0) {
        return Promise.resolve(this.skusById);
      } else {
        return new Promise((resolve) => {
          const watcher = this.$watch('skusById', (newVal) => {
            resolve(newVal);
            watcher();
          });
        });
      }
    },
    async loadShipments() {
      this.isLoadingShipments = true;
      let shipmentStatusLabel = '';
      let loadPromise = Promise.resolve();
      await this.loadExpandedShipment(true);

      switch (this.shipmentStatus) {
        case 'in-transit':
          shipmentStatusLabel = 'pending';
          loadPromise = this.$store.dispatch('shipments/loadPending');
          break;
        case 'partial':
          shipmentStatusLabel = 'partially received';
          loadPromise = this.$store.dispatch('shipments/loadPartiallyReceived');
          break;
        case 'received':
          shipmentStatusLabel = 'received';
          loadPromise = this.$store.dispatch('shipments/loadReceived');
          break;
      }
      return loadPromise
        .catch((error) => {
          console.error(error);
          this.$emit('error', \`Failed to load \${shipmentStatusLabel} shipments\`);
        }).finally(() => {
          this.isLoadingShipments = false;
        });
    },
    formatShipmentTableItems(shipments, status) {
      const statusMap = {
        'in-transit': {
          title: 'In-transit',
          color: 'error',
        },
        received: {
          title: 'Received',
          color: 'success',

        },
        partial: {
          title: 'Partially Received',
          color: 'warning',
        }
      };
      return shipments.map(shipment => ({
        ...shipment,
        to: \`\${shipment.toUser.person.firstName} \${shipment.toUser.person.lastName}\`,
        from: \`\${shipment.fromUser.person.firstName} \${shipment.fromUser.person.lastName}\`,
        availableActions: {
          edit: !this.isReceiving(shipment),
          receive: this.isReceiving(shipment),
          close: !this.isReceiving(shipment) && status === 'partial',
          void: !this.isReceiving(shipment) && status === 'in-transit',
          remind: !this.isReceiving(shipment) && status !== 'received',
          clear: !this.isReceiving(shipment) && status === 'received'
        },
        status: {
          value: status,
          ...statusMap[status]
        }
      }));
    },
  },
};
<\/script>
<style lang="scss" scoped>
.v-data-table-header__icon {
  margin-left: 5px !important;
  font-size: 14px !important;
}
.v-data-table__expand-icon--active {
  transform: rotate(-180deg);
}
</style>
`;export{e as default};
