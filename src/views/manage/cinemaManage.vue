<template>
    <div class="page-wrapper">
        <div class="container">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item label="电影名称">
                    <el-input v-model="queryForm.name" placeholder="请输入电影名称" clearable />
                </el-form-item>
                <el-form-item label="是否上架">
                    <el-select v-model="queryForm.flag" placeholder="请选择是否上架" clearable>
                        <el-option v-for="item in flagList" :key="item.value" :label="item.label" :value="item.value" />

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
            <div class="content-wrapper">
                <div class="app-container">
                    <div class="table-container">

                        <el-table :data="tableData" stripe style="width: 100%">
                            <el-table-column prop="name" label="电影名称" />
                            <el-table-column prop="synopsis" label="电影简介" show-overflow-tooltip />
                            <el-table-column prop="posters" label="电影海报">
                                <template #default="scope">
                                    <img :src="'http://localhost:8080' + scope.row.posters"
                                        style="width: 100px; height: 100px;" />
                                </template>
                                
                            </el-table-column>
                            <el-table-column prop="longTime" label="电影时长" />
                            <el-table-column prop="boxOffice" label="电影票房" />
                            <el-table-column prop="flag" label="状态">
                                <template #default="scope">
                                    <el-tag :type="scope.row.flag === 1 ? 'success' : 'danger'">{{ scope.row.flag === 1
                                        ? '上架' :
                                        '下架' }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template #default="scope">
                                    <el-button type="warning" link @click="handleEdit(scope)">编辑</el-button>
                                    <el-button type="danger" link @click="handleDelete(scope)">删除</el-button>
                                </template>

                            </el-table-column>
                        </el-table>
                        <div style="text-align: center;margin: 10px 0px;">
                            <!-- 分页插件 -->
                            <el-pagination v-model:current-page="queryForm.pageNum"
                                v-model:page-size="queryForm.pageSize" :page-sizes="[5, 10, 20, 40]"
                                layout="sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
                                @current-change="handleCurrentChange" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 添加影厅---------------------------------------- -->
            <!-- el-dialog的v-model属性用于双向绑定对话框的显示与隐藏 -->
            <el-dialog v-model="addCinemalog" :title="formTitle" width="30%">
                <el-form :model="addCinema" :rules="addCinemaRules" ref="movieFormRef" status-icon size="default"
                    label-width="auto">
                    <el-form-item label="电影名称" prop="name">
                        <el-input v-model="name" />
                    </el-form-item>
                    <el-form-item label="电影简介" prop="synopsis">
                        <el-input v-model="synopsis" type="textarea" :rows="4" />
                    </el-form-item>
                    <el-form-item label="电影时长" prop="longTime">
                        <el-input v-model.number="longTime" />
                    </el-form-item>
                    <el-form-item label="电影票房" prop="boxOffice">
                        <el-input v-model.number="boxOffice" />
                    </el-form-item>
                    <el-form-item label="是否上架">
                        <el-select v-model="flag" placeholder="请选择是否上架" clearable>
                            <el-option v-for="item in flagList" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <!-- action指定了上传文件的后端接口 -->
                    <el-form-item label="海报图片" prop="path" ref="myUpload">
                        <!-- v-model已经双向绑定了fileList，所以重置的时候也需要把上传列表清空 -->
                        <el-upload class="avatar-uploader" v-model:file-list="fileList"  
                            action="http://localhost:8080/upload" :on-remove="handleRemove"
                            :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
                            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="posters" :src="'http://localhost:8080' + posters" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>

                </el-form>
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
    </div>
</template>
<script setup lang='ts'>
import { getAllMovie, updateMovie, addMovie, deleteMovie, updateVenue, deleteVenue } from '@/api/dao'
import {
    type FormInstance, type FormRules, ElMessage, type UploadUserFile, type UploadProps,
    ElMessageBox, type FormItemInstance
} from 'element-plus';
import { getCurrentInstance, onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue'
import { useCinemaStore } from '@/stores/counter';
const { proxy } = getCurrentInstance() || {};
const fileList = ref<UploadUserFile[]>([
])
const emits = defineEmits([])
const props = defineProps({

})
const state = reactive({

})
const stateref = ref({

})

const formTitle = ref<string>('添加影厅')
// let AddCinemaForm = ref<FormInstance | undefined>()

const addCinema = reactive({
    id: 0,
    name: '',
    synopsis: '',
    posters: '',
    longTime: 0,
    boxOffice: 0,
    flag: 1,
})

let addCinemaRules = reactive({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    synopsis: [
        { required: true, message: '请输入电影简介', trigger: 'blur' }
    ],
    longTime: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    boxOffice: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    flag: [
        { required: true, message: '请选择影厅类型', trigger: 'change' }
    ]
})
let { name, synopsis, posters, longTime, boxOffice, flag } = { ...toRefs(addCinema) }
let myCinemaStore = useCinemaStore()

const queryForm = reactive({
    name: '',
    flag: 1,
    pageNum: 1,
    pageSize: 10
})
const total = ref(0)

const tableData = ref([])

const flagList = ref([
    { label: '上架', value: 1 },
    { label: '已下架', value: 0 }
])

const movieFormRef = ref(null)
const handleQuery = () => {
    getList()

}

// 用来处理上传文件移除工作的
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log('handleRemove', file, uploadFiles)
    /* 恢复 path 为 空串 */
    if (posters.value) posters.value = ''
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
    return ElMessageBox.confirm(
        `确定删除${uploadFile.name}吗?`
    ).then(
        () => true,
        () => false
    )
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
        } totally`
    )
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    if (response.code == 200) {
        posters.value = ''
        if (!posters.value) {
            posters.value = response.data
            console.log('post', posters.value)
            // unref(myUpload)?.clearValidate()
        }
    }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('上传图片必须是 jpg 格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 5) {
        ElMessage.error('上传图片大小不得超过 5M!')
        return false
    }
    return true
}


const resetQuery = () => {
    queryForm.name = ''
    queryForm.flag = 1
    queryForm.pageNum = 1
    queryForm.pageSize = 10
    getList()
}

const getList = () => {
    getAllMovie(queryForm).then(res => {
        console.log('获取到的数据', res.data)
        tableData.value = res.data.data.rows
        total.value = res.data.data.total
    })
}

getList()

const addCinemalog = ref<boolean>(false)
const addCinemaLog = () => {
    addCinemalog.value = true
    formTitle.value = "添加影厅"
    resetMovieXY()
    resetForm(movieFormRef.value) //弹出来一个空表
}

const resetMovieXY = () => {
    addCinema.name = ''
    addCinema.synopsis = ''
    addCinema.posters = ''
    addCinema.longTime = 0
    addCinema.boxOffice = 0
    addCinema.flag = 1
    fileList.value = []
}


const resetForm = (formEl: FormInstance | undefined) => {
    /* 如果无法获取表单对象 返回 */
    if (!formEl) return
    /* 重置表单注意 每个字段必须设置了 prop 属性 */
    formEl.resetFields()
}

// const queryCinemaType = () => {
//     checkCinemaType()
//         .then(res => {
//             myCinemaStore.cinemaType = res.data.data
//         })
// }
// queryCinemaType()

const addCinemaMethod = () => {
    // valid显示表单验证是否通过
    movieFormRef.value.validate(valid => {
        if (valid) {
            console.log(formTitle.value)
            if (formTitle.value == '添加影厅') {
                addMovie(addCinema)
                    .then(res => {
                        ElMessage({
                            type: res.data.code == 200 ? 'success' : 'error',
                            message: res.data.msg
                        })
                        addCinemalog.value = false
                        getList()
                    })
            } else {
                updateMovie(addCinema)
                    .then(res => {
                        ElMessage({
                            type: res.data.code == 200 ? 'success' : 'error',
                            message: '修改成功'
                        })
                        addCinemalog.value = false
                        getList()
                    })

            }
        } else {
            ElMessage({
                type: 'error',
                message: '请填写完整信息'
            })
        }
    })
}

const handleEdit = (scope: any) => {
    addCinema.id = scope.row.id
    addCinema.name = scope.row.name
    addCinema.synopsis = scope.row.synopsis
    addCinema.posters = scope.row.posters
    addCinema.longTime = scope.row.longTime
    addCinema.boxOffice = scope.row.boxOffice
    addCinema.flag = scope.row.flag
    formTitle.value = '修改影厅'

    addCinemalog.value = true

}

const handleSizeChange = (val: number) => {
    queryForm.pageSize = val
    getList()
}

const handleCurrentChange = (val: number) => {
    queryForm.pageNum = val
    getList()
}
const handleDelete = (scope: any) => {
    deleteMovie(scope.row.id).then(res => {
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
<style lang="css" scoped>
.page-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* 内容区域 - 可滚动 */
.content-wrapper {
    flex: 1;
    overflow-y: auto;
    background: #f5f5f5;
    margin-bottom: 100px;
}



.container {
    width: 100%;
    height: 100%;
    overflow: auto;
}


.el-upload {
    border: 1px dashed #fff !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    /* transition: var(--el-transition-duration-fast); */
}

.avatar {
    width: 178px;
    height: 178px;
}

.avatar-uploader .el-upload:hover {
    border-color: #fff;
}

.el-icon.avatar-uploader-icon {
    border: 1px solid gray;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>