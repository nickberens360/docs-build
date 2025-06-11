const n=`<template>
  <div>
    <VMenu
      v-model="isMenuOpen"
      :close-on-content-click="false"
      scrim
    >
      <template #activator="{props}">
        <div v-bind="props">
          <slot name="activator" />
        </div>
      </template>
      <VCard
        width="400"
        color="surface-variant"
        class="pa-0"
      >
        <VCardTitle class="bg-primary">
          <slot name="title">
            {{ title }}
          </slot>
        </VCardTitle>
        <VCardText>
          <slot
            name="content"
            :close-menu="closeMenu"
          />
        </VCardText>
      </VCard>
    </VMenu>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    closeMenu() {
      this.isMenuOpen = false;
    },
  },
};
<\/script>`;export{n as default};
