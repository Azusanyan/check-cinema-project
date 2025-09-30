<template>
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
                    <el-dropdown-item icon="Document" command="resetPass">我的信息</el-dropdown-item>
                    <el-dropdown-item icon="Notebook" command="myOrder">我的订单</el-dropdown-item>
                    <el-dropdown-item icon="Tickets" command="question">我的问题</el-dropdown-item>
                    <el-dropdown-item icon="Location" command="index">首页</el-dropdown-item>
                    <el-dropdown-item icon="Coordinate" command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </el-header>
    <div class="app-container">
        <div class="user-profile-container">
            <el-card shadow="hover" style="background-color: rgba(0, 0, 0, 0.8);">
                <template #header>
                    <div class="card-header">
                        <span>用户信息</span>
                        <el-button type="primary" @click="toggleEditMode" v-if="!isEditing && !isChangingPassword">
                            编辑信息
                        </el-button>
                        <el-button type="warning" @click="togglePasswordMode" v-if="!isEditing && !isChangingPassword">
                            修改密码
                        </el-button>
                    </div>
                </template>

                <!-- 查看模式 -->
                <div v-if="!isEditing && !isChangingPassword">
                    <el-descriptions :column="1" border>
                        <el-descriptions-item label="会员ID">{{ userInfo.id }}</el-descriptions-item>
                        <el-descriptions-item label="姓名">{{ userInfo.name }}</el-descriptions-item>
                        <el-descriptions-item label="性别">{{ userInfo.gender }}</el-descriptions-item>
                        <el-descriptions-item label="年龄">{{ userInfo.age }}</el-descriptions-item>
                        <el-descriptions-item label="生日">{{ formatDate(userInfo.birth) }}</el-descriptions-item>
                        <el-descriptions-item label="联系电话">{{ userInfo.phone }}</el-descriptions-item>
                        <!-- <el-descriptions-item label="积分">{{ userInfo.score }}</el-descriptions-item> -->
                        <el-descriptions-item label="头像">
                            <div v-if="userInfo.pic" style="height: 120px; width: 120px; border-radius: 15px;">
                                <img :src="'http://localhost:8080' + userInfo.pic" alt=""
                                    style=" border-radius: 15px;width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>

                <!-- 编辑信息模式 -->
                <div v-if="isEditing">
                    <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="姓名" prop="name">
                                    <el-input v-model="editForm.name" style="width: 33%;" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="性别" prop="gender">
                                    <el-radio-group v-model="editForm.gender">
                                        <el-radio label="男" />
                                        <el-radio label="女" />
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="年龄" prop="age">
                                    <el-input-number v-model="editForm.age" :min="0" :max="150" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="生日" prop="birth">
                                    <el-date-picker v-model="editForm.birth" type="date" placeholder="选择日期"
                                        value-format="YYYY-MM-DD" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="联系电话" prop="phone">
                                    <el-input v-model="editForm.phone" style="width: 33%;" />
                                </el-form-item></el-col>
                            <el-col :span="12">
                                <el-form-item label="头像" prop="pic">
                                    <el-upload class="avatar-uploader" v-model:file-list="fileList"
                                        action="http://localhost:8080/upload" :on-remove="handleRemove"
                                        :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
                                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                        <img v-if="pic" :src="'http://localhost:8080' + pic.value" class="avatar" />
                                        <el-icon v-else class="avatar-uploader-icon">
                                            <Plus />
                                        </el-icon>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item>
                            <el-button type="primary" @click="submitEdit">保存</el-button>
                            <el-button @click="cancelEdit">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 修改密码模式 -->
                <div v-if="isChangingPassword">
                    <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
                        <el-form-item label="原密码" prop="oldPassword">
                            <el-input v-model="passwordForm.oldPassword" type="password" show-password />
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input v-model="passwordForm.newPassword" type="password" show-password />
                        </el-form-item>
                        <el-form-item label="确认密码" prop="confirmPassword">
                            <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitPasswordChange">确认修改</el-button>
                            <el-button @click="cancelPasswordChange">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getUserInfo, updateUserInfo, updatePassword } from '@/api/dao';
