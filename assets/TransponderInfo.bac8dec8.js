const n=`<template>
  <VCard
    class="transponder-info"
    color="surface-light"
    elevation="0"
    :rounded="false"
  >
    <VToolbar
      class="pl-4"
      color="primary"
      height="32"
    >
      Transponder Info
    </VToolbar>
    <VCardText>
      <VRow
        justify="space-between"
        align="center"
        class="flex-wrap"
      >
        <VCol
          cols="auto"
          class="d-flex"
        >
          <template
            v-for="(item, index) in tagItems"
            :key="index"
          >
            <LabelledValue
              v-if="item.value"
              :label="item.label"
              class="transponder-info__item mr-4 line-height-1"
            >
              <template #default>
                <span class="transponder-info__item-value text-body-1 text-no-wrap">{{ item.value }}</span>
              </template>
            </LabelledValue>
          </template>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script>
import LabelledValue from '@/components/base/LabelledValue.vue';

export default {
  components: { LabelledValue },
  props: {
    transponder: {
      type: Object,
      required: true,
      default: () => ({})
    },
  },
  computed: {
    tagItems() {
      return [
        { label: 'Tag Type', value: this.transponder?.tagType },
        { label: 'Tag ID', value: this.transponder?.tagId },
        { label: 'Tag Sub ID', value: this.transponder?.tagSubId },
      ];
    },
  },
};
<\/script>

<style lang="scss" scoped>
.transponder-info {
  &__item {
    border-left: 5px solid rgb(var(--v-theme-meru-neutral));
    padding-left: 4px;
  }
}
:deep(.labelled-value__label) {
  white-space: nowrap;
}
</style>
`;export{n as default};
