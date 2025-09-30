<template>
    <div class="m">
        <div class="mm">
            <div>
                <el-button @click="addSessionLog">添加电影场次</el-button>
                <!-- <el-button @click="addCinemaLog">添加影厅</el-button> -->
            </div>
            <div ref="myChartC" class="myChart"></div>
        </div>
    </div>

    <!-- 添加影厅---------------------------------------- -->
    <!-- <el-dialog v-model="addCinemalog" title="添加影厅">
        <el-form :model="addCinema" :rules="addCinemaRules" ref="AddCinemaForm" status-icon size="default" inline
            label-width="auto" label-position="left">
            <el-form-item label="影厅名称" prop="name">
                <el-input v-model="name" autocomplete="off" />
            </el-form-item>

            <el-form-item prop="typeId" label="影厅类型">
                <el-select v-model="typeId" placeholder="影厅类型">
                    <el-option v-for="ctype in myCinemaStore.cinemaType" :key="ctype.id" :label="ctype.name"
                        :value="ctype.id"></el-option>
                </el-select>
            </el-form-item>
            <el-input-number v-model="x" :min="2" :max="9" />
            <el-input-number v-model="y" :min="2" :max="9" />
        </el-form>
        <div v-for="i in x" class="zuowei">
            <el-image v-for="j in y" src="https://mail-noob.oss-cn-beijing.aliyuncs.com/wx.png" /><br>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addCinemalog = false">取消</el-button>
                <el-button type="primary" @click="addCinemaMethod(AddCinemaForm)">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog> -->



    <!-- 添加电影场次---------------------------------------------------------- -->
    <el-dialog v-model="addSessionlog" title="添加电影场次">
        <el-form :model="addSession" :rules="addSessionRules" ref="AddSessionForm" status-icon size="default"
            label-width="auto" label-position="left">
            <el-form-item prop="venueId" label="影厅">
                <el-select v-model="venueId" placeholder="请选择影厅">
                    <el-option v-for="cinama in myCinemaStore.allcinema" :key="cinama.id" :label="cinama.name"
                        :value="cinama.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop="movieId" label="电影">
                <el-select v-model="movieId" placeholder="请选择电影">
                    <el-option v-for="movie in myCinemaStore.allMovie" :key="movie.id" :label="movie.name"
                        :value="movie.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开场时间" prop="startTime" class="time">
                <el-date-picker v-model="startTime" type="datetime" placeholder="请选择开始时间" format="YYYY-MM-DD HH:mm:ss"
                    date-format="MMM DD, YYYY" time-format="HH:mm" :disabled-date="disabledDateFn"
                    value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="票价" prop="money">
                <el-input-number v-model="money" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="addScenes(AddSessionForm)">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus';
import { useCinemaStore } from '@/stores/counter';
import {
    checkCinemaType, addTheater, addMovieSession, checkAllCinema, checkAllMovie,
    cinemaCountAPI
} from '@/api/dao'
import * as echarts from 'echarts';
import axios from 'axios'

let myCinemaStore = useCinemaStore()

let AddCinemaForm = ref<FormInstance | undefined>()


const addCinemalog = ref<boolean>(false)

const addCinema = reactive<addCinema>({
    name: '',
    typeId: '',
    x: 2,
    y: 2,
})
let { name, typeId, x, y } = { ...toRefs(addCinema) }


/* 查询影厅类型 */
const queryCinemaType = () => {
    checkCinemaType()
        .then(res => {
            myCinemaStore.cinemaType = res.data.data
        })
}
queryCinemaType()

/* 获得座位照片 */
/* const photo = () => {
    axios.post('http://db.etoak.com:9527/sysFile/fileUpload',{
        file:'../../assets/wx.png'
    }).then(res => {
        console.log(res)
    })   
}
photo() */

/* 添加影厅 -----------------------------------------------------*/

const addCinemaLog = () => {
    addCinemalog.value = true
    resetForm(AddCinemaForm.value)
}

