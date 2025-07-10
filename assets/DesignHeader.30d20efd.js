const n=`<template>
  <VContainer class="design-header">
    <VRow class="align-center bg-surface-light px-2">
      <VCol
        cols="12"
        sm="9"
      >
        <!-- Car Key -->
        <div
          v-if="isCarKey"
          class="d-flex align-center"
        >
          <div>
            <div class="text-subtitle-1">
              SKU: {{ design.skus[0].sku }}
            </div>
            <div class="text-subtitle-1">
              Hillman SKU: {{ design.carKeyDesign.hillmanSku }}
            </div>
          </div>
          <VDivider
            class="mx-4"
            vertical
          />
          <div>
            <VCheckbox
              v-model="blacklisted"
              label="Blacklisted"
              class="mr-4"
              hide-details
            >
              <template #append>
                <VTooltip location="top">
                  <template #activator="{ props }">
                    <VIcon
                      v-bind="props"
                      class="ml-n3"
                      size="18"
                    >
                      $questionCircle
                    </VIcon>
                  </template>
                  <span>These keys are included in the catalog sent to the kiosk but cannot be sold</span>
                </VTooltip>
              </template>
            </VCheckbox>
          </div>
          <div>
            <VCheckbox
              v-model="deprecated"
              label="Deprecated"
              hide-details
            >
              <template #append>
                <VTooltip location="top">
                  <template #activator="{ props }">
                    <VIcon
                      v-bind="props"
                      class="ml-n3"
                      size="18"
                    >
                      $questionCircle
                    </VIcon>
                  </template>
                  <span>These keys are not in the catalog that is sent to the kiosk</span>
                </VTooltip>
              </template>
            </VCheckbox>
          </div>
        </div>

        <!-- Other -->
        <div v-else>
          <VForm
            v-if="isNew || isEditing"
            ref="name"
          >
            <VTextField
              v-model="englishName"
              label="Name"
              :rules="[required]"
              @update:model-value="emitValidationStatus"
            />
          </VForm>
          <div
            v-else
            class="text-h6"
          >
            {{ englishName }}
            <VTooltip location="bottom">
              <template #activator="{ props }">
                <VBtn
                  v-bind="props"
                  class="ml-1"
                  icon
                  style="vertical-align: sub"
                  @click="isEditing = true"
                >
                  <VIcon>$edit</VIcon>
                </VBtn>
              </template>
              <span>Edit Name</span>
            </VTooltip>
          </div>
        </div>
      </VCol>

      <VCol
        cols="12"
        sm="3"
      >
        <VForm
          v-if="!existsInDatabase"
          ref="designCode"
        >
          <VTextField
            v-model="designCode"
            label="Design Code"
            :rules="[required, designCodeUnique, designCodeFormat]"
            @update:model-value="emitValidationStatus"
          />
        </VForm>
        <div
          v-else
          class="text-subtitle-1 text-left text-md-right"
        >
          Design Code: {{ design.designCode }}
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { required, designCodeFormat } from '@/utils/validationMethods';

export default {
  props: {
    isNew: Boolean,
    design: {
      type: Object,
      default: () => ({})
    },
    existsInDatabase: Boolean,
    existingDesignCodes: {
      type: Array,
      default: () => []
    },
  },
  emits: ['input', 'update-design-code', 'update-blacklisted', 'update-deprecated'],
  data: () => ({
    isEditing: false,
    valid: {
      name: false,
      designCode: false
    }
  }),
  computed: {
    isCarKey() {
      return this.design.productClass === 'CK';
    },
    designCode: {
      get() {
        return this.design.designCode;
      },
      set(newVal) {
        this.$emit('update-design-code', newVal.toUpperCase());
      }
    },
    englishName: {
      get() {
        return this.design.names.find(n => n.locale === 'en').name;
      },
      set(newValue) {
        this.design.names.find(n => n.locale === 'en').name = newValue;
      },
    },
    blacklisted: {
      get() {
        return this.design.carKeyDesign.blacklisted;
      },
      set(newValue) {
        this.$emit('update-blacklisted', newValue);
      }
    },
    deprecated: {
      get() {
        return this.design.skus[0].deprecated;
      },
      set(newValue) {
        this.$emit('update-deprecated', newValue);
      }
    },
  },
  watch: {
    valid: {
      handler: 'emitValidationStatus',
      deep: true,
    },
  },
  methods: {
    designCodeFormat,
    required,
    emitValidationStatus() {
      this.$emit('input', this.validate());
    },
    designCodeUnique(code) {
      return code === this.initialDesignCode || !this.existingDesignCodes.includes(code) || 'can\\'t use existing design code';
    },
    validate() {
      return Object.values(this.$refs).reduce(async (acc, cv) => {
        const { valid } = await cv.validate();
        return !cv || (valid && acc);
      }, true);
    }
  },
};
<\/script>
`;export{n as default};
