const n=`<template>
  <div
    :class="{ 'bg-primary-lighten-3': !grade && !averageDailyRevenue }"
    class="d-flex grade-tag align-center text-center"
  >
    <div
      v-if="grade"
      class="grade-tag__grade "
      :class="gradeColor"
    >
      {{ grade }}
    </div>
    <div
      v-if="averageDailyRevenue"
      class="grade-tag__amount px-4"
      :class="{ 'bg-primary-lighten-4': grade }"
    >
      <div class="grade-tag__amount-label">
        {{ $filters.currency(averageDailyRevenue) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    grade: {
      type: String,
      required: false,
      default: '',
      validator: (value) => ['A', 'B', 'C', 'D', ''].includes(value),
    },
    averageDailyRevenue: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  computed: {
    gradeColor() {
      let color = undefined;
      let grade = this.grade;
      switch (grade?.toLowerCase()) {
        case 'a':
          color = 'bg-accent';
          break;
        case 'b':
          color = 'bg-accent-darken-2';
          break;
        case 'c':
          color = 'bg-accent-darken-3';
          break;
        case 'd':
          color = 'bg-accent-darken-4';
          break;
      }
      return color;
    },
  },
};
<\/script>

<style lang="scss" scoped>
  .grade-tag {
    height: 32px;
    &__grade {
      flex: 1 0 32px;
      max-width: 32px;
    }
    &__amount {
      flex: 1;
    }
    &__amount-label {
      color: rgba(var(--v-secondary-darken-3));
    }
    &__amount, &__grade {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>`;export{n as default};
