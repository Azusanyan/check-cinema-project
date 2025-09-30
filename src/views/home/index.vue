<template>
    <el-header class="header" height="5vh">
        <h1 class="title">
            <img src="https://www.logosc.cn/oss/icons/2021/12/02/wfVSt-aPavSh0XR.png" class="logo">
            影厅影院管理系统
        </h1>
        <!-- <h1 class="title">欢迎回来</h1> -->
        <el-dropdown @command="handleCommand">
            <!-- 下拉菜单的标题 -->
            <span style="color: whitesmoke; display: flex; justify-content: space-around; align-items: center;">
                <el-icon>
                    <Tools />
                </el-icon>
                <span style="color: whitesmoke; margin: 0px 5px;">用户菜单</span>

                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item icon="Location" command="resetPass">我的信息</el-dropdown-item>
                    <el-dropdown-item icon="Location" command="myOrder">我的订单</el-dropdown-item>
                    <el-dropdown-item icon="Location" command="question">我的问题</el-dropdown-item>
                    <el-dropdown-item icon="Coordinate" command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </el-header>
    <el-row class="show">
        <el-col :span="1">
            <!-- 左边距 -->
        </el-col>
        <!-- 主体----------------------------------------- -->
        <el-col :span="18">
            <div>
                <el-card :body-style="{ padding: '0px', }">
                    <el-row :gutter="20" style="align-items: center;padding: 30px;">
                        <el-col :span="4" v-for="movie in allMovie" :key="movie.id">
                            <img :src="'http://localhost:8080/' + movie.posters" class="image" fit="contain" width="200"
                                height="260" :class="{ shadow: (imgflag === +movie.id) }" @click="checkoneM(movie.id)"
                                v-if="movie.flag == 1" />
                        </el-col>
                    </el-row>
                </el-card>
                
            </div>
            <div class="div-button">
                影厅类型:<el-button text v-for="cinema in myCinemaStore.cinemaType" :key="cinema.id"
                    @click="gettypeId(cinema.id)">{{ cinema.name }}</el-button>
            </div>
            <div class="div-time">
                开场时间:
                <el-date-picker v-model="time" type="datetime" placeholder="请选择开始时间" :default-time="new Date()"
                    value-format="YYYY-MM-DD HH:mm:ss" style="margin: 0 25px;" />

                <el-button type="danger" icon="Search" @click="searchMovie()">查询</el-button>
            </div>
            <div class="div-span">
                <span class="span-red">&nbsp;&nbsp;</span>场次列表
            </div>
            <el-scrollbar height="600px">
                <div v-for="one in getoneMovie" class="div-oneMovie">
                    <div>电影名称:&nbsp;{{ one.movieName }}</div>
                    <div>电影厅号:&nbsp;{{ one.venueName }}</div>
                    <div>电影开场时间:&nbsp;{{ one.startTime }}</div>
                    <div class="div-flex">
                        <div>剩余票数:&nbsp;<span class="span-oneMovie">
                                {{ one.x * one.y - one.sale }}</span></div>
                        <div>
                            <span class="span-qian">￥</span>{{ one.money }}
                            <el-button type="danger" :disabled="(one.x * one.y - one.sale) === 0"
                                @click="shopping(one)">购票</el-button>
                        </div>
                    </div>
                </div>
                <div v-show="!getoneMovie.length" class="div-length">
                    没有票
                </div>
            </el-scrollbar>
        </el-col>
        <!-- 右边条 -->

        <el-col :span="4" style="margin-left: 15px;">
            <div>
                <el-card :body-style="{ padding: '20px', }">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <h3>票房榜(总金榜)</h3>
                            <div v-for="(allM, index) in allMovie">
                                <div class="div-small">
                                    <span v-show="index !== 0">
                                        <span :class="{ smallred: index < 3, smallblack: index > 2 }">
                                            {{ index + 1 }}</span>&nbsp;&nbsp;<span class="movieNameFont">{{ allM.name }}</span>
                                    </span>
                                    <el-image style="width: 100px; height: 100px"
                                        :src="'http://localhost:8080/' + allM.posters" v-show="index === 0" />
                                    <span class="movieNameFont">{{ allM.boxOffice }}万
                                        <el-image style="width: 15px; height: 15px"
                                            src="http://localhost:8888/src/assets/huo.png" />
                                    </span>
                                </div>
                                <hr>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
        </el-col>
        <el-col :span="1">
            <!-- 右边距 -->
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { useCinemaStore } from '@/stores/counter';
import { checkAllMovie, checkCinemaType } from '@/api/dao';
import { reactive, ref, toRefs } from 'vue';
import { checkoneMm } from '@/api/dao'
import { ElMessage } from 'element-plus';
import { useRouter, type Router } from 'vue-router'

