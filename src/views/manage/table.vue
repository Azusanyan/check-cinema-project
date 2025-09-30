<template>
    <div class="div-table">
        <el-form :model="checkPagination" ref="myPaginationForm" status-icon size="default" inline label-width="auto"
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
            <el-form-item label="开场时间" prop="startTime" class="time">
                <el-date-picker v-model="startTime" type="datetime" placeholder="请选择开始时间" format="YYYY-MM-DD HH:mm:ss"
                    date-format="MMM DD, YYYY" time-format="HH:mm" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round @click="check">查询</el-button>
                <el-button round @click="resetForm(myPaginationForm)">重置</el-button>
            </el-form-item>
        </el-form>
        <el-scrollbar max-height="650px">
            <el-table class="middle" :data="myCinemaStore.paginationData" size="default" stripe highlight-current-row
                border>
                <el-table-column label="影厅" prop="venueName" align="center"></el-table-column>
                <el-table-column label="电影名称" prop="movieName" align="center"></el-table-column>
                <el-table-column label="影厅类型" prop="typeName" align="center"></el-table-column>
                <el-table-column label="开始时间" prop="startTime" align="center"></el-table-column>
                <el-table-column label="票价" prop="money" align="center"></el-table-column>
                <el-table-column label="电影时长/分钟" prop="longTime" align="center"></el-table-column>
                <el-table-column label="可容纳人数" prop="x" align="center">
                    <template #default="scope">
                        {{ scope.row.x * scope.row.y }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="220px">
                    <template #default="scope">
                        <el-button type="danger" round size="small" @click="deleteM(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[10, 15, 30]"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" class="bottom" />
    </div>
</template>


<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue';
import { useCinemaStore } from '@/stores/counter';
import { type FormInstance, type FormRules, ElMessage } from 'element-plus';
// checkPag 查询所有场次的电影
import { checkPag, deleMovie } from '@/api/dao';
import { watch } from 'vue';

const myCinemaStore = useCinemaStore();

let myPaginationForm = ref<FormInstance | undefined>()

let total = ref<number>(0)

const checkPagination = reactive<checkPagination>({
    pageSize: 10,
    pageNum: 1,
    movieName: '',
    typeId: '',
    startTime: '',
})
let { pageSize, pageNum, movieName, typeId, startTime } = { ...toRefs(checkPagination) }

const resetForm = (formEl: FormInstance | undefined) => {
    /* 如果无法获取表单对象 返回 */
    if (!formEl) return
    /* 重置表单注意 每个字段必须设置了 prop 属性 */
    formEl.resetFields()
    check()
}

const check = () => {
    startTime.value = new Date(startTime.value)
    checkPag(checkPagination)
        .then(res => {
            console.log(res)
            ElMessage({
                type: res.data.code == 200 ? 'success' : 'error',
                message: res.data.msg
            })
            myCinemaStore.paginationData = res.data.data.scenesList
            total.value = res.data.data.total
        })
}
check()

/* 当每页记录数更改时执行,传入的 val 就是新的每页记录数 */
const handleSizeChange = (val: number) => {
    /* 更新每页记录数 默认是 10 */
    pageSize.value = val
    /* 恢复当前页为 1,否则可能会导致向后端传递了一个根本不可能存在的当前页 */
    pageNum.value = 1
    /* 回显 */
    check()
}
/* 当当前页更改时执行 val 形参就是新的当前页值 */
const handleCurrentChange = (val: number) => {
    /* 更新当前页的值 */
    pageNum.value = val
    /* 回显 */
    check()
}

/* 删除 */
const deleteM = (id: number) => {
    deleMovie(id)
        .then(res => {
            ElMessage({
                type: res.data.code == 200 ? 'success' : 'error',
                message: res.data.msg
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