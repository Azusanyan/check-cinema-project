<template>
    <div class="reg-container">
        <el-form class="reg-form" :model="regForm" :rules="regRules" status-icon ref="myRegForm">
            <h1 class="reg-title">用户注册</h1>
            <el-form-item prop="name">
                <el-input v-model="name" placeholder="请输入用户姓名" autofocus clearable></el-input>
            </el-form-item>
            <el-form-item prop="pwd">
                <el-input v-model="pwd" placeholder="请输入用户密码" show-password clearable></el-input>
            </el-form-item>
            <el-form-item prop="phone">
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
                <el-upload class="avatar-uploader" v-model:file-list="fileList" action="http://localhost:8080/upload"
                    :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="pic" :src="'http://localhost:8080' + pic" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round @click="submitForm(myRegForm)">注册</el-button>
                <el-button round @click="resetForm(myRegForm)">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, unref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import {
    type FormInstance, type FormRules, type UploadUserFile, type UploadProps, ElMessage,
    ElMessageBox, type FormItemInstance
} from 'element-plus';
import { reg } from '@/api/dao'


/* 获取 router 实例 */
const router: Router = useRouter()

/* 获取表单元素 对应 el-form 中的 ref */
let myRegForm = ref<FormInstance | undefined>()

let imageUrl = ref<string>('')

/* 封装注册表单的表单项 */
let regForm = reactive<RegUser>({
    name: '',
    pwd: '',
    gender: '',
    age: 1,
    birth: '',
    phone: '',
    pic: '',
    score: 0,
})
/* 转换 ref 解构 */
let { name, pwd, gender, age, birth, phone, pic, score }
    = { ...toRefs(regForm) }


/* 封装注册表单表单项的验证规则 */
let regRules = reactive<FormRules<RegUser>>({
    name: [
        { required: true, message: '请输入用户姓名', trigger: 'blur' },
    ],
    pwd: [
        { required: true, message: '请输入用户密码', trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9_]*$/, message: '只能英文数字下划线组成'
            , trigger: 'blur'
        }
    ],
    phone: [
        { required: true, message: '请输入电话号码', trigger: 'blur' },
        {
            pattern: /^(?:(?:\+|00)86)?1\d{10}$/
            , message: '请输入合法电话号码', trigger: 'blur'
        }
    ],
})

const ageByBirth = () => {
    const date1: Date = new Date(birth.value);
    const date2: Date = new Date();

    const timeDifference: number = date1.getTime() - date2.getTime();

    const daysDifference: number = Math.abs(Math.floor(timeDifference / (1000 * 60 * 60 * 24)));
    return daysDifference
}

/* 此函数用来重置表单 */
const resetForm = (formEl: FormInstance | undefined) => {
    /* 如果无法获取表单对象 返回 */
    if (!formEl) return
    /* 重置表单注意 每个字段必须设置了 prop 属性 */
    formEl.resetFields()
    router.push('/')
}

/* 此函数用来提交表单 完成注册 */
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return /* 如果没有表单对象返回 */
    /* 表单提交,如果校检成功,则 valid 为 true,但凡有一个校检失败 valid 为 false
    fileds 就是那个出问题的表单项 */
    await formEl.validate((valid, fields) => {
        /* 如果验证通过 */
        if (valid) {
            age.value = Math.floor(ageByBirth() / 365)
            reg(regForm).then(res => {
                ElMessage({
                    type: res.data.code == 200 ? 'success' : 'error',
                    message: res.data.msg,
                    showClose: true,
                })
                if (res.data.code == 200) {
                    router.push('/')
                }
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}

/* 获取 ref 属性值为 myUpload 的 <el-form-item> 元素 */
const myUpload = ref<FormItemInstance | undefined>()

/* 封装用户已经上传成功的文件列表,如果存在文件,则内部结构如下 */
const fileList = ref<UploadUserFile[]>([
])
/* 超过最大上传个数执行的钩子 */
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
        } totally`
    )
}

/* 上传之前最后一个钩子,用来验证 */
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

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    if (response.code == 200) {
        if (pic) {
            pic.value = response.data
            unref(myUpload)?.clearValidate()
        }
    }
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

/* 点击叉号执行删除之后执行的钩子 */
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    console.log('handleRemove', file, uploadFiles)
    /* 恢复 path 为 空串 */
    if (pic) pic.value = ''
}

</script>
<style scoped>
/* 主容器样式 */
.reg-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
        url("@/assets/images/cinema-reg-bg.jpg") no-repeat center center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 注册表单样式 */
.reg-form {
    background-color: rgba(0, 0, 0, 0.7);
    width: 420px;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 注册标题样式 */
.reg-title {
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.8rem;
    font-weight: 400;
    letter-spacing: 1px;
    text-transform: uppercase;
    position: relative;
}

.reg-title:after {
    content: "";
    display: block;
    width: 60px;
    height: 3px;
    background: #e50914;
    margin: 15px auto 0;
}

/* 表单项目样式 */
.el-form-item {
    margin-bottom: 25px;
    width: 100%;
}

.el-form-item__label {
    color: #fff !important;
    font-size: 1rem;
    padding-bottom: 8px;
    display: block;
}

/* 输入框样式 */
.el-input {
    width: 100% !important;
}

.el-input :deep(.el-input__wrapper) {
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    box-shadow: none;
    border-radius: 4px;
}

.el-input :deep(.el-input__inner) {
    color: #fff;
}

.el-input :deep(.el-input__inner::placeholder) {
    color: rgba(255, 255, 255, 0.5);
}

/* 单选按钮样式 */
.el-radio-group :deep(.el-radio__label) {
    color: #fff;
}

.el-radio-group :deep(.el-radio__inner) {
    border-color: rgba(255, 255, 255, 0.5);
}

.el-radio-group :deep(.el-radio__input.is-checked .el-radio__inner) {
    background-color: #e50914;
    border-color: #e50914;
}

/* 日期选择器样式 */
.el-date-picker {
    width: 100%;
    margin-bottom: 25px;
}

.el-date-picker :deep(.el-input__wrapper) {
    background-color: rgba(255, 255, 255, 0.1);
}

.avatar-uploader .el-upload {
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

.el-date-picker :deep(.el-input__inner) {
    color: #fff;
}

/* 上传组件样式 */
.el-upload {
    width: 100% !important;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.el-upload :deep(.el-button) {
    background-color: #e50914;
    border-color: #e50914;
    color: #fff;
    margin-bottom: 10px;
}

.el-upload :deep(.el-button:hover) {
    background-color: #f40612;
    border-color: #f40612;
}

.el-upload__tip {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    margin-top: 5px;
}

/* 年龄显示样式 */
.el-form-item:has(> div:contains("年龄")) {
    color: #fff;
    font-size: 0.9rem;
    margin-bottom: 15px;
}

/* 按钮样式 */
.el-button {
    margin: 0 8px;
    transition: all 0.3s ease;
    letter-spacing: 1px;
    font-weight: 400;
    min-width: 80px;
}

.el-button--primary {
    background-color: #e50914;
    border-color: #e50914;
    color: #fff;
}

.el-button--primary:hover {
    background-color: #f40612;
    border-color: #f40612;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(229, 9, 20, 0.4);
}

.el-button--default {
    color: #fff;
    background-color: transparent;
    border-color: rgba(255, 255, 255, 0.3);
}

.el-button--default:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
}
</style>