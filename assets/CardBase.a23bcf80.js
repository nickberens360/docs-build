const n=`<template>
  <VCard
    class="pa-2"
    v-bind="$attrs"
  >
    <VCardTitle
      v-if="$slots.cardTitle"
    >
      <slot name="cardTitle" />
    </VCardTitle>

    <div v-if="$slots.cardTitleAlt">
      <slot name="cardTitleAlt" />
    </div>

    <VCardText
      v-if="$slots.cardContent"
    >
      <slot name="cardContent" />
    </VCardText>

    <VCardActions
      v-if="$slots.cardActions"
      class="d-block pt-2"
    >
      <slot name="cardActions" />
    </VCardActions>
  </VCard>
</template>
`;export{n as default};