import { useRoute } from 'vue-router'
const route = useRoute()

const images = ref<Array<String>>(['/src/assets/1.jpg', '/src/assets/2.jpg', '/src/assets/3.jpg', '/src/assets/4.jpg'])

const router: Router = useRouter()

let imgflag = ref<number>(1)

let myCinemaStore = useCinemaStore()

console.log(myCinemaStore.regUser)
if (!myCinemaStore.regUser || !myCinemaStore.regUser.id) {
    ElMessage({
        type: 'error',
        message: '请先登录'
    })
    router.push({ path: '/' })
}

let checkoneMovie = reactive<checkoneMovie>({
    id: '',
    time: '',
    typeId: '',
})
let { id, time, typeId } = { ...toRefs(checkoneMovie) }

let getoneMovie = ref<Array<getoneMovie>>([])

/* 查询所有电影 */

let allMovie = ref<Array<allMovie>>([])

const queryAllMovie = () => {
    checkAllMovie()
        .then(res => {
            myCinemaStore.allMovie = res.data.data
            allMovie.value = myCinemaStore.allMovie.filter(x =>
                x.flag === 1
            )
        })
}
queryAllMovie()
/* 查询影厅类型 */
const queryCinemaType = () => {
    checkCinemaType()
        .then(res => {
            myCinemaStore.cinemaType = res.data.data
            console.log('cinemaType', myCinemaStore.cinemaType)
        })
}
queryCinemaType()

const gettypeId = (cinemaid: string | number) => {
    typeId.value = cinemaid
    checkoneM(id.value)
}

/* 查询一个电影的场次 */
const checkoneM = (movieid: string) => {
    imgflag.value = +movieid
    id.value = movieid
    checkoneMm(checkoneMovie)
        .then(res => {
            // ElMessage({
            //     type: res.data.code == 200 ? 'success' : 'error',
            //     message: res.data.msg
            // })
            getoneMovie.value = res.data.data
        })
}
checkoneM(id.value)

const searchMovie = () => {
    checkoneMovie.id = ''
    checkoneM(id.value)

}


const shopping = (onemovie: getoneMovie) => {
    myCinemaStore.oneMovie = onemovie
    router.push({ path: '/ticket' })
}

const logout = () => {

    router.replace('/');
}

const handleCommand = (command: string | number | object) => {
    switch (command) {
        case 'logout':
            logout();
            break;
        case 'resetPass':
            router.push('/updatePwd');
            break;
        case 'myOrder':
            router.push('/myOrder');
            break;
        case 'question':
            router.push('/question');
            break;
        // 这里可以添加实际的路由跳转逻辑
    }
}


</script>
<style scoped>
/* 主容器样式 */
.show {
    width: 100%;
    height: 100%;
    display: flex;
    margin: 0;
    padding: 20px 0;
    background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)),
        url("@/assets/images/cinema-bg-dark.jpg") no-repeat center center;
    background-size: cover;
    color: #fff;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    overflow: auto;
}

