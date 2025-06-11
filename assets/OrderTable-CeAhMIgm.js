const e=`<template>
  <div>
    <MeruDataTable
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="filteredData"
      class="elevation-0 on-surface-high-contrast-text"
      items-per-page="-1"
      hide-default-footer
      @click:row="setActiveRow"
    >
      <template #top>
        <VRow
          class="bg-surface-variant px-4 ma-0 py-sm-2 pt-4"
          justify="start"
          align="center"
          no-gutters
        >
          <VCol
            cols="12"
            sm="5"
            class="d-flex align-center pr-sm-4"
          >
            <p class="font-weight-bold mr-2">
              Filter Results:
            </p>
            <VAutocomplete
              v-model="multiSearch.stage"
              :items="autoCompleteItems('stage')"
              label="Stage"
              bg-color="surface"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              multiple
              chips
            >
              <template #chip="{ props, item, index }">
                <StageChip
                  v-if="index < 2"
                  v-bind="props"
                  :stage="item.value"
                />
                <span
                  v-if="index === 2 && multiSearch.stage.length"
                  class="text-primary-darken-2 text-caption align-self-center"
                >
                  {{ limitSelectionText }}
                </span>
              </template>
            </VAutocomplete>
          </VCol>
          <VCol
            cols="12"
            sm="7"
            class="d-flex align-center"
          >
            <VCheckbox
              v-model="multiSearch.assigneeUsername"
              :value="loggedInUserName"
              hide-details
              color="primary"
              multiple
              inline
            >
              <template #label>
                <span class="text-body-4 font-weight-bold">Orders Assigned to Me</span>
              </template>
            </VCheckbox>
            <VCheckbox
              v-model="multiSearch.assigneeUsername"
              value="unassigned"
              hide-details
              color="primary"
              multiple
              inline
            >
              <template #label>
                <span class="text-body-4 font-weight-bold">Unassigned Orders</span>
              </template>
            </VCheckbox>
          </VCol>
        </VRow>
        <VSlideYTransition>
          <VSheet
            v-if="hasActiveFilters"
            class="d-flex pa-4 align-center"
            color="surface-light"
          >
            <a
              role="button"
              class="mr-4 text-capitalize text-info text-decoration-underline font-weight-medium"
              @click="resetFilters"
            >
              Clear Filters
            </a>
            <div
              v-for="(activeFilters, key, index) in multiSearch"
              :key="index"
            >
              <template v-if="key === 'stage'">
                <StageChip
                  v-for="(filter, i) in activeFilters"
                  :key="i"
                  :stage="filter"
                  append-icon="fas fa-circle-xmark"
                  class="mr-4"
                  @click="removeActiveFilter(key, i)"
                />
              </template>
              <template v-else>
                <VChip
                  v-for="(filter, i) in activeFilters"
                  :key="i"
                  size="small"
                  append-icon="fas fa-circle-xmark"
                  class="mr-4"
                  color="teal"
                  @click="removeActiveFilter(key, i)"
                >
                  {{ filter }}
                </VChip>
              </template>
            </div>
          </VSheet>
        </VSlideYTransition>
      </template>

      <template #[\`item.stage\`]="{ item }">
        <StageChip
          :stage="item.stage"
        />
      </template>

      <template #[\`item.kioskNumber\`]="{ item }">
        <ProductImageKioskNumber
          :kiosk-number="item.kioskNumber"
          :status="item.processorStatus"
          product-color-one="#1e5799"
          product-color-two="#7db9e8"
        />
      </template>

      <template #[\`item.amount\`]="{ item }">
        {{ $filters.currency(item.amount) }}
      </template>

      <template #[\`item.timestamp\`]="{ item }">
        <span class="font-weight-bold">{{ formatDate(item.timestamp) }}</span>
        {{ formatTime(item.timestamp) }}
      </template>

      <template #[\`item.paymentType\`]="{ item }">
        <PaymentType
          :card-number="item.pan"
          layout-type="chip"
          pan-length="truncated"
          :payment-type="item.paymentType"
        />
      </template>
      <template #[\`item.assigneeUsername\`]="{item}">
        <ActionMenu
          :title="assignMenuTitle(item.assigneeUsername)"
          class="d-inline-block"
          @click.stop
        >
          <template #activator>
            <UserAvatar
              :user-name="item.assigneeUsername"
              class="d-inline-block"
            />
          </template>
          <template #content="{closeMenu}">
            <AssignOrder
              :session-id="item.sessionId"
              :assigned-to="item.assigneeUsername"
              @assign-complete="closeMenu"
            />
          </template>
        </ActionMenu>
      </template>
      <template #no-data>
        <div v-if="hasActiveFilters">
          No Filter Results.
          <a
            role="button"
            class="ml-2 text-capitalize text-info text-decoration-underline font-weight-bold"
            @click="resetFilters"
          >
            Clear Filters
          </a>
        </div>
        <p v-else>
          No Orders Found
        </p>
      </template>
    </MeruDataTable>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { getOrderStageColor, getOrderStageName } from '@/utils/orderHelpers';
import { parseISO, format } from 'date-fns';
import UserAvatar from '@/components/order/UserAvatar.vue';
import ActionMenu from '@/components/base/ActionMenu.vue';
import AssignOrder from '@/components/order/AssignOrder.vue';
import StageChip from '@/components/order/StageChip.vue';
import PaymentType from '@/components/order/PaymentType.vue';
import ProductImageKioskNumber from '@/components/order/ProductImageKioskNumber.vue';
import MeruDataTable from '@/components/core/MeruDataTable.vue';

export default {
  components: {
    UserAvatar,
    ActionMenu,
    AssignOrder,
    StageChip,
    PaymentType,
    ProductImageKioskNumber,
    MeruDataTable,
  },
  expose: ['resetFilters'],
  props: {
    orders: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedId: -1,
      multiSearch: {
        stage: [],
        assigneeUsername: [],
      },
      sortBy: [
        { key: 'timestamp', order: 'desc' },
      ],
      headers: [
        { key: 'stage', title: 'Stage' },
        { key: 'transactionId', title: 'Transaction ID' },
        { key: 'kioskNumber', title: 'Kiosk #', width: 50 },
        { key: 'timestamp', title: 'Date' },
        { key: 'email', title: 'Email' },
        { key: 'name', title: 'Name' },
        { key: 'amount', title: 'Amount' },
        { key: 'paymentType', title: 'Payment Type' },
        { key: 'assigneeUsername', title: '', sortable: false },
      ]
    };
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('order', ['orderDetails']),
    loggedInUserName() {
      return this.user.username;
    },
    hasActiveFilters() {
      return Object.values(this.multiSearch).some((value) => value.length > 0);
    },
    filteredData() {
      if (Object.keys(this.multiSearch).length) {
        return this.orders.filter((item) => {
          return Object.entries(this.multiSearch).every(([filterType, activeFilters]) => {
            if (activeFilters.length === 0) {
              return true;
            }
            if (Array.isArray(activeFilters)) {
              if (filterType === 'assigneeUsername') {
                return activeFilters.includes(item[filterType]) || activeFilters.includes('unassigned') && !item[filterType];
              }
              return activeFilters.includes(item[filterType]);
            }
          });
        });
      } else {
        return this.orders;
      }
    },
    limitSelectionText() {
      return '+ ' + (this.multiSearch.stage.length - 2) + ' others';
    },
  },
  methods: {
    getOrderStageColor,
    getOrderStageName,
    ...mapMutations('order', ['setActiveOrder', 'setOrderDetails']),
    ...mapMutations('app', ['setCardDrawer', 'resetCardDrawer']),
    ...mapActions('order', ['fetchOrderDetails']),
    autoCompleteItems(key) {
      const uniqueValues = [...new Set(this.orders.map(item => item[key]))];
      let filteredUndefined = uniqueValues.filter((item) => item !== undefined);
      return filteredUndefined.map(value => {
        let titleValue = value;
        if (key === 'stage') {
          titleValue = this.getOrderStageName(value);
        }
        return {
          title: titleValue,
          value: value,
        };
      });
    },
    removeActiveFilter(key, index) {
      this.multiSearch[key].splice(index, 1);
    },
    resetFilters() {
      this.multiSearch = {
        stage: [],
        assigneeUsername: [],
      };
    },
    async setActiveRow(_, item) {
      item = item.item;
      this.resetCardDrawer();
      let components = ['OrderCardDetails', 'CustomerCard', 'OrderCardTracking'];
      this.setActiveOrder(null);
      this.setOrderDetails(null);
      this.setActiveOrder(item);
      await this.fetchOrderDetails(item.sessionId).then((order) => {
        if (order?.items?.some(item => item.type === 'CK')) {
          components.splice(1, 0, 'KeySkuCard');
        }
      });
      this.setCardDrawer(
        {
          isShown: true,
          components: components,
          headerVariant: 'order',
          secondaryComponents: ['OrderActivity'],
        }
      );
    },
    formatDate(date) {
      return format(parseISO(date), 'MM/dd/yyyy');
    },
    formatTime(date) {
      return format(parseISO(date), 'h:mm a');
    },
    assignMenuTitle(title) {
      return title ? \`Assigned To: \${title?.toUpperCase()}\` : 'Unassigned';
    },
  }
};
<\/script>
<style lang="scss" scoped>
:deep(.v-data-table) {
  white-space: nowrap;

  th {
    border-bottom: none;
  }
  tr:hover {
    cursor: pointer !important;
  }
}
</style>
`;export{e as default};
