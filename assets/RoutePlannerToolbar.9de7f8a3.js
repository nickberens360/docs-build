const n=`<template>
  <VCard class="route-planner-toolbar">
    <div class="route-planner-toolbar__row">
      <VTextField
        v-model="filterString"
        flat
        variant="solo"
        placeholder="Serial #, ABN, Store #"
        clearable
        hide-details
        single-line
        @focus="isListOpen = true"
      >
        <template #prepend-inner>
          <VIcon
            size="small"
            icon="$vuetify.icons.solidSearch"
          />
        </template>
      </VTextField>

      <VDivider
        vertical
        class="mx-4"
      />

      <VBtn
        icon
        elevation="0"
        @click="isListOpen = !isListOpen"
      >
        <VIcon
          :class="{'flip-icon': isListOpen}"
          size="small"
          icon="$vuetify.icons.chevronDown"
        />
      </VBtn>
    </div>

    <VExpandTransition>
      <MeruDataTable
        v-show="isListOpen"
        ref="data-table"
        v-model:sort-by="sortBy"
        v-model:expanded="expandedRows"
        :model-value="selectedLocationIds"
        :search="filterString"
        class="mk-data-table"
        item-selectable="id"
        fixed-header
        :items-per-page="-1"
        show-select
        no-data-text="No Locations"
        no-results-text="No Results"
        :headers="tableHeaders"
        :items="tableItems"
        :custom-filter="customFilter"
        width="100%"
        hide-default-footer
      >
        <!-- Divider -->
        <template #top>
          <VDivider />
        </template>

        <!-- Header Checkbox -->
        <template #[\`header.data-table-select\`]="{ props }">
          <VCheckboxBtn
            v-bind="props"
            v-model="isAllSelected"
          />
        </template>

        <!-- Rendered Row -->
        <template #item="{isSelected, item, internalItem, isExpanded: isRowExpanded}">
          <tr
            :ref="\`\${item.id}\`"
            :class="{'selected-list-item': isSelected([{value: item.id}])}"
          >
            <td
              class="pl-0 bg-transparent"
              colspan="2"
            >
              <div class="d-flex align-center">
                <VCheckboxBtn
                  class="flex-grow-0"
                  :model-value="isSelected([{value: item.id}])"
                  @update:model-value="$emit('toggle-location-select', item.id)"
                />
                <div
                  class="location-name"
                  @click="$emit('show-location', item.id)"
                >
                  {{ item.name }}
                </div>
              </div>
            </td>
            <td class="bg-transparent">
              {{ item.abn }}
            </td>
            <td class="bg-transparent pr-0">
              <div class="d-flex align-center justify-space-between">
                <span class="mr-2">{{ item.kiosks.length }}</span>
                <VBtn
                  icon
                  class="elevation-0 bg-transparent"
                  @click="toggleRowExpanded(item.id)"
                >
                  <VIcon
                    :class="isRowExpanded(internalItem) ? 'flip-icon' : ''"
                    size="small"
                    icon="$vuetify.icons.chevronDown"
                  />
                </VBtn>
              </div>
            </td>
          </tr>
        </template>

        <!-- Expanded Item (list of kiosks at a location) -->
        <template #expanded-row="{ columns, item: loc }">
          <td
            style="background: rgb(var(--v-theme-surface-light));"
            :colspan="columns.length"
          >
            <VListSubheader class="px-4">
              {{ loc.kiosks[0].locationName }}
            </VListSubheader>
            <VCard
              variant="outlined"
              class="mb-4"
            >
              <MeruDataTable
                color="meru-neutral-darken-1"
                density="compact"
                :headers="expandedTableHeaders"
                :items="loc.kiosks"
                hide-default-footer
              />
            </VCard>
          </td>
        </template>
      </MeruDataTable>
    </VExpandTransition>

    <VDivider />
    <div class="route-planner-toolbar__row">
      <div class="text-body-2">
        {{ selectedLocationIds.length === 0 ? "Select on Map or Search" : \`\${selectedLocationIds.length} Location\${selectedLocationIds.length === 1 ? '' : 's'} Selected\` }}
      </div>
      <VBtn
        :disabled="selectedLocationIds.length === 0"
        variant="flat"
        class="bg-info"
        @click="navigate"
      >
        <VIcon start>
          $vuetify.icons.directions
        </VIcon>
        Directions
      </VBtn>
    </div>
  </VCard>
</template>
<script>
import MeruDataTable from '@/components/core/MeruDataTable.vue';

export default {
  components: { MeruDataTable },
  props: {
    locations: {
      type: Array,
      required: true
    },
    selectedLocationIds: {
      type: Array,
      required: true
    },
    isExpanded: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'toggle-select-all',
    'toggle-location-select',
    'update:is-expanded',
    'show-location'
  ],
  expose: [
    'scrollToLocation'
  ],
  data() {
    return {
      sortBy: [{ key: 'name', order: 'asc' }],
      filterString: '',
      expandedRows: [],
      tableHeaders: [
        {
          title: '',
          key: 'data-table-select',
          width: 40,
          headerProps: {
            class: 'text-body-4 pa-0'
          }
        },
        {
          title: 'Location',
          key: 'name',
          width: 150,
          headerProps: {
            class: 'pl-0'
          }
        },
        {
          title: 'ABN',
          key: 'abn',
          width: 100
        },
        {
          title: '# Kiosks',
          key: 'kioskCount',
          headerProps: {
            class: 'pr-0'
          }
        },
      ],
      expandedTableHeaders: [
        {
          title: 'Kiosk Serial Number',
          key: 'serialNumber',
          sortable: false
        },
        {
          title: 'Machine Type',
          key: 'machineType',
          sortable: false
        }
      ]
    };
  },
  computed: {
    isAllSelected: {
      get() {
        return this.selectedLocationIds.length === this.locations.length;
      },
      set(value) {
        this.$emit('toggle-select-all', value);
      }
    },
    isListOpen: {
      get() {
        return this.isExpanded;
      },
      set(value) {
        this.$emit('update:is-expanded', value);
      }
    },
    tableItems() {
      return this.locations.map(loc => ({
        name: loc.kiosks[0].locationName,
        abn: loc.abn,
        kiosks: loc.kiosks,
        kioskCount: loc.kiosks.length,
        id: loc.id,
      }));
    }
  },
  watch: {
    isListOpen(isOpen) {
      if (!isOpen) {
        this.expandedRows = [];
      }
    },
  },
  methods: {
    scrollToLocation(locationId) {
      this.filterString = '';
      if (this.isListOpen) {
        const tr = this.$refs[locationId];
        this.$refs['data-table'].$el.children[1].scrollTop = tr.offsetTop - 48;
      }
    },
    customFilter(value, search, item) {
      let isMatch = true;
      // custom filter for searching by Location Name, ABN, and Serial Number
      search = search.toUpperCase();
      if (search) {
        isMatch = item.raw.abn.toString().includes(search) ||
          item.raw.name.toUpperCase().includes(search) ||
          item.raw.kiosks.find(kiosk => kiosk.serialNumber.includes(search));
      }

      return !!isMatch;
    },
    navigate() {
      // open Google Maps app or site with round-trip directions to all kiosks selected
      // construct Google Maps URL for all waypoints
      // round trip from starting location
      const baseURL = 'https://www.google.com/maps/dir/?api=1&travelmode=driving&waypoints=';
      let waypointString = '';

      for (const location of this.locations.filter(loc => this.selectedLocationIds.includes(loc.id))) {
        const { latitude: lat, longitude: lng } = location.kiosks[0].site.location;

        waypointString += \`\${lat},\${lng}|\`;
      }

      window.open(baseURL + encodeURIComponent(waypointString) + '&destination=My+Location');
    },
    toggleRowExpanded(locationId) {
      if (this.expandedRows.includes(locationId)) {
        this.expandedRows = [];
      } else {
        this.expandedRows = [locationId];
      }
    },
  }
};
<\/script>
<style lang="scss" scoped>
.route-planner-toolbar {
  display: flex;
  flex-direction: column;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
  }
  .mk-data-table {
    overflow: auto;
    max-height: calc(100% - 152px);
    font-size: 14px;
    :deep(.v-data-table__th) {
      font-size: 12px;
    }
  }
  .location-name {
    text-decoration: underline;
    cursor: pointer;
    max-width: 150px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .flip-icon {
    transition: transform 0.2s ease-in-out;
    transform: rotate(180deg);
  }
  @keyframes highlightfade {
    0%, 50% {
      background-color: rgb(var(--v-theme-info));
    }
    100% {
      background-color: rgb(var(--v-theme-surface-light));
    }
  }
  .selected-list-item {
    background-color: rgb(var(--v-theme-surface-light));
    animation: highlightfade 2s;
  }
  .select-all-wrapper {
    max-width: 24px;
  }
}
</style>
`;export{n as default};
