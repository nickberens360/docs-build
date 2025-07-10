const e=`<template>
  <div class="order-items-preview">
    <div
      v-for="item in items"
      :key="item.itemId"
      class="order-items-preview__item text-primary-darken-3 text-subtitle-2"
    >
      <span>Qty.</span>
      <span class="text-h4 font-weight-bold">{{ item.quantity }}</span>
      <ProductImage
        :sku="item.sku"
        :product-type="item.type"
        height="75px"
        width="75px"
        :rotated="productTypesToRotate.includes(item.type)"
      />
      <span class="mt-2">SKU</span>
      <span class="font-weight-bold">{{ item.sku }}</span>
    </div>
  </div>
</template>

<script>
import ProductImage from '@/components/base/ProductImage.vue';

export default {
  components: { ProductImage },
  props: {
    items: {
      required: true,
      type: Array
    }
  },
  data: () => ({
    productTypesToRotate: ['CK', 'KE']
  })
};
<\/script>

<style lang="scss" scoped>
.order-items-preview {
  border: 2px solid rgb(var(--v-theme-primary-lighten-2));
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  padding: 24px;

  &__item {
    align-items: center;
    display: flex;
    flex-direction: column;
    margin: 0 0 24px 0;
    width: 170px;
  }
}
</style>`;export{e as default};
