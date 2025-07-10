const e=`<template>
  <!-- use select on mobile -->
  <VSelect
    v-if="$vuetify.display.smAndDown"
    :model-value="selectedCategory"
    variant="filled"
    hide-details
    label="Select an Image Category to Upload"
    class="mt-4"
    :items="categories"
    item-title="name"
    :item-value="cat => cat"
    @update:model-value="($emit('change', $event))"
  />

  <!-- use tabs on desktop -->
  <VTabs
    v-else
    v-model="activeTab"
    class="my-4"
    @update:model-value="tabChange"
  >
    <template
      v-for="cat in categoriesWithVuetifyDivider"
      :key="cat.code"
    >
      <VDivider
        v-if="cat.divider"
        vertical
        class="mx-4"
      />
      <VTab v-else>
        {{ cat.name }}
      </VTab>
    </template>
  </VTabs>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      default: () => [],
    },
    selectedCategory: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['change'],
  data: () => ({
    activeTab: 0,
  }),
  computed: {
    categoriesWithVuetifyDivider() {
      return [this.categories[0], { code: '\\0', divider: true }, ...this.categories.slice(1, this.categories.length)];
    }
  },
  watch: {
    // watch the selectedCategory prop to update the local state (which needs to be an integer and writable (hence, local state))
    selectedCategory(newVal) {
      this.activeTab = this.categories.findIndex(cat => cat === newVal);
    }
  },
  methods: {
    tabChange(tabNumber) {
      this.$emit('change', this.categories[tabNumber]);
    }
  },
};
<\/script>
`;export{e as default};
