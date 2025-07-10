const n=`<template>
  <div
    v-resize.quiet="onResize"
    class="scan-graph-car-key"
  >
    <div class="scan-graph-car-key__side-selection">
      <VSelect
        v-model="dragTarget"
        class="flex-grow-0"
        :items="['tip', 'shoulder']"
        label="Drag Target"
        width="100"
      />
      <VSelect
        v-model="keySide"
        class="flex-grow-0 ml-6"
        :items="['left', 'right']"
        label="Key Side"
        width="100"
        @update:model-value="resetOffsets"
      />
      <VSelect
        v-if="icCardOptions.length"
        v-model="currentIcCard"
        class="flex-grow-0 ml-6"
        :items="icCardOptions"
        item-title="cardNumber"
        label="IC Card"
        return-object
        width="100"
      />
    </div>
    <div
      v-if="isLoadingScanData || !scanData"
      class="scan-graph-car-key__loader-container"
    >
      <VSkeletonLoader
        type="ossein"
        :loading="isLoadingScanData"
        class="scan-graph-car-key__loader"
      >
        <div class="w-100 text-center">
          Failed to load scan data
        </div>
      </VSkeletonLoader>
    </div>
    <div
      v-else
      class="scan-graph-car-key__chart-container"
      @mousedown="startDrag"
      @mousemove="handleMouseDrag"
      @mouseleave="endDrag"
      @mouseup="endDrag"
    >
      <img
        class="scan-graph-car-key__key-image"
        :src="scanData[keySide].images.front"
        @load="setGraphAxes"
      >
      <LineChart
        ref="lineChart"
        class="scan-graph-car-key__line-chart"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script>
import orderApiService from '@/services/orderAPIService';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line as LineChart } from 'vue-chartjs';
import chartjsPluginAnnotation from 'chartjs-plugin-annotation';
import { debounce } from 'lodash-es';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  chartjsPluginAnnotation
);

export default {
  components: {
    LineChart
  },
  props: {
    icCards: {
      type: Array,
      default: () => [],
      required: false,
    },
    preferredCards: {
      type: Array,
      default: () => [],
      required: false,
    },
    scanId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    chartInnerHeight: '200px',
    chartInnerWidth: '500px',
    chartInnerLeft: '14px',
    chartInnerTop: '0px',
    dragTarget: 'tip',
    imageHeight: 574, // default image height
    imageWidth: 1937, // default image width
    isLoadingScanData: false,
    isTrackingMouse: false,
    keySide: 'left',
    scanData: undefined,
    selectedIcCard: undefined,
    shoulderOffset: 0,
    tipOffset: 0,
  }),
  computed: {
    chartData() {
      return {
        labels: this.scanData[this.keySide].profile.x,
        datasets: [{
          data: this.scanData[this.keySide].profile.y
        }]
      };
    },
    chartOptions() {
      const icCardAnnotations = this.currentIcCard.axes.map(axis => this.formIcCardAnnotations(axis)).flat();
      return {
        onResize: this.onChartResize,
        aspectRatio: this.imageWidth / this.imageHeight,
        elements: {
          line: {
            borderWidth: 3,
            borderColor: '#00bcd4',
            tension: 0
          },
          point: {
            pointStyle: false
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: this.imageWidth,
            ticks: {
              stepSize: 2
            }
          },
          y: {
            min: 0,
            max: this.imageHeight,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          annotation: {
            annotations: [
              {
                id: 'shoulder_pos',
                type: 'line',
                scaleID: 'x',
                value: this.shoulderPosition,
                endValue: this.shoulderPosition,
                borderColor: 'red',
                label: {
                  position: 'start',
                  content: 'Shoulder',
                  display: true
                }
              },
              {
                id: 'end_of_key_pos',
                type: 'line',
                scaleID: 'x',
                value: this.tipPosition,
                endValue: this.tipPosition,
                borderColor: 'red',
                label: {
                  position: 'start',
                  content: 'Tip',
                  display: true
                }
              },
              ...icCardAnnotations
            ]
          }
        }
      };
    },
    currentIcCard: {
      get() {
        return this.selectedIcCard || this.icCardOptions[0];
      },
      set(value) {
        this.selectedIcCard = value;
      }
    },
    icCardOptions() {
      let cards = [...this.preferredCards];
      this.icCards.forEach(card => {
        let foundCard = cards.find(({ cardNumber }) => cardNumber === card.cardNumber );
        if (!foundCard) {
          cards.push(card);
        }
      });
      return cards;
    },
    shoulderPosition() {
      return this.shoulderOffset + Math.max(this.scanData[this.keySide].datums.shoulder, 0);
    },
    tipPosition() {
      return this.tipOffset + this.scanData[this.keySide].datums.tip;
    },
  },
  mounted() {
    this.fetchScan();
  },
  methods: {
    async fetchScan() {
      this.isLoadingScanData = true;
      this.scanData = undefined;
      try {
        const { data } = await orderApiService.fetchAlignedScans(this.scanId);
        this.scanData = data;
      } catch (error) {
        console.log(error);
      }
      this.isLoadingScanData = false;
    },
    formIcCardAnnotations(icCardAxis) {
      let offsetPoint = 'bottom';
      if (icCardAxis.verticalDatum === 'left') {
        offsetPoint = 'top';
      } else if (icCardAxis.verticalDatum === 'center') {
        offsetPoint = 'centerLine';
      }
      let depthOffset = this.scanData[this.keySide].datums[offsetPoint];
      let isTipOrigin = this.currentIcCard.horizontalDatum === 'tip';
      let bittingOffset = isTipOrigin ? this.tipPosition : this.shoulderPosition;

      return  [...icCardAxis.positions.map((position, index) => ({
        id: \`depth_pos_\${index + 1}\`,
        type: 'line',
        borderColor: 'red',
        borderWidth: 1,
        xMax: isTipOrigin ? bittingOffset - position : bittingOffset + position,
        xMin: isTipOrigin ? bittingOffset - position : bittingOffset + position,
        xScaleID: 'x',
        yMin: this.scanData[this.keySide].datums.top + 45,
        yMax: Math.min(...Object.values(icCardAxis.depths)) + depthOffset,
        yScaleID: 'y',
        label: {
          position: 'start',
          content: icCardAxis.directCode?.split('')[index] || '',
          display: true
        }
      })),
      ...Object.entries(icCardAxis.depths).map(([label, depth]) => ({
        id: \`depths_\${label}\`,
        type: 'line',
        borderColor: 'red',
        borderWidth: 1,
        xMax: Math.min(this.tipPosition + 25, this.imageWidth),
        xMin: 0,
        xScaleID: 'x',
        yMin: depth + depthOffset,
        yMax: depth + depthOffset,
        yScaleID: 'y',
        label: {
          position: 'end',
          content: label,
          display: true,
          backgroundColor: 'rgba(0, 0, 0, 0)',
        }
      }))];
    },
    endDrag() {
      this.isTrackingMouse = false;
    },
    startDrag() {
      this.isTrackingMouse = true;
    },
    resetOffsets() {
      this.tipOffset = 0;
      this.shoulderOffset = 0;
    },
    handleMouseDrag(event) {
      if (this.isTrackingMouse) {
        const chartPixelRatio = this.imageWidth / parseFloat(this.chartInnerWidth);
        const offsetAdjustment = event.movementX * chartPixelRatio;
        if (this.dragTarget === 'tip') {
          this.tipOffset += offsetAdjustment;
        } else if (this.dragTarget === 'shoulder') {
          this.shoulderOffset += offsetAdjustment;
        }
      }
    },
    onChartResize(chart) {
      if (chart.chartArea) {
        this.$nextTick(() => {
          this.chartInnerHeight = chart.chartArea.height + 'px';
          this.chartInnerWidth = chart.chartArea.width + 'px';
          this.chartInnerLeft = chart.chartArea.left + 'px';
          this.chartInnerTop = chart.chartArea.top + 'px';
        });
      }
    },
    onResize: debounce(function() {
      this.$refs.lineChart?.chart?.resize();
    }, 300),
    setGraphAxes() {
      let img = new Image();
      img.src = this.scanData[this.keySide].images.front;

      this.imageWidth = img.width;
      this.imageHeight = img.height;
    },
  }

};
<\/script>

<style lang="scss" scoped>
.scan-graph-car-key {
  &__side-selection {
    display: flex;
    justify-content: end;
    padding: 10px 20px 0 0;
  }
  &__loader-container {
    height: 285px;
  }
  &__loader {
    height: 100%;
    width: 100%;
  }
  &__chart-container {
    display: flex;
    position: relative;
  }
  &__key-image {
    position: absolute;
    height: v-bind(chartInnerHeight);
    width: v-bind(chartInnerWidth);
    left: v-bind(chartInnerLeft);
    top: v-bind(chartInnerTop);
  }
  &__line-chart {
    z-index: 1;
  }
}
</style>
`;export{n as default};
