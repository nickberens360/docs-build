const e=`<template>
  <VAutocomplete
    v-model:search.trim="search"
    :model-value="modelValue"
    :items="menuItems"
    :item-title="(skus) => \`\${skus.sku ?? ''} \${skus.description ?? ''}\`"
    return-object
    clear-icon="$times"
    clearable
    color="primary-lighten-2"
    class="catalog-menu"
    :search="search"
    :menu-props="{width: '100%', maxWidth: 600}"
    v-bind="$attrs"
    @update:model-value="handleItemChange"
  >
    <template
      #details
    >
      <slot name="details" />
    </template>
    <template #label>
      <span class="d-block">{{ menuLabel }}</span>
    </template>
    <template #selection="{ item }">
      <div class="d-flex flex-column">
        <span class="text-body-1 line-height-1">
          {{ item.raw.sku }}
        </span>
        <span class="text-caption">
          {{ item.raw.description }}
        </span>
      </div>
    </template>
    <template #item="{ props, item }">
      <VListItem
        v-if="(typeof item !== 'object')"
        v-bind="props"
      />
      <VListItem
        v-else
        v-bind="props"
      >
        <template #prepend>
          <ProductImage
            :sku="item.raw.sku"
            :product-type="item.raw.productClass"
            width="70px"
            max-height="30"
            class="mr-8"
          />
        </template>
        <VListItemTitle>
          {{ item.raw.description }}
        </VListItemTitle>
        <VListItemTitle
          v-if="item.raw.size"
        >
          size: {{ item.raw.size }}
        </VListItemTitle>
      </VListItem>
    </template>
  </VAutocomplete>
</template>

<script>
import ProductImage from '@/components/base/ProductImage.vue';
import { mapGetters } from 'vuex';

export default {
  components: { ProductImage },
  props: {
    modelValue: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    productClasses: {
      type: Array,
      required: false,
      default: () => [],
    },
    excludedProductClasses: {
      type: Array,
      required: false,
      default: () => [],
    },
    showDeprecated: {
      type: [Array, Boolean],
      required: false,
      default: false,
    },
    compatibleMachineType: {
      type: String,
      required: false,
      default: '',
    },
    menuLabel: {
      type: String,
      required: false,
      default: 'SKU/Description',
    },
  },
  emits: ['update:model-value'],
  data() {
    return {
      search: '',
    };
  },
  computed: {
    ...mapGetters({
      environment: 'app/getEnvConfigs',
      getSKUs: 'inventory/getSKUs',
    }),
    menuItems() {
      return this.getSKUs.filter((sku) => {
        // filter for deprecation status
        const isAllowedByList = (Array.isArray(this.showDeprecated) && this.showDeprecated.includes(sku.sku) );
        const isAllowedByBoolean = this.showDeprecated === true;
        return !sku.deprecated || isAllowedByBoolean || isAllowedByList;
      }).filter((sku) => {
        // filter for allowed product classes
        return !this.productClasses.length || this.productClasses.includes(sku.productClass);
      }).filter((sku) => {
        // filter out excluded product classes
        return !this.excludedProductClasses.length || !this.excludedProductClasses.includes(sku.productClass);
      }).filter((sku) => {
        // filter for compatible machine types
        return !this.compatibleMachineType || sku.compatibleMachines.includes(this.compatibleMachineType);
      });
    },
  },
  methods: {
    handleItemChange(item) {
      if (!item) {
        return this.$emit('update:model-value', undefined);
      }
      this.$emit('update:model-value', item);
    },
  },
};
<\/script>
<style lang="scss" scoped>
.catalog-menu :deep(.v-field) {
  height: 65px;
  display: flex;
  align-items: center;
}
</style>
`;export{e as default};
