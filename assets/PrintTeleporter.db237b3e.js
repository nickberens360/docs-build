const n=`<template>
  <Teleport
    to="body"
    :disabled="!hideVApplicationOnPrint"
  >
    <slot
      name="default"
      :is-printing="hideVApplicationOnPrint"
      :print="print"
    />
  </Teleport>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  emits: ['printing-complete'],
  exposes: ['print'],
  computed: {
    ...mapState('app', ['hideVApplicationOnPrint']),
  },
  mounted() {
    window.addEventListener('afterprint', this.donePrinting);
  },
  beforeUnmount() {
    window.removeEventListener('afterprint', this.donePrinting);
  },
  methods: {
    ...mapMutations('app', ['setHideVApplicationOnPrint']),
    print() {
      this.setHideVApplicationOnPrint(true);
      this.$nextTick(() => {
        window.print();
      });
    },
    donePrinting() {
      this.setHideVApplicationOnPrint(false);
      this.$emit('printing-complete');
    },
  },
};
<\/script>

<style
  lang="scss"
  scoped
>

</style>`;export{n as default};
