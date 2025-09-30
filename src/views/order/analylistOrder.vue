<template>
    <div style="display: flex;">
        <div ref="myChartOne" class="myChart"></div>
        <div ref="myChartTwo" class="myChart"></div>
    </div>
    <div ref="myChartBar" class="Chart"></div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus';
import { useCinemaStore } from '@/stores/counter';
import { pieOrderOneAPI, cinemaCountAPI, pieOrderTwoAPI, barOrderAPI } from '@/api/dao'
import * as echarts from 'echarts';


/* 图1--------------------------------- */
let pieOne = ref<Array<pie>>([])

const pieOrderOne = () => {
    pieOrderOneAPI().then(res => {
        pieOne.value = res.data.data
        lineOne()
    })
}
pieOrderOne()

let myChartOne = ref<HTMLDivElement | undefined>()
let chartOne: any = null
const lineOne = () => {
    chartOne = echarts.init(myChartOne.value, 'vintage')
    chartOne.setOption({
        title: {
            text: '电影数量',
            left: 'center'
        },
        
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: pieOne.value,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    })
}


/* 图2--------------------------------- */
let pieTwo = ref<Array<pie>>([])

const pieOrderTwo = () => {
    pieOrderTwoAPI().then(res => {
        pieTwo.value = res.data.data
        lineTwo()
    })
}
pieOrderTwo()

let myChartTwo = ref<HTMLDivElement | undefined>()
let chartTwo: any = null
const lineTwo = () => {
    chartTwo = echarts.init(myChartTwo.value, 'vintage')
    chartTwo.setOption({
        title: {
            text: '用户观影数量',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: pieTwo.value
            }
        ]
    })
}

/* 柱状图 */
let bar = ref<Array<pie>>([])

const barOrder = () => {
    barOrderAPI().then(res => {
        bar.value = res.data.data
        lineBar()
    })
}
barOrder()

let myChartBar = ref<HTMLDivElement | undefined>()
let chartBar: any = null
const lineBar = () => {
    chartBar = echarts.init(myChartBar.value, 'vintage')
    chartBar.setOption({
        title: {
            text: '每天观影量',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: bar.value.map(x => x.name),
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Direct',
                type: 'bar',
                barWidth: '60%',
                data: bar.value.map(x => x.value)
            }
        ]
    })
}




</script>

<style scoped>
.myChart {
    width: 40vw;
    margin-top: 20px;
    height: 40vh;
    box-shadow: 20px 20px 20px gray;
}

.Chart {
    margin-top: 20px;
    height: 40vh;
    box-shadow: 20px 20px 20px gray;
}
</style>