import { ref, reactive, onMounted, toRefs } from 'vue'
import {
    type FormInstance, type FormRules, type UploadUserFile, type UploadProps, ElMessage,
    ElMessageBox, type FormItemInstance
} from 'element-plus';
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'
import { useRouter, type Router } from 'vue-router'
const router: Router = useRouter()
const fileList = ref<UploadUserFile[]>([
])


// 用户信息
const userInfo = ref({
    id: 0,
    name: '',
    pwd: '',
    gender: '',
    age: 0,
    birth: '',
    phone: '',
    pic: '',
    score: 0
})

// 编辑模式状态
const isEditing = ref(false)
const isChangingPassword = ref(false)

// 编辑表单
const editForm = reactive({
    id: 0,
    name: '',
    gender: '',
    age: 0,
    birth: '',
    phone: '',
    pic: ''
})

let { name, id, gender, age, birth, phone, pic }
    = { ...toRefs(editForm) }

// 密码表单
const passwordForm = reactive({
    id: 0,
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// 表单引用
const editFormRef = ref(null)
const passwordFormRef = ref(null)

// 表单验证规则
const editRules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
    phone: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
}

const passwordRules = {
    oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
        } totally`
    )
}

/* 点击叉号执行删除之前的钩子 */
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
    return ElMessageBox.confirm(
        `确定删除${uploadFile.name}吗?`
    ).then(
        () => true,
        () => false
    )
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log('handleRemove', file, uploadFiles)
    /* 恢复 path 为 空串 */
    if (pic) pic.value = ''
}

// 验证确认密码
function validateConfirmPassword(rule, value, callback) {
    if (value !== passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
    } else {
        callback()
    }
}

// 日期格式化
function formatDate(date) {
    if (!date) return ''
    return new Date(date).toLocaleDateString()
}




// 获取用户信息
async function fetchUserInfo() {
    try {
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}')
        // 这里替换为实际的API请求
        const response = await getUserInfo(user.id)
        console.log('获取到的用户信息', response.data.data)
        userInfo.value = response.data.data
        Object.assign(editForm, {
            id: response.data.data.id,
            name: response.data.data.name,
            gender: response.data.data.gender,
            age: response.data.data.age,
            birth: response.data.data.birth,
            phone: response.data.data.phone,
            pic: response.data.data.pic
        })
    } catch (error) {
        ElMessage.error('获取用户信息失败')
        console.error(error)
    }
}

// 切换编辑模式
function toggleEditMode() {
    isEditing.value = true
    isChangingPassword.value = false
}

// 切换密码修改模式
function togglePasswordMode() {
    isEditing.value = false
    isChangingPassword.value = true
}

// 取消编辑
function cancelEdit() {
    isEditing.value = false
    Object.assign(editForm, {
        name: userInfo.value.name,
        gender: userInfo.value.gender,
        age: userInfo.value.age,
        birth: userInfo.value.birth,
        phone: userInfo.value.phone,
        pic: userInfo.value.pic
    })
}

// 取消密码修改
function cancelPasswordChange() {
    isChangingPassword.value = false
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
}

// 提交编辑
async function submitEdit() {
    console.log('提交编辑', editForm)
    try {
        editFormRef.value.validate(valid => {
            if (valid) {
                console.log('提交编辑', editForm)
                updateUserInfo(editForm)

                ElMessage.success('用户信息更新成功')
                fetchUserInfo() // 重新获取最新数据
                isEditing.value = false
            } else {
                ElMessage.error('请检查输入的内容')
            }
        })


        // 这里替换为实际的API请求

    } catch (error) {
        // if (error.response) {
        //     ElMessage.error(error.response.data.message || '更新失败')
        // } else if (!error.errors) {
        //     ElMessage.error('更新失败')
        // }
    }
}

// 提交密码修改
function submitPasswordChange() {
    passwordForm.id = userInfo.value.id

    passwordFormRef.value.validate(valid => {
        if (valid) {
            updatePassword(passwordForm).then(res => {

                if (res.data.data == 1) {
                    ElMessage.error('原密码错误')
                    return
                }

                console.log('密码修改结果', res)
                ElMessage.success('密码修改成功')
                cancelPasswordChange()
            })
        } else {
            ElMessage.error('请检查输入的内容')
        }
    })
}

// 头像上传处理
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    if (response.code == 200) {
        if (pic) {
            pic.value = response.data
            // unref(myUpload)?.clearValidate()
        }
    }
}

function beforeAvatarUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJpgOrPng) {
        ElMessage.error('头像图片只能是 JPG/PNG 格式!')
    }
    if (!isLt2M) {
        ElMessage.error('头像图片大小不能超过 2MB!')
    }
    return isJpgOrPng && isLt2M
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

// 初始化获取用户信息
onMounted(() => {
    fetchUserInfo()
})
</script>
<style scoped>
/* 全局容器样式 */
.app-container {
    width: 100%;
    min-height: 100vh;
    padding: 20px 0;
    background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7)),
        url("@/assets/images/cinema-bg.jpg") no-repeat center center;
    background-size: cover;
    color: #fff;
    font-family: 'Helvetica Neue', Arial, sans-serif;
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

/* 用户信息卡片样式 */
.user-profile-container {
    width: 1100px;
    margin: 30px auto;
    animation: fadeIn 0.5s ease;
}

.el-card {
    background: rgba(20, 20, 20, 0.85) !important;
    border: 1px solid #333;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    color: #f5f5f1;
    transition: all 0.3s ease;
}

.el-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(229, 9, 20, 0.3);
}

.el-card__header {
    background: rgba(229, 9, 20, 0.1) !important;
    border-bottom: 1px solid #333 !important;
    padding: 15px 20px !important;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header span {
    font-size: 18px;
    font-weight: bold;
    color: #f5f5f1;
    letter-spacing: 1px;
}

/* 描述列表样式 */
.el-descriptions {
    --el-descriptions-table-border: 1px solid #333;
}

.el-descriptions__header {
    margin-bottom: 20px;
}

.el-descriptions-item__label {
    color: #aaa;
    font-weight: normal;
}

.el-descriptions-item__content {
    color: #f5f5f1;
}

/* 表单元素样式 */
.el-form-item__label {
    color: #ccc !important;
}

.el-input__inner,
.el-input-number__decrease,
.el-input-number__increase,
.el-date-editor.el-input {
    background: rgba(50, 50, 50, 0.5) !important;
    border: 1px solid #444 !important;
    color: #f5f5f1 !important;
}

.el-input__inner::placeholder {
    color: #777 !important;
}

.el-radio__label {
    color: #ccc !important;
}

/* 按钮样式 */
.el-button {
    font-weight: bold;
    letter-spacing: 1px;
    transition: all 0.3s ease;
}

.el-button--primary {
    background: #e50914 !important;
    border-color: #e50914 !important;
}

.el-button--primary:hover {
    background: #f40612 !important;
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(229, 9, 20, 0.5);
}

.el-button--warning {
    background: #e67e22 !important;
    border-color: #e67e22 !important;
}

.el-button--warning:hover {
    background: #d35400 !important;
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(230, 126, 34, 0.5);
}

/* 头像上传样式 */
/* .avatar-uploader {
    border: 2px dashed #555 !important;
    background: rgba(50, 50, 50, 0.3) !important;
    transition: all 0.3s ease;
} */

/* .avatar-uploader:hover {
    border-color: #e50914 !important;
    background: rgba(229, 9, 20, 0.1) !important;
}

.avatar-uploader-icon {
    color: #666 !important;
    transition: all 0.3s ease;
} */

/* .avatar-uploader:hover .avatar-uploader-icon {
    color: #e50914 !important;
}

.avatar {
    border: 2px solid #e50914;
    box-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
} */

/* 下拉菜单样式 */
.el-dropdown-menu {
    background: #222 !important;
    border: 1px solid #333 !important;
}

.el-dropdown-menu__item {
    color: #ccc !important;
}

.el-dropdown-menu__item:hover {
    background: #e50914 !important;
    color: white !important;
}

/* 动画效果 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式调整 */
@media (max-width: 768px) {
    .user-profile-container {
        width: 95%;
        margin: 20px auto;
    }

    .header .title {
        font-size: 18px;
    }

    .header .title .logo {
        width: 30px;
        height: 30px;
    }
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
    border: 1px solid #fff;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>