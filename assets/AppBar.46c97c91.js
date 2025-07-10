const n=`<template>
  <div class="app-bar">
    <VAppBar
      color="surface-app-bar"
      :elevation="1"
      height="64"
    >
      <VToolbarTitle class="font-weight-regular ml-0 ml-lg-3">
        <div class="d-flex align-center">
          <VBtn
            v-if="showMenuIcon"
            theme="dark"
            icon
            @click.stop="toggleNavDrawer()"
          >
            <VIcon icon="$bars" />
          </VBtn>
          <span :class="{ 'pl-3': !showMenuIcon }">{{ appBarTitle || $route.name }}</span>
        </div>
      </VToolbarTitle>

      <VSpacer />
    </VAppBar>
  </div>
</template>

<script>

import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapGetters('app', {
      appBarTitle: 'getAppBarTitle',
    }),
    ...mapState('app', ['navDrawer']),
    showMenuIcon() {
      return this.$vuetify.display.mdAndDown && this.navDrawer.isAvailable;
    }
  },
  methods: {
    toggleNavDrawer() {
      this.$store.commit('app/setNavDrawer', { isShown : !this.navDrawer.isShown });
    },
  },
};
<\/script>

<style scoped lang="scss">

</style>
`;export{n as default};