/* 卡片样式 */
.el-card {
    background-color: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
    margin-bottom: 20px;
}

/* 电影海报样式 */
.image {
    transition: all 0.3s ease;
    border-radius: 4px;
    cursor: pointer;
}

.image:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
}

.shadow {
    box-shadow: 0 0 15px rgba(229, 9, 20, 0.6) !important;
    border: 2px solid #e50914;
}

/* 筛选区域样式 */
.div-button,
.div-time {
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    margin-bottom: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.el-button {
    margin: 0 10px;
    transition: all 0.3s ease;
}

.el-button:hover {
    transform: translateY(-2px);
}

/* 场次列表标题 */
.div-span {
    margin: 20px 0;
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
}

.span-red {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #e50914;
    border-radius: 2px;
}

/* 场次列表样式 */
.el-scrollbar {
    border-radius: 4px;
}

.div-oneMovie {
    padding: 15px;
    background-color: rgba(0, 0, 0, 0.6);
    margin-bottom: 10px;
    border-radius: 4px;
    border-left: 3px solid #e50914;
    transition: all 0.3s ease;
}

.div-oneMovie:hover {
    background-color: rgba(30, 30, 30, 0.7);
    transform: translateX(5px);
}

.div-oneMovie div {
    font-size: 1rem;
    padding: 5px;
    color: #fff;
}

.span-oneMovie {
    color: #e50914;
    font-size: 1.2rem;
    font-weight: bold;
}

.div-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.span-qian {
    color: #e50914;
    font-weight: bold;
}

/* 购票按钮 */
.el-button--danger {
    background-color: #e50914;
    border-color: #e50914;
    padding: 10px 20px;
}

.el-button--danger:hover {
    background-color: #f40612;
    border-color: #f40612;
}

/* 无票提示 */
.div-length {
    text-align: center;
    padding: 30px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
}

/* 票房榜样式 */
h3 {
    color: #e50914;
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.3rem;
    letter-spacing: 1px;
    position: relative;
    padding-bottom: 10px;
}

h3:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background: #e50914;
}

.div-small {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-size: 0.9rem;
}

.smallblack {
    color: #fff;
    font-weight: bold;
}

.smallred {
    color: #e50914;
    font-weight: bold;
    font-size: 1.1rem;
}

.movieNameFont {
    color: #ffffff;
}

hr {
    border: none;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
    margin: 5px 0;
}

/* 响应式调整 */
@media (max-width: 1200px) {
    .show {
        flex-direction: column;
    }

    .el-col {
        width: 100%;
        margin-bottom: 20px;
    }
}

.header {
    /* 设置内部文本颜色 */
    color: whitesmoke;
    /* 设置渐变背景色 
    to right 表示渐变方向这里是 从左往右 后面是渐变的颜色选项,可以书写多种 */

    padding: 0px 20px;
    /* background-color: rgba(0, 0, 0, 0.8); */
    background: linear-gradient(to right, #141414, #e50914);
    border-radius: 4px;
    border-bottom: 3px solid #e50914;
    transition: all 0.3s ease;


    /* 页眉开启弹性盒子 */
    display: flex;
    /* 设置主轴两端对齐 */
    justify-content: space-between;
    /* 设置交叉轴居中 */
    align-items: center;
    height: 8vh;
}

/* 设置 logo */
.header .title .logo {
    /* logo 宽度 */
    width: 25px;
    vertical-align: middle;
}

/* 设置标题 */
.header .title {
    /* 设置标题阴影 */
    text-shadow: 5px 5px 3px black;
    /* 设置标题向右偏移 */
    margin-left: 50px;
    /* 设置标题大小 */
    font-size: large;
}

/* 设置文本提示信息 */
.header .info {
    /* 向左偏移 100 像素 */
    margin-right: 10px;
    /* 添加阴影 */
    text-shadow: 6px 6px 3px black;
    /* 字体大小 */
    font-size: large;
}
</style>