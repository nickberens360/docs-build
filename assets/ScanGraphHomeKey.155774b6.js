const n=`<template>
  <div
    v-resize.quiet="onResize"
    class="scan-graph-home-key"
    :class="{
      'scan-graph-home-key--loading': isLoadingScanData,
      'scan-graph-home-key--error': !isLoadingScanData && !scanData
    }"
  >
    <VSkeletonLoader
      v-if="isLoadingScanData || !scanData"
      type="ossein"
      :loading="isLoadingScanData"
      class="scan-graph-home-key__loader"
    >
      <div class="w-100 text-center">
        Failed to load scan data
      </div>
    </VSkeletonLoader>
    <LineChart
      v-else
      ref="lineChart"
      :data="chartData"
      :options="chartOptions"
      class="scan-graph-home-key__line-chart"
    />
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
import { debounce } from 'lodash-es';
import { Line as LineChart } from 'vue-chartjs';
import chartjsPluginAnnotation from 'chartjs-plugin-annotation';

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
    scanId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    isLoadingScanData: false,
    scanData: {
      shoulder_pos: undefined,
      end_of_key_pos: undefined,
      y: [],
      height: [],
      maxHeight: 0,
      maxY: 0
    },
  }),
  computed: {
    chartData() {
      let labels = [];
      let datasets = [];
      if (this.scanData) {
        labels = this.scanData.y;
        datasets.push({
          label: 'Height',
          data: this.scanData.height
        });
      }
      return {
        labels,
        datasets
      };
    },
    chartOptions() {
      return {
        layout: {
          padding: 10,
        },
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
            max: this.scanData.maxY + 0.02,
            ticks: {
              stepSize: 0.01
            }
          },
          y: {
            min: 0,
            max: this.scanData.maxHeight + .05,
            ticks: {
              stepSize: 0.01
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: this.scanId
          },
          tooltip: {
            mode: 'index',
            intersect: true
          },
          annotation: {
            annotations: [
              {
                id: 'shoulder_pos',
                type: 'line',
                scaleID: 'x',
                value: this.scanData.shoulder_pos,
                endValue: this.scanData.shoulder_pos,
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
                value: this.scanData.end_of_key_pos,
                endValue: this.scanData.end_of_key_pos,
                borderColor: 'red',
                label: {
                  position: 'start',
                  content: 'Tip',
                  display: true
                }
              }
            ]
          }
        }
      };
    }
  },
  mounted() {
    this.fetchScan();
  },
  methods: {
    async fetchScan() {
      this.isLoadingScanData = true;
      this.scanData = undefined;
      try {
        const { data: textResponse } = await orderApiService.fetchKeyProfile(this.scanId);
        this.scanData = this.parseScanData(textResponse);
      } catch (error) {
        console.log(error);
      }
      this.isLoadingScanData = false;
    },
    parseScanData(rawScanData) {
      let scanData = {
        shoulder_pos: undefined,
        end_of_key_pos: undefined,
        y: [],
        height: [],
        maxHeight: 0,
        maxY: 0
      };
      const [metadata, scanSignals] = rawScanData.includes('SIGNALS') ? rawScanData.split('SIGNALS\\n') : rawScanData.split('POINTS\\n');
      metadata.split('\\n').forEach((row) => {
        const [key, data] = row.split(': ');
        if (['shoulder_pos', 'end_of_key_pos'].includes(key)) {
          scanData[key] = parseFloat(data);
        }
      });
      const scanSignalRows = scanSignals.split('\\n').map((row) => row.split(' '));
      const yIndex = scanSignalRows[0].indexOf('y');
      const heightIndex = scanSignalRows[0].indexOf('height');
      scanSignalRows.slice(1).forEach((row) => {
        const ySignal = parseFloat(row[yIndex]);
        const heightSignal = parseFloat(row[heightIndex]);
        scanData.y.push(ySignal);
        scanData.height.push(heightSignal);
        if (ySignal > scanData.maxY) {
          scanData.maxY = ySignal;
        }
        if (heightSignal > scanData.maxHeight) {
          scanData.maxHeight = heightSignal;
        }
      });

      return scanData;
    },
    onResize: debounce(function() {
      this.$refs.lineChart?.chart?.resize();
    }, 300)
  }
};
<\/script>
<style lang="scss" scoped>
.scan-graph-home-key {
  width: 100%;
  position: relative;
  &--loading,
  &--error {
    padding-top: 50%;
  }
  &__loader {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}
</style>
`;export{n as default};
