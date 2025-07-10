const n=`<template>
  <VCol
    class="search-form-input"
    v-bind="colProps"
    :class="{ 'search-form-input--menu-active': isSelectMenuActive }"
  >
    <slot
      name="default"
      :input-type="inputType"
      :model-value="inputModel"
    >
      <Component
        :is="inputType"
        v-if="isMultiSelect"
        v-bind="mergeProps"
        ref="multiSelectInput"
        v-model="inputModel"
        v-model:menu="isSelectMenuActive"
        @click:clear="$refs.multiSelectInput.blur()"
      >
        <template #selection="{item, index}">
          <template v-if="index === 0">
            <span
              class="text-truncate"
              :class="{'d-none': isSearchingOptions}"
            >
              {{ item.title }}
            </span>
            <span
              v-if="showMultiSelectCount"
              class="search-form-input__selection-count text-caption-3 bg-info font-weight-bold px-3"
            >
              {{ multiSelectCountText }}
            </span>
          </template>
        </template>
      </Component>
      <Component
        :is="inputType"
        v-else
        v-bind="mergeProps"
        v-model="inputModel"
      >
        <template
          v-for="(_, name) in $slots"
          #[name]="slotData"
          :key="name"
        >
          <slot
            v-if="name"
            :name="name"
            v-bind="slotData"
          />
        </template>
      </Component>
    </slot>
  </VCol>
</template>

<script>
import DatePicker from '@/components/base/DatePicker.vue';
import ResultsLimitMenu from '@/components/base/ResultsLimitMenu.vue';
import {
  VTextField,
  VAutocomplete,
  VCheckbox,
  VRadio,
  VSelect,
  VTextarea,
  VDatePicker,
  VSwitch,
  VSlider,
  VFileInput,
  VCombobox,
  VRadioGroup,
  VRangeSlider,
} from 'vuetify/components';
export default {
  components: {
    ResultsLimitMenu,
    DatePicker,
    VTextField,
    VAutocomplete,
    VCheckbox,
    VRadio,
    VSelect,
    VTextarea,
    VDatePicker,
    VSwitch,
    VSlider,
    VFileInput,
    VCombobox,
    VRadioGroup,
    VRangeSlider,
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Array, Boolean, Object],
      required: false,
      default: undefined,
    },
    colProps: {
      type: Object,
      default: () => ({cols: 'auto'}),
    },
    inputType: {
      type: String,
      required: true,
    },
  },
  emits: ['update:model-value'],
  data: () => ({
    defaultInputProps: {
      variant: 'solo',
      density: 'compact',
      hideDetails: 'auto',
      clearable: true,
    },
    isSelectMenuActive: false
  }),
  computed: {
    inputModel: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:model-value', value);
      },
    },
    mergeProps() {
      return { ...this.defaultInputProps, ...this.$attrs };
    },
    isMultiSelect() {
      return 'multiple' in this.$attrs && (this.inputType === 'VAutocomplete' || this.inputType === 'VSelect');
    },
    isSearchingOptions() {
      return this.inputType === 'VAutocomplete' && this.isSelectMenuActive;
    },
    showMultiSelectCount() {
      return this.isMultiSelect && (this.modelValue?.length > 1 || this.isSearchingOptions);
    },
    multiSelectCountText() {
      return this.isSearchingOptions ? \`\${this.modelValue?.length} selected\` : \`+\${this.modelValue.length - 1} more\`;
    }
  },
  watch: {
    modelValue(value) {
      this.handleMaxAttrs(value);
    },
  },
  methods: {
    handleMaxAttrs(value) {
      this.$nextTick(() => {
        if (this.$attrs?.max && parseInt(value) > this.$attrs.max) {
          this.$emit('update:model-value', this.$attrs.max);
        }
        if (this.$attrs?.maxlength && value?.length > this.$attrs.maxlength) {
          this.$emit('update:model-value', value.slice(0, this.$attrs.maxlength));
        }
      });
    },
  },
};
<\/script>

<style lang="scss" scoped>
.search-form-input {
  flex-grow: 1;
  display: flex;
  align-items: center;

  &:not(.search-form-input--menu-active) {
    :deep(.v-autocomplete .v-field__input input) {
      // hide the search input when menu is closed
      position: absolute;
      opacity: 0;
    }
  }
  :deep(.v-icon) {
    color: rgb(var(--v-theme-primary-lighten-2));
  }
  :deep(.v-text-field .v-label),
  :deep(.v-field-label--floating) {
    --v-field-label-scale: 0.8125em;
  }
  &__selection-count {
    position: absolute;
    display: block;
    top: -8px;
    right: -53px;
    border-radius: 100px;
  }
  :deep(.v-radio .v-label) {
    margin-left: 4px;
  }
}
</style>

`;export{n as default};
