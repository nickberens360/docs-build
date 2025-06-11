const t=`<template>
  <VNavigationDrawer
    v-model="isNavOpen"
    v-model:rail="isRailMode"
    color="surface-app-navigation"
  >
    <VList
      height="64"
      bg-color="surface-app-navigation-header"
    >
      <VListItem class="py-0">
        <template #prepend>
          <VAvatar
            color="surface-app-navigation-avatar"
            @click.stop="isRailMode = false"
          >
            <span
              v-if="!isRailMode"
            >{{ getInitials || 'MK' }}</span>
            <VIcon
              v-else
              size="16"
              class="cursor-pointer"
              icon="$next"
            />
          </VAvatar>
        </template>
        <VListItemTitle v-if="!isRailMode">
          {{ userFullName }}
        </VListItemTitle>

        <template #append>
          <VBtn
            v-if="!isRailMode"
            variant="text"
            icon="$prev"
            size="small"
            @click.stop="collapseNav()"
          />
        </template>
      </VListItem>
    </VList>

    <VDivider />

    <VList bg-color="surface-app-navigation">
      <VListItem
        v-for="item in displayedNavItems"
        :key="item.title"
        link
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
      />
    </VList>
    <template #append>
      <VList bg-color="surface-app-navigation-footer">
        <VListItem
          prepend-icon="$arrowRightFromBracket"
          title="Log Out"
          @click="handleLogout()"
        />
      </VList>
    </template>
  </VNavigationDrawer>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      env: 'production',
      navItems: [
        {
          title: 'Shipments',
          icon: '$truck',
          status: 'production',
          to: {
            name: 'shipments',
            query: { status: 'partial' }
          }
        },
        {
          title: 'Cycle Count - Kiosk',
          icon: '$scanner',
          status: 'production',
          to: { name: 'cycleCountKiosks' }
        },
        {
          title: 'Cycle Count - Trunk',
          icon: '$scannerKeyboard',
          status: 'production',
          to: { name: 'cycleCountTrunk' }
        },
        {
          title: 'Kiosk Images',
          icon: '$image',
          status: 'production',
          to: { name: 'kioskImages' }
        },
        {
          title: 'Service Route Planner',
          icon: '$route',
          status: 'production',
          to: { name: 'serviceRoutePlanner' }
        },
        {
          title: 'Manage Pricing',
          icon: '$dollarSignLight',
          status: 'production',
          to: { name: 'pricingModelIndex' },
          permission: 'EditPricing'
        },
        {
          title: 'Territory Management',
          icon: '$sitemap',
          status: 'production',
          to: { name: 'territoryManagement' },
          permission: 'EditInventory'
        },
        {
          title: 'Manage Designs',
          icon: '$brush',
          status: 'production',
          to: { name: 'manageDesigns' }
        },
        {
          title: 'Order Management',
          icon: '$boxDollar',
          status: 'production',
          to: { name: 'orderManagement' }
        },
        {
          title: 'Fulfillment',
          icon: '$vuetify.icons.handHoldingBox',
          permission: 'FulfillOrders',
          status: 'production',
          to: { name: 'fulfillmentIndex' }
        },
        {
          title: 'Kiosks',
          icon: '$kioskZoomLight',
          status: 'production',
          to: { name: 'kioskIndex' },
          permission: 'ViewKiosks'
        },
        {
          title: 'Foxy Docs',
          icon: '$vuetify.icons.solidStar',
          status: import.meta.env.VITE_ENABLE_COMPONENT_DOCS === 'true' ? 'production' : 'development',
          to: { name: 'componentDocs' }
        },
      ],
    };
  },
  computed: {
    ...mapState(['user']),
    ...mapState('app', ['navDrawer']),
    ...mapGetters({
      userFullName: 'user/fullName'
    }),
    isNavOpen: {
      get() {
        return this.navDrawer.isShown;
      },
      set(isNavOpen) {
        this.$store.commit('app/setNavDrawer', { isShown : isNavOpen });
      }
    },
    isRailMode: {
      get() {
        return this.navDrawer.isRailMode;
      },
      set(isRailMode) {
        this.$store.commit('app/setNavDrawer', { isRailMode });
      }
    },
    getInitials() {
      let initials = this.userFullName.match(/\\b\\w/g) || [];

      initials = (
        (initials.shift() || '') + (initials.pop() || '')
      ).toUpperCase();

      return initials;
    },
    displayedNavItems() {
      return this.navItems.filter((navItem) => {
        const isAllowedForEnv = this.env === 'development' || navItem.status === 'production';
        const isAllowedByPermissions = !navItem.permission || this.$store.getters['user/checkUserPermissions'](navItem.permission);
        return isAllowedForEnv && isAllowedByPermissions;
      });
    }
  },
  created() {
    this.env = import.meta.env.PROD ? 'production' : 'development';
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('user/logout');
    },
    collapseNav() {
      if (this.$vuetify.display.mdAndDown) {
        this.isNavOpen = false;
      } else {
        this.isRailMode = true;
      }
    }
  }
};
<\/script>
`;export{t as default};
