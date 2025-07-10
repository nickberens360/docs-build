const n=`<template>
  <VSelect
    v-if="$vuetify.display.smAndDown"
    v-model="selectedTabIndex"
    hide-details
    label="Product Class"
    :items="tabs"
    item-props
    :item-title="tab => tab.name"
    :item-value="_ => tabs.indexOf(_)"
  >
    <!-- Prepend Icon in List -->
    <template #item="{ props, item: tab }">
      <VListItem v-bind="props">
        <VIcon
          v-if="props.icon"
          start
          size="small"
        >
          $vuetify.icons.{{ props.icon }}
        </VIcon>
        {{ tab.title }}
      </VListItem>
    </template>

    <!-- Prepend Icon in Selection -->
    <template #selection="{ item: tab }">
      <VIcon
        v-if="tab.raw.icon"
        start
        size="small"
      >
        $vuetify.icons.{{ tab.raw.icon }}
      </VIcon>
      {{ tab.title }}
    </template>
  </VSelect>
  <VTabs
    v-else
    v-model="selectedTabIndex"
  >
    <VTab
      v-for="tab in tabs"
      :key="tab.name"
    >
      <VIcon
        v-if="tab.icon !== undefined"
        start
        size="small"
      >
        $vuetify.icons.{{ tab.icon }}
      </VIcon>
      {{ tab.name }}
    </VTab>
  </VTabs>
</template>

<script>
export default {
  props: {
    showOnly: {
      type: Array,
      required: false,
      default: () => ['All', 'Keys', 'Auto', 'Tags', 'Instafob'],
    },
  },
  emits: ['change'],
  data: () => ({
    selectedTabIndex: 0,
    tabs: [],
  }),
  watch: {
    selectedTabIndex(newIndex) {
      this.$emit('change', this.tabs[newIndex]);
    }
  },
  created() {
    this.tabs = [
      {
        name: 'All',
        isAll: true,
      },
      {
        name: 'Keys',
        icon: 'key',
        productClasses: ['KE'], // maybe + ['KA', 'CP', 'OT', 'DN']
        pricingModelType: 'K',
      },
      {
        name: 'Auto',
        icon: 'car',
        productClasses: ['CK'], // maybe + ['TR', 'SV']
      },
      {
        name: 'Tags',
        icon: 'tag',
        productClasses: ['TG'], // maybe + ['TA', 'CN']
        pricingModelType: 'T',
      },
      {
        name: 'Instafob',
        icon: 'signalStream',
        productClasses: ['IF'], // unknown at the moment
        pricingModelType: 'F',
      },
    ].filter(_ => this.showOnly.includes(_.name));

    // initialize tab
    this.$emit('change', this.tabs[this.selectedTabIndex]);
  },
  methods: {
    setIndex(newIdx) {
      this.selectedTabIndex = newIdx;
    }
  },
};
<\/script>
`;export{n as default};
