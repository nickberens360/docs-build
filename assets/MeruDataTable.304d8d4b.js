const n=`<template>
  <div
    class="meru-data-table"
    :class="{ 'meru-data-table--no-footer': hideDefaultFooter }"
  >
    <VDataTable
      v-if="!loadingWithQueryParams"
      :headers="headers"
      :loading="loading"
      :loading-text="loadingText"
      v-bind="$attrs"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="slotData"
        :key="name"
      >
        <slot
          v-if="name"
          :name="name"
          v-bind="slotData"
        />
      </template>
    </VDataTable>
    <VDataTable
      v-else
      :headers="headers"
      loading
      :loading-text="loadingText"
    >
      <template #headers>
        <VDataTableHeaders />
      </template>
    </VDataTable>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    hideDefaultFooter: {
      type: Boolean,
      default: false,
    },
    headers: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: '$vuetify.dataIterator.loadingText',
    },
    isUsingQueryParams: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    loadingWithQueryParams() {
      return this.loading && this.isUsingQueryParams;
    },
  },
};
<\/script>

<style lang="scss" scoped>
.meru-data-table {
  :deep(.v-data-table-header__sort-icon) {
    font-size: 12px !important;
    margin-left: 8px !important;
  }
  &--no-footer {
    :deep(.v-data-table-footer) {
      display: none !important;
    }
  }
}

</style>`;export{n as default};
