const e=`<template>
  <MeruDataTable
    :headers="headers"
    :items="kiosks"
    @click:row="handleRowClick"
  >
    <template #[\`item.serialNumber\`]="{ item }">
      <div
        class="kiosk-table-info-cell d-flex align-center"
      >
        <span class="text-decoration-underline line-height-1 text-primary-darken-2 font-weight-bold text-decoration-none text-body-2">
          {{ item.serialNumber }}
        </span>
      </div>
    </template>
    <template #[\`item.machineHealth\`]="{ item }">
      <KioskStatusIcon
        :kiosk="item"
        status-type="machineHealth"
      />
    </template>
    <template #[\`item.connectionStatus\`]="{ item }">
      <KioskStatusIcon
        :kiosk="item"
        status-type="connection"
      />
    </template>
    <template #[\`item.avgDailyRev\`]="{ item }">
      <GradeTag
        :grade="item.grade"
        :average-daily-revenue="item.avgDailyRev"
      />
    </template>
    <template #[\`item.lastService\`]="{ item }">
      <KioskStatusIcon
        :kiosk="item"
        status-type="service"
      />
    </template>
  </MeruDataTable>
</template>

<script>
import GradeTag from '@/components/base/GradeTag.vue';
import KioskStatusIcon from '@/components/base/KioskStatusIcon.vue';
import MeruDataTable from '@/components/core/MeruDataTable.vue';

export default {
  components: { MeruDataTable, KioskStatusIcon, GradeTag },
  props: {
    kiosks: {
      type: Array,
      required: true,
    },
  },
  emits: ['kiosk-row-clicked'],
  data: () => ({
    headers: [
      { title: 'Kiosk', key: 'serialNumber', width: '210' },
      { title: 'Type', key: 'machineType', width: '50' },
      { title: 'Health', key: 'machineHealth', width: '50' },
      { title: 'Connection', key: 'connectionStatus', width: '120' },
      { title: 'Grade-Daily $', key: 'avgDailyRev', width: '160'},
      { title: 'Serviced', key: 'lastService', width: '120' },
      { title: 'Loc. Code', key: 'locationCode', width: '150'},
      { title: 'Banner', key: 'name'},
      { title: 'City', key: 'city'},
      { title: 'State', key: 'state', width: '50'},
    ],
  }),
  methods: {
    handleRowClick(_, { item }) {
      this.$emit('kiosk-row-clicked', item);
    },
  },
};
<\/script>
<style lang="scss" scoped>
@media print {
  .v-data-table {
    font-size: 12px !important;
  }
  .kiosk-table-info-cell {
    span,
    .v-icon
    {
      font-size: 12px !important;
    }
    .v-icon {
      display: none;
    }
  }
  :deep(.grade-tag__grade) {
    color: black !important;
    flex: unset;
    max-width: unset;
  }
  :deep(.grade-tag__amount) {
    padding: 0 !important;
  }
  :deep(.kiosk-status-icon__icon) {
    font-size: 24px !important;
    margin-right: 4px !important;
  }
  :deep(.kiosk-status-icon__label) {
    font-size: 11px !important;
  }
}
</style>`;export{e as default};
