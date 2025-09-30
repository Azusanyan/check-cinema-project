<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
            <el-form-item label="影厅名称">
                <el-input v-model="queryForm.name" placeholder="请输入影厅名称" clearable />
            </el-form-item>
            <el-form-item label="影厅类型">
                <el-select v-model="queryForm.typeId" placeholder="请选择影厅类型" clearable>
                    <el-option v-for="item in venueTypeList" :key="item.id" :label="item.name" :value="item.id" />

                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery" icon="Search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click="resetQuery()" icon="Delete">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="24">
                <el-button type="primary" plain @click="addCinemaLog()">新增</el-button>
            </el-col>
        </el-row>
        <div style="margin-top: 20px;">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="name" label="影厅名称" />
                <el-table-column prop="typeName" label="影厅类型" />
                <el-table-column prop="x" label="影厅横列" />
                <el-table-column prop="y" label="影厅纵列" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="warning" link @click="handleEdit(scope)">编辑</el-button>
                        <el-button type="danger" link @click="handleDelete(scope)">删除</el-button>
                    </template>

                </el-table-column>
                
            </el-table>
            <div style="text-align: center;margin: 10px 0px;">
                <el-pagination v-model:current-page="queryForm.pageNum" v-model:page-size="queryForm.pageSize"
                    :page-sizes="[5, 10, 20, 40]" layout="sizes, prev, pager, next" :total="total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>

        <!-- 添加影厅---------------------------------------- -->
        <el-dialog v-model="addCinemalog" :title="formTitle">
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
                <el-form-item label="影厅座位">
                    <el-input-number v-model="x" :min="2" :max="9" />
                    <el-input-number v-model="y" :min="2" :max="9" />
                </el-form-item>

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
        </el-dialog>
    </div>
</template>
<script setup lang='ts'>
import { selectSeatVenue, getAllVenueType, checkCinemaType, addTheater, updateVenue, deleteVenue } from '@/api/dao'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus';
import { getCurrentInstance, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue'
import { useCinemaStore } from '@/stores/counter';
const { proxy } = getCurrentInstance() || {};
const emits = defineEmits([])
const props = defineProps({

})
const state = reactive({

})
const stateref = ref({

})

const formTitle = ref<string>('添加影厅')
let AddCinemaForm = ref<FormInstance | undefined>()

const addCinema = reactive<addCinema>({
    id: 0,
    name: '',
    typeId: '',
    x: 2,
    y: 2,
})

let addCinemaRules = reactive<FormRules<addCinema>>({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    typeId: [
        { required: true, message: '请选择影厅类型', trigger: 'change' }
    ]
})
let { name, typeId, x, y } = { ...toRefs(addCinema) }
let myCinemaStore = useCinemaStore()

const queryForm = reactive({
    name: '',
    typeId: '',
    pageNum: 1,
    pageSize: 10
})
const total = ref(0)

const tableData = ref([])
const venueTypeList = ref([])
const handleQuery = () => {
    getList()

}

const resetQuery = () => {
    queryForm.name = ''
    queryForm.typeId = ''
    queryForm.pageNum = 1
    queryForm.pageSize = 10
    getList()
}

const getList = () => {
    selectSeatVenue(queryForm).then(res => {
        console.log('获取到的数据', res.data)
        tableData.value = res.data.data.rows
        total.value = res.data.data.total
    })
}
const handleSizeChange = (val: number) => {
    queryForm.pageSize = val
    getList()
}

const handleCurrentChange = (val: number) => {
    queryForm.pageNum = val
    getList()
}

const getAllVenueTypeList = () => {
    getAllVenueType().then(res => {
        console.log('获取到的影厅类型', res.data)
        venueTypeList.value = res.data.data
    })
}
getAllVenueTypeList()
getList()

const addCinemalog = ref<boolean>(false)
const addCinemaLog = () => {
    addCinemalog.value = true
    resetMovieXY()
    formTitle.value = "添加影厅"
    resetForm(AddCinemaForm.value)
}

const resetMovieXY = () => {
    addCinema.name = ''
    addCinema.typeId = ''
    addCinema.x = 2
    addCinema.y = 2
}


const resetForm = (formEl: FormInstance | undefined) => {
    /* 如果无法获取表单对象 返回 */
    if (!formEl) return
    /* 重置表单注意 每个字段必须设置了 prop 属性 */
    formEl.resetFields()
}

const queryCinemaType = () => {
    checkCinemaType()
        .then(res => {
            myCinemaStore.cinemaType = res.data.data
        })
}
queryCinemaType()

const addCinemaMethod = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(valid => {
        if (valid) {
            if (formTitle.value == '添加影厅') {
                addTheater(addCinema)
                    .then(res => {
                        ElMessage({
                            type: res.data.code == 200 ? 'success' : 'error',
                            message: res.data.msg
                        })
                        addCinemalog.value = false
                        getList()
                    })
            } else {
                updateVenue(addCinema)
                    .then(res => {
                        ElMessage({
                            type: res.data.code == 200 ? 'success' : 'error',
                            message: '修改成功'
                        })
                        addCinemalog.value = false
                        getList()
                    })

            }
        }
    })
}

const handleEdit = (scope: any) => {
    addCinema.id = scope.row.id
    addCinema.name = scope.row.name
    addCinema.typeId = scope.row.typeId
    addCinema.x = scope.row.x
    addCinema.y = scope.row.y
    formTitle.value = '修改影厅'

    addCinemalog.value = true

}

const handleDelete = (scope: any) => {
    deleteVenue(scope.row.id).then(res => {
        ElMessage({
            type: res.data.code == 200 ? 'success' : 'error',
            message: '删除成功'
        })
        getList()
    })
}


onBeforeMount(() => {

})
onMounted(() => {

})
defineExpose({ state, stateref })

</script>
<style lang="scss" scoped></style>