const n=`<template>
  <VTooltip
    location="top"
    theme="dark"
  >
    <template #activator="{ props }">
      <div
        class="text-center d-flex align-center"
        v-bind="props"
      >
        <div class="pr-4">
          <img
            :src="kioskTypeBadgeImageSource"
            alt="Product Image"
          >
        </div>
        <div class="ml-2">
          {{ kioskNumber }}
        </div>
      </div>
    </template>
    <span>{{ kioskTypeBadge.machine }}</span>
  </VTooltip>
</template>

<script>
export default {
  props: {
    kioskNumber: {
      type: [String, Number],
      default: ''
    },
    productImage: {
      type: String,
      default: ''
    },
    productColorOne: {
      type: String,
      default: ''
    },
    productColorTwo: {
      type: String,
      default: ''
    }
  },
  computed: {
    productColorStyles() {
      if (this.productColorOne && this.productColorTwo) {
        return \`background: linear-gradient(to bottom, \${this.productColorOne} 40%,\${this.productColorOne} 40%,\${this.productColorTwo} 40%,\${this.productColorTwo} 40%);\`;
      } else {
        return \`background: \${this.productColorOne};\`;
      }
    },
    //TODO: Re-evaluate once i know how the information for car keys and smart car key is presented
    kioskTypeBadgeImageSource() {
      let image = '';
      if(this.kioskTypeBadge.product === 'key') {
        image = new URL('@/assets/images/machine/key-kiosk-badge.svg', import.meta.url).href;
      } else if(this.kioskTypeBadge.product === 'tag') {
        image = new URL('@/assets/images/machine/tag-kiosk-badge.svg', import.meta.url).href;
      }
      return image;
    },
    kioskTypeBadge() {
      let kiosk = {
        product: 'key',
        machine: 'MinuteKey'
      };

      switch (this.kioskNumber.charAt(0)) {
        case 'X':
          kiosk.product = 'tag';
          kiosk.machine = 'Quick Tag';

          return kiosk;
        case 'K':
          return kiosk;
        default:
          return kiosk;
      }
    }
  }
};
<\/script>

<style scoped lang="scss">
.product-image {
  border: 2px solid #707070;
}
</style>
`;export{n as default};
