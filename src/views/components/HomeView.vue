<template>
    <el-container class="home">
        <el-header class="header">
            <h1 class="title">
                <img src="https://www.logosc.cn/oss/icons/2021/12/02/wfVSt-aPavSh0XR.png" class="logo">
                影厅影院管理系统
            </h1>
            <div style="display: flex; align-items: center;">
                <el-avatar size="small" :src="'http://localhost:8080/' + pic.value" 
                    fit="scale-down" class="user-img"></el-avatar>
                <span class="info">
                    欢迎您回来
                </span>
                <el-dropdown @command="handleCommand" trigger="hover">
                    <!-- 下拉菜单的标题 -->
                    <span class="el-dropdown-link">
                        <el-icon>
                            <Tools />
                        </el-icon>
                        用户菜单
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item icon="Location" command="resetPass">修改密码</el-dropdown-item>
                            <el-dropdown-item icon="Coordinate" command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

        </el-header>
        <el-container>
            <el-aside width="200px">
                <!-- 根据后台返回的菜单树生成菜单，实现不同权限不同页面 -->
                <SideBar :menuList="menus" />
            </el-aside>
            <el-container>
                <el-main class="main">
                    <router-view></router-view>
                </el-main>
                <el-footer> </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { useCinemaStore } from '@/stores/counter'
import { useRouter, type Router } from 'vue-router'
import { ElMessage } from 'element-plus';
import { queryMenusByUserId, getUserInfo } from '@/api/dao'
import { ref, reactive, toRefs } from 'vue'
import SideBar from '@/components/SideBar/SideBar.vue'


const myUserRstStore = useCinemaStore()
const router: Router = useRouter()

if (!myUserRstStore.userId || myUserRstStore.userId === -1) {
    ElMessage({
        type: 'error',
        message: '请先登录'
    })
    router.push({
        path: '/userLogin',
    })
}
const userId = myUserRstStore.userId

const menus = ref([])

const pic = ref<String>('')

const queryMenus = () => {
    queryMenusByUserId(userId).then(res => {
        menus.value = res.data.data
        console.log(menus.value)
    })
}
queryMenus()
const logout = () => {

    router.replace('/');
}
const handleCommand = (command: string | number | object) => {
    switch (command) {
        case 'logout':
            logout();
            break;
        case 'enterBg':
            router.replace('/admin/first/index');
            break;
        // 这里可以添加实际的路由跳转逻辑
    }
}

</script>

<style scoped>
.home {
    height: 100vh;


    .el-aside {
        background-color: #500a16;
    }
}

.header {
    color: whitesmoke;
    /* 设置渐变背景色 
    to right 表示渐变方向这里是 从左往右 后面是渐变的颜色选项,可以书写多种 */
    background: linear-gradient(to right, #536976, #292e49);
    /* 页眉开启弹性盒子 */
    display: flex;
    /* 设置主轴两端对齐 */
    justify-content: space-between;
    /* 设置交叉轴居中 */
    align-items: center;
}

.logo {
    /* logo 宽度 */
    width: 25px;
    vertical-align: middle;
}

.info {
    /* 向左偏移 100 像素 */
    margin: 0 10px;
    /* 添加阴影 */
    text-shadow: 6px 6px 3px black;
    /* 字体大小 */
    font-size: large;
}

.main {
    overflow: hidden;
}
</style>