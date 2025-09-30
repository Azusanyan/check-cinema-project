<template>
    <div class="page-wrapper">
        <div class="container">
            <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                <el-form-item label="用户名">
                    <el-input v-model="queryForm.name" placeholder="请输入用户名" clearable />
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="queryForm.gender" placeholder="请选择性别" clearable>
                        <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value" />

                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery" icon="Search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" plain @click="resetQuery()" icon="Delete">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="content-wrapper">
                <div class="app-container">
                    <div class="table-container">
                        <el-table :data="tableData" stripe style="width: 100%">
                            <el-table-column prop="name" label="用户名" />
                            <el-table-column prop="gender" label="性别">
                                <template #default="scope">
                                    <el-tag :type="scope.row.gender == '男' ? 'success' : 'primary'">{{ scope.row.gender ==
                                        '男'
                                        ? '男' :
                                        '女' }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="age" label="年龄" />
                            <el-table-column prop="posters" label="头像">
                                <template #default="scope">
                                    <img :src="'http://localhost:8080' + scope.row.pic"
                                        style="width: 100px; height: 100px;" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="birth" label="生日" />
                            <el-table-column prop="phone" label="电话" />

                            <el-table-column label="操作">
                                <template #default="scope">
                                    <el-button type="warning" link @click="handleEdit(scope)">编辑</el-button>
                                    <el-button type="danger" link @click="handleDelete(scope)">删除</el-button>
                                </template>

                            </el-table-column>
                        </el-table>
                        <div style="text-align: center;margin: 10px 0px;">
                            <el-pagination v-model:current-page="queryForm.pageNum"
                                v-model:page-size="queryForm.pageSize" :page-sizes="[5, 10, 20, 40]"
                                layout="sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
                                @current-change="handleCurrentChange" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 添加影厅---------------------------------------- -->
            <el-dialog v-model="addCinemalog" title="修改用户信息" width="30%">
                <el-form :model="addCinema" :rules="addCinemaRules" ref="movieFormRef" status-icon size="default"
                    label-width="auto">
                    <el-form-item prop="name" label="用户名">
                        <el-input v-model="name" placeholder="请输入用户姓名" autofocus clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="phone" label="手机号">
                        <el-input v-model="phone" placeholder="请输入电话号码" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="gender" label="性别">
                        <el-radio-group v-model="gender">
                            <el-radio label="男">男</el-radio>
                            <el-radio label="女">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="生日">
                        <el-date-picker v-model="birth" type="date" placeholder="请选择生日" format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD" />
                    </el-form-item>

                    <el-form-item label="上传头像" prop="path" ref="myUpload">
                        <el-upload class="avatar-uploader" v-model:file-list="fileList"
                            action="http://localhost:8080/upload" :on-remove="handleRemove"
                            :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
                            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="pic" :src="'http://localhost:8080' + pic" class="avatar" />
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
import { getAllCustomer, updateCustomer, deleteCustomer, deleteMovie, updateVenue, deleteVenue } from '@/api/dao'
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
let AddCinemaForm = ref<FormInstance | undefined>()

const addCinema = reactive({
    id: 0,
    name: '',
    gender: '',
    pic: '',
    birth: null,
    phone: 0,
    age: null,
})

let addCinemaRules = reactive({
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' }
    ],
    age: [
        { required: true, message: '请输入年龄', trigger: 'blur' }
    ],
    boxOffice: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
    ]
})
let { name, gender, age, birth, phone, pic } = { ...toRefs(addCinema) }
let myCinemaStore = useCinemaStore()

const queryForm = reactive({
    name: '',
    gender: '男',
    pageNum: 1,
    pageSize: 10
})
const total = ref(0)

const tableData = ref([])

const sexList = ref([
    { label: '男', value: '男' },
    { label: '女', value: '女' }
])

const movieFormRef = ref(null)
const handleQuery = () => {
    getList()

}
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log('handleRemove', file, uploadFiles)
    /* 恢复 path 为 空串 */
    if (pic.value) pic.value = ''
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
        pic.value = ''
        if (!pic.value) {
            pic.value = response.data
            console.log('post', pic.value)
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
    queryForm.gender = ''
    queryForm.pageNum = 1
    queryForm.pageSize = 10
    getList()
}

const getList = () => {
    getAllCustomer(queryForm).then(res => {
        console.log('获取到的数据', res.data)
        tableData.value = res.data.data.rows
        total.value = res.data.data.total
    })
}

getList()

const addCinemalog = ref<boolean>(false)
const addCinemaLog = () => {
    addCinemalog.value = true
    resetMovieXY()
    resetForm(AddCinemaForm.value)
}

const resetMovieXY = () => {
    addCinema.name = ''
    addCinema.gender = ''
    addCinema.phone = ''
    addCinema.pic = ''
    addCinema.age = 0
    addCinema.birth = null
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
    movieFormRef.value.validate(valid => {
        if (valid) {
            if (formTitle.value == '添加影厅') {
            } else {
                updateCustomer(addCinema)
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
    addCinema.gender = scope.row.gender
    addCinema.age = scope.row.age
    addCinema.birth = scope.row.birth
    addCinema.phone = scope.row.phone
    addCinema.pic = scope.row.pic
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