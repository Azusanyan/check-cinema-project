<template>
    <div class="page-container">
        <el-header class="header" height="5vh">
            <h1 class="title">
                <img src="https://www.logosc.cn/oss/icons/2021/12/02/wfVSt-aPavSh0XR.png" class="logo">
                影厅影院管理系统
            </h1>

            <!-- <h1 class="title">欢迎回来</h1> -->
            <el-dropdown @command="handleCommand" trigger="hover">
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
                        <!-- <el-dropdown-item icon="Location" command="resetPass">修改密码</el-dropdown-item>
                        <el-dropdown-item icon="Coordinate" command="logout">退出登录</el-dropdown-item> -->
                        <el-dropdown-item icon="Document" command="resetPass">我的信息</el-dropdown-item>
                        <el-dropdown-item icon="Notebook" command="myOrder">我的订单</el-dropdown-item>
                        <el-dropdown-item icon="Tickets" command="question">我的问题</el-dropdown-item>
                        <el-dropdown-item icon="Location" command="index">首页</el-dropdown-item>
                        <el-dropdown-item icon="Coordinate" command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-header>
        <div class="content-container">
            <div class="app-container">
                <div style="width: 80%; height: 100%; overflow: auto; background-color: #fff; border-radius: 10px;">
                    <el-table :data="orderList" :border="parentBorder" :preserve-expanded-content="preserveExpanded"
                        style="width: 100%">
                        <el-table-column type="expand">
                            <template #default="props">
                                <div m="4">
                                    <div style="margin:10px 20px; font-size: 20px;">场次: {{ props.row.venueName }}</div>
                                    <div style="margin:10px 20px; font-size: 20px;">影厅类型: {{ props.row.typeName }}</div>
                                    <div style="margin:10px 20px; font-size: 20px;">开场时间: {{ props.row.startTime }}
                                    </div>
                                    <div style="margin:10px 20px; font-size: 20px;">下单时间: {{ props.row.orderTime }}
                                    </div>
                                    <div style="margin:10px 20px; font-size: 20px;">下单数量: {{ props.row.num }}</div>
                                    <h3>电影座次</h3>
                                    <el-table :data="props.row.seatList" :border="childBorder">
                                        <el-table-column label="座位行号" prop="x" />
                                        <el-table-column label="座位列号" prop="y" />
                                        <el-table-column label="操作">
                                            <template #default="scope">
                                                <el-button type="danger" v-if="showBtn(props.row.startTime)" link
                                                    @click="handleDelete(scope.row.id, props.row.id)">退票</el-button>
                                                <el-button type="success" v-else link>已使用</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="电影名称" prop="movieName" />
                        <el-table-column label="下单时间" prop="orderTime" />
                        <el-table-column label="下单数量" prop="num" />
                    </el-table>
                    <div style="display: flex; justify-content: center; margin: 10px 0;">
                        <el-pagination v-model:current-page="queryParams.pageNum"
                            v-model:page-size="queryParams.pageSize" :page-sizes="[10, 20, 30, 40]" size="medium"
                            background="#fff" layout="sizes, prev, pager, next" :total="total"
                            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { getMyOrder, deleteSeat } from '@/api/dao'
const router: Router = useRouter()
const parentBorder = ref(false)
const childBorder = ref(false)
const preserveExpanded = ref(false)
const { proxy } = getCurrentInstance() || {};
const emits = defineEmits([])
const props = defineProps({

})

const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    customerId: 0
})
const total = ref(0)

const state = reactive({

})
const stateref = ref({

})

const orderList = ref([])

const getOrderList = () => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    queryParams.customerId = userInfo.id
    getMyOrder(queryParams).then(res => {

        console.log('订单劣币', res.data.data.rows)
        orderList.value = res.data.data.rows || []
        total.value = res.data.data.total || 0
    })
}

const handleDelete = (id, oid) => {
    console.log('删除', id)

    ElMessageBox.confirm(
        '确定退掉该订单吗?',
        'Warning',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            deleteSeat(id, oid).then(res => {
                ElMessage({
                    type: 'success',
                    message: '退票成功',
                })
                getOrderList()
            })

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '退票成功',
            })
        })


}

getOrderList()

const showBtn = (timeStr: string) => {
    try {
        console.log('时间', timeStr);

        const timeDate = new Date(timeStr);

        // 检查是否是有效日期
        if (isNaN(timeDate.getTime())) {
            console.error('无效的时间格式:', timeStr);
            return false;
        }

        return timeDate.getTime() > Date.now();
    } catch (e) {
        console.error('时间比较出错:', e);
        return false;
    }
}

const handleSizeChange = (val: number) => {
    queryParams.pageSize = val
    getOrderList()
}

const handleCurrentChange = (val: number) => {
    queryParams.pageNum = val
    getOrderList()
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
        case 'index':
            router.push('/home');
            break;
        // 这里可以添加实际的路由跳转逻辑
    }
}



onBeforeMount(() => {

})
onMounted(() => {

})
defineExpose({ state, stateref })

</script>
<style lang="css" scoped>
.page-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* 内容容器，可滚动 */
.content-container {
    flex: 1;
    overflow: auto;
}

.app-container {
    width: 100%;
    min-height: 100vh;
    padding: 20px 0;
    background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7)),
        url("@/assets/images/cinema-bg.jpg") no-repeat center center;
    background-size: cover;
    color: #fff;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    display: flex;
    justify-content: center;
    overflow: auto;
}

/* 头部导航栏样式 */

.header {
    background: linear-gradient(to right, #141414, #e50914);
    color: white;
    padding: 0 30px;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 100;
}

.header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, #e50914, #f5f5f1, #e50914);
}

.header .title {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 0 0 10px rgba(229, 9, 20, 0.7);
}

.header .title .logo {
    width: 40px;
    height: 40px;
    margin-right: 15px;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7));
}
</style>