/* 此函数用来重置表单 */
const resetForm = (formEl: FormInstance | undefined) => {
    /* 如果无法获取表单对象 返回 */
    if (!formEl) return
    /* 重置表单注意 每个字段必须设置了 prop 属性 */
    formEl.resetFields()
}


let addCinemaRules = reactive<FormRules<addCinema>>({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    typeId: [
        { required: true, message: '请选择影厅类型', trigger: 'change' }
    ]
})

const addCinemaMethod = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(valid => {
        if (valid) {
            addTheater(addCinema)
                .then(res => {
                    ElMessage({
                        type: res.data.code == 200 ? 'success' : 'error',
                        message: res.data.msg
                    })
                    addCinemalog.value = false
                    queryAllCinema()
                })
        }
    })
}

/* 添加电影场次----------------------------------------------------------- */

const addSessionLog = () => {
    addSessionlog.value = true
    resetForm(AddSessionForm.value)
}

const addSessionlog = ref(false)
const addSession = reactive<addSession>({
    venueId: '',
    movieId: '',
    money: 9.9,
    startTime: '',
})
let { venueId, movieId, money, startTime } = { ...toRefs(addSession) }

let AddSessionForm = ref<FormInstance | undefined>()

let addSessionRules = reactive<FormRules<addSession>>({
    venueId: [
        { required: true, message: '请输入名称', trigger: 'change' }
    ],
    movieId: [
        { required: true, message: '请选择影厅类型', trigger: 'change' }
    ],
    startTime: [
        { required: true, message: '请选择时间', trigger: 'change' }
    ]
})

/* 查询所有影厅 */
const queryAllCinema = () => {
    checkAllCinema()
        .then(res => {
            myCinemaStore.allcinema = res.data.data
        })
}
queryAllCinema()
/* 查询所有电影 */
const queryAllMovie = () => {
    checkAllMovie()
        .then(res => {
            myCinemaStore.allMovie = res.data.data
            myCinemaStore.allMovie = myCinemaStore.allMovie.filter(x =>
                x.flag === 1
            )
        })
}
queryAllMovie()


/* 添加电影场次 */
const addScenes = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(valid => {
        if (valid) {
            addMovieSession(addSession)
                .then(res => {
                    ElMessage({
                        type: res.data.code == 200 ? 'success' : 'error',
                        message: res.data.msg
                    })
                    addSessionlog.value = false
                })
        }
    })
}
/* 日期禁用 */
const disabledDateFn = (time: Date) => {
    if (time.getTime() < Date.now() - 8.64e7) {
        return true;
    } else {
        return false;
    }
}



/* 图--------------------------------- */
let counts = ref<Array<countDTO>>([])

const cinemaCount = () => {
    cinemaCountAPI().then(res => {
        counts.value = res.data.data
        lineC()
    })
}
cinemaCount()

let myChartC = ref<HTMLDivElement | undefined>()
let chartC: any = null
const lineC = () => {
    chartC = echarts.init(myChartC.value, 'vintage')
    chartC.setOption({
        title: {
            text: '影厅播放电影记录数',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: counts.value.map(x => x.name)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: counts.value.map(x => x.num),
                type: 'bar'
            }
        ]
    })
}










</script>

<style scoped>
.m {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    overflow: hidden;
    background-color: whitesmoke;
}

.mm {
    width: 70vw;
    height: 100%;
    background-color: whitesmoke;
}

.nn {
    height: 100%;
    margin-top: 10px;
    background-color: rgb(255, 255, 255);
    box-shadow: 5px 5px 5px rgb(92, 90, 90);
    padding: 20px;
}

.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 150px;
}

.el-input {
    width: 150px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.zuowei {
    display: flex;
    justify-content: center;
    align-items: center;
}

.time {
    margin-top: 15px;
}

.myChart {
    margin-top: 20px;
    height: 65vh;
    box-shadow: 20px 20px 20px gray;
}
</style>