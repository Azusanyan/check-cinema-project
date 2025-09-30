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
                    <el-dropdown-item icon="Location" command="resetPass">修改密码</el-dropdown-item>
                    <el-dropdown-item icon="Location" command="myOrder">我的订单</el-dropdown-item>
                    <el-dropdown-item icon="Location" command="resetPass">修改密码</el-dropdown-item>
                    <el-dropdown-item icon="Coordinate" command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </el-header>
    <el-row class="show">
        <el-col :span="2">
        </el-col>
        <el-col :span="20">
            <div class="div-main">
                <span>
                    <el-image style="width: 200px; height: 250px" :src="'http://localhost:8080/' + oneMovie.posters" />
                    
                </span>
                <div class="div-text">
                    <div>
                        <h1>剧情介绍:</h1>
                    </div>
                    <div>
                        {{ oneMovie.synopsis }}
                    </div>
                </div>
            </div>

            <div class="div-Lower">
                <div class="div-zuowei">
                    <div class="div-cinema">电影屏幕</div>
                    <div>
                        <div v-for="(i, index1) in oneMovie.x" class="zuowei">
                            <div v-for="(j, index2) in oneMovie.y">
                                <el-image :src="arr[0]" @click="coordinate(index1 + 1, index2 + 1)"
                                    v-if="changeColor(i, j) === 1" />
                                <el-image :src="arr[1]" v-else-if="changeColor(i, j) === 2"
                                    @click="coordinate(index1 + 1, index2 + 1)" />
                                <el-image :src="arr[2]" v-else />
                            </div>
                            <br>
                        </div>
                    </div>
                </div>


                <div style="background-color: #fff; color:black; border-radius: 0px 10px 10px 10px;">
                    <div class="shopping" style="margin-right: 5px;">
                        <h1>{{ oneMovie.movieName }}</h1>
                        <el-button type="danger" @click="shopping">购票</el-button>
                    </div>
                    所在场次:&nbsp;{{ oneMovie.venueName }} <br>
                    时长:&nbsp;{{ oneMovie.longTime }}<br>
                    开场时间:&nbsp;{{ oneMovie.startTime }}<br>
                    <div class="div-right">
                        <span v-for="a in arrxy" v-show="a">
                            <div><el-image :src="arr[3]" /></div>
                            <div>
                                第{{ a.split(' ')[0] }}排
                                第{{ a.split(' ')[1] }}列
                            </div>
                        </span>
                    </div>
                </div>
            </div>



        </el-col>
        <el-col :span="2">

        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { useCinemaStore } from '@/stores/counter';
import { ref, reactive, toRefs } from 'vue'
import { checkSeats, shopMovie } from '@/api/dao'
import { ElMessage } from 'element-plus';
import { useRouter, type Router } from 'vue-router'
import axios from 'axios';

const router: Router = useRouter()

let myCinemaStore = useCinemaStore()

if (!myCinemaStore.userId) {
    ElMessage({
        type: 'error',
        message: '请先登录'
    })
    router.push({ path: '/' })
}


let oneMovie = ref<getoneMovie>(myCinemaStore.oneMovie)

let Seated = ref<Array<checkSeats>>([])

let arrshop = ref<Array<shop>>([])

let arr = ref<Array<string>>([
    "https://mail-noob.oss-cn-beijing.aliyuncs.com/wx.png",
    "https://mail-noob.oss-cn-beijing.aliyuncs.com/zjx.png",
    "https://mail-noob.oss-cn-beijing.aliyuncs.com/yx.png",
    "https://mail-noob.oss-cn-beijing.aliyuncs.com/dyp.png",
])


let str1 = ref<string>('')
let str2 = ref<string>('')


let shop = reactive<shop>({
    scenesId: oneMovie.value.id,
    userId: '1',
    x: 0,
    y: 0,
})
let { scenesId, x, y } = { ...toRefs(shop) }



/* 查询已购的座位 */
const checkSeat = () => {
    checkSeats(oneMovie.value.id)
        .then(res => {
            ElMessage({
                type: res.data.code == 200 ? 'success' : 'error',
                message: res.data.msg
            })
            Seated.value = res.data.data
            Seated.value.forEach(res => {
                str2.value += res.x + ' ' + res.y + ','
            })
        })
}
checkSeat()


let arrxy = ref<Array<string>>([])
/* 查询坐标 */
const coordinate = (index1: number, index2: number) => {
    /* 如果是取消坐标 从中删除 */
    if (!str1.value.includes(index1 + ' ' + index2))
        str1.value += index1 + ' ' + index2 + ','
    else {
        str1.value = str1.value.replace((index1 + ' ' + index2 + ','), '')
    }
    arrxy.value = str1.value.split(',')
}


const changeColor = (x: number, y: number) => {
    if (str1.value.includes(x + ' ' + y)) return 2
    else if (str2.value.includes(x + ' ' + y)) return 3
    else return 1
}

const shopping = () => {
    /* 每次置空选座数组，arrshop中存放真正选择的数组 */
    arrshop.value = []
    arrxy.value.forEach(x => {
        const a = x.split(' ')
        if (+a[0] != 0) {
            arrshop.value.push({
                scenesId: oneMovie.value.id,
                userId: myCinemaStore.userId + '',
                x: +a[0],
                y: +a[1],
            })
        }
    })
    shopMovie(arrshop.value)
        .then(res => {
            console.log(res)
            ElMessage({
                type: res.data.code === 200 ? 'success' : 'error',
                message: res.data.msg
            })
            if (res.data.code === 200) {
                router.push({ path: '/home' })
            }
        })
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
        // 这里可以添加实际的路由跳转逻辑
    }
}


</script>

<style scoped>
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

.div-main {
    border-top: 3px solid #e50914;
    border-radius: 10px;
    display: flex;
    background-color: rgb(64, 64, 77);
    padding: 25px;
}

.div-text {
    margin-left: 25px;
    color: white;
}

.zuowei {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.div-cinema {
    width: 150px;
    background-color: lightslategray;
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
}

.div-zuowei {
    border-radius: 10px 0px 10px 10px;
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;

}

.div-Lower {
    height: 100%;

    border-top: 3px solid #e50914;
    border-radius: 10px 10px 0px 0px;
    margin-top: 25px;
    border: 1px solid pink;
    display: flex;

}

.div-right {
    width: 700px;
    display: flex;
    flex-wrap: wrap
}

.shopping {
    width: 700px;
    display: flex;
    justify-content: space-between;
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