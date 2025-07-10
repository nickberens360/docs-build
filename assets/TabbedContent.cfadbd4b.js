const n=`<template>
  <div>
    <nav class="bg-surface-variant">
      <VMenu
        v-if="$vuetify.display[mobileBreakpoint] && !displayTabsOnly"
        :disabled="loading"
        location="bottom start"
      >
        <template #activator="{ props }">
          <div
            class="ml-4"
            v-bind="props"
          >
            {{ selectedTitle }}
            <VBtn
              color="primary"
              icon="$caretDown"
              variant="text"
            />
          </div>
        </template>
        <VList v-model="activeTab">
          <template
            v-for="(tab, i) in tabs"
            :key="i"
          >
            <VListItem
              exact
              :to="tab.route"
              @click="updateActiveTab(tab[itemValue])"
            >
              <template #prepend>
                <VIcon
                  v-if="tab.icon"
                  start
                  size="small"
                >
                  $vuetify.icons.{{ tab.icon }}
                </VIcon>
              </template>
              <VListItemTitle>
                {{ tab[itemTitle] }}
              </VListItemTitle>
            </VListItem>
          </template>
        </VList>
      </VMenu>
      <VTabs
        v-else
        v-model="activeTab"
        :disabled="loading"
        show-arrows
        color="primary"
        @update:model-value="updateActiveTab($event)"
      >
        <template
          v-for="(tab, i) in tabs"
          :key="i"
        >
          <slot
            :name="\`tab.\${tab[itemValue]}\`"
            :tab="tab"
            :update-active-tab="updateActiveTab"
          >
            <VTab
              :value="tab[itemValue]"
              color="primary"
              :loading="loading"
              exact
            >
              <template #prepend>
                <VIcon
                  v-if="tab.icon"
                  start
                  size="small"
                >
                  $vuetify.icons.{{ tab.icon }}
                </VIcon>
              </template>
              {{ tab[itemTitle] }}
            </VTab>
          </slot>
        </template>
      </VTabs>
    </nav>
    <slot name="before-content" />
    <VTabsWindow :model-value="activeTab">
      <template
        v-for="(tab, i) in tabs"
        :key="i"
      >
        <VTabsWindowItem :value="tab[itemValue]">
          <slot
            :name="\`content.\${tab[itemValue]}\`"
          />
        </VTabsWindowItem>
      </template>
    </VTabsWindow>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    useQueryParam: {
      type: Boolean,
      required: false,
      default: false,
    },
    queryParamKey: {
      type: String,
      required: false,
      default: 'tab',
    },
    itemTitle: {
      type: String,
      required: false,
      default: 'title',
    },
    itemValue: {
      type: String,
      required: false,
      default: 'value',
    },
    loading: {
      type: Boolean,
    },
    displayTabsOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    mobileBreakpoint: {
      type: String,
      required: false,
      default: 'smAndDown',
    },
  },
  emits: ['tab-change'],
  data() {
    return {
      activeTab: this.tabs[0]?.[this.itemValue],
    };
  },
  computed: {
    selectedTitle() {
      return this.tabs.find(tab => tab[this.itemValue] === this.activeTab)?.[this.itemTitle] || '';
    },
  },
  mounted() {
    this.initializeTabs();
  },
  methods: {
    initializeTabs() {
      if (this.$route.query[this.queryParamKey]){
        this.updateActiveTab(this.$route.query[this.queryParamKey]);
      } else {
        this.updateActiveTab(this.tabs[0]?.[this.itemValue]);
      }
    },
    updateActiveTab(tabValue) {
      this.activeTab = tabValue;
      this.$emit('tab-change', tabValue);
      if (this.useQueryParam) {
        this.updateActiveTabAndQueryParam(tabValue);
      }
    },
    updateActiveTabAndQueryParam(tabValue) {
      const currentQuery = { ...this.$route.query };
      currentQuery[this.queryParamKey] = tabValue;
      this.$router.push({ query: currentQuery });
    },
  },
};
<\/script>
`;export{n as default};
