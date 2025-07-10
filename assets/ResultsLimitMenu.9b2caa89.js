const n=`<template>
  <VMenu
    v-model="isMenuOpen"
    class="results-limit-menu"
    location="bottom"
    transition="scale-transition"
    :close-on-content-click="false"
    @update:model-value="limit = modelValue"
  >
    <template #activator="{ props }">
      <VChip
        v-bind="props"
        class="text-primary-lighten-4"
        color="primary-darken-2"
        size="large"
        variant="flat"
      >
        <template #prepend>
          <VAvatar
            start
            color="primary"
          >
            <span>{{ resultsCount }}</span>
          </VAvatar>
        </template>
        / {{ modelValue }} max
        <VIcon class="ml-2">
          $caretDown
        </VIcon>
      </VChip>
    </template>
    <VCard width="400">
      <VCardText class="pt-12">
        <VSlider
          v-model="limit"
          label="Max Results"
          thumb-color="primary-lighten-2"
          color="primary-lighten-2"
          thumb-label="always"
          min="0"
          :max="maxLimit"
          :step="stepSize"
        />
      </VCardText>
      <VCardActions>
        <VBtnSecondary @click="isMenuOpen = false">
          cancel
        </VBtnSecondary>
        <VSpacer />
        <VBtnPrimary @click="updateResultsLimit">
          set limit
        </VBtnPrimary>
      </VCardActions>
    </VCard>
  </VMenu>
</template>
<script>
export default {
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    resultsCount: {
      type: Number,
      default: 0
    },
    maxLimit: {
      type: Number,
      default: 500
    },
    stepSize: {
      type: Number,
      default: 25
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      isMenuOpen: false,
      limit: 0
    };
  },
  methods: {
    updateResultsLimit() {
      this.isMenuOpen = false;
      this.$emit('update:model-value', this.limit);
    }
  }
};
<\/script>
<style lang="scss" scoped>
</style>
`;export{n as default};
