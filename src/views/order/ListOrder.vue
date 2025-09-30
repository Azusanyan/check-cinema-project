<template>
    <div class="div-table">
        <el-form :model="checkOrderPage" ref="myOrderPageForm" status-icon size="default" inline label-width="auto"
            label-position="left">
            <el-form-item label="电影名称" prop="movieName">
                <el-input v-model="movieName" autocomplete="off" placeholder="模糊查询" />
            </el-form-item>

            <el-form-item prop="typeId" label="影厅类型">
                <el-select v-model="typeId" placeholder="影厅类型">
                    <el-option v-for="ctype in myCinemaStore.cinemaType" :key="ctype.id" :label="ctype.name"
                        :value="ctype.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单时间" prop="startTime" class="time">
                <el-date-picker v-model="startTime" type="datetime" placeholder="请选择订单开始时间" format="YYYY-MM-DD HH:mm:ss"
                    date-format="MMM DD, YYYY" time-format="HH:mm" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round @click="check">查询</el-button>
                <el-button round @click="resetForm(myOrderPageForm)">重置</el-button>
            </el-form-item>
        </el-form>
        <el-scrollbar max-height="650px">
            <el-table class="middle" :data="orderInfo" size="default" stripe highlight-current-row border>
                <el-table-column label="用户姓名" prop="customerName" align="center"></el-table-column>
                <el-table-column label="电影名称" prop="movieName" align="center"></el-table-column>
                <el-table-column label="影厅类型" prop="venueName" align="center"></el-table-column>
                <el-table-column label="单价" prop="money" align="center"></el-table-column>
                <el-table-column label="数量" prop="num" align="center"></el-table-column>
                <el-table-column label="下单时间" prop="orderTime" align="center"></el-table-column>
                <el-table-column label="电影时长/分钟" prop="time" align="center"></el-table-column>
            </el-table>
        </el-scrollbar>
        <el-pagination v-model:current-page="pageNumber" v-model:page-size="pageSize" :page-sizes="[10, 15, 30]"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" class="bottom" />
    </div>
</template>


<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue';
import { useCinemaStore } from '@/stores/counter';
import { type FormInstance, type FormRules, ElMessage } from 'element-plus';
import { checkPag, deleMovie, checkOrderPageAPI, deleteOrderAPI } from '@/api/dao';
import { watch } from 'vue';

const myCinemaStore = useCinemaStore();

let myOrderPageForm = ref<FormInstance | undefined>()

let total = ref<number>(0)

const checkOrderPage = reactive<OrderPage>({
    pageSize: 10,
    pageNumber: 1,
    movieName: '',
    typeId: '',
    startTime: '',
})
let { pageSize, pageNumber, movieName, typeId, startTime } = { ...toRefs(checkOrderPage) }

const resetForm = (formEl: FormInstance | undefined) => {
    /* 如果无法获取表单对象 返回 */
    if (!formEl) return
    /* 重置表单注意 每个字段必须设置了 prop 属性 */
    formEl.resetFields()
    check()
}

const orderInfo = ref<Array<OrderInfo>>([])

const check = () => {
    checkOrderPageAPI(checkOrderPage).then(res => {
        total.value = res.data.data.total
        pageNumber.value = res.data.data.pageNumber
        pageSize.value = res.data.data.pageSize
        orderInfo.value = res.data.data.data
    })

}
check()

/* 当每页记录数更改时执行,传入的 val 就是新的每页记录数 */
const handleSizeChange = (val: number) => {
    /* 更新每页记录数 默认是 10 */
    pageSize.value = val
    /* 恢复当前页为 1,否则可能会导致向后端传递了一个根本不可能存在的当前页 */
    pageNumber.value = 1
    /* 回显 */
    check()
}
/* 当当前页更改时执行 val 形参就是新的当前页值 */
const handleCurrentChange = (val: number) => {
    /* 更新当前页的值 */
    pageNumber.value = val
    /* 回显 */
    check()
}

/* 删除 */
const deleteM = (id: number) => {
    deleteOrderAPI(id).then(res => {
        ElMessage({
            type: res.data.code == 200 ? 'success' : 'error',
            message: res.data.msg,
            showClose: true,
        })
        check()
    })

}


</script>

<style scoped>
.bottom {
    height: 4vh;
    justify-content: center;
    margin: 10px;
}
</style>