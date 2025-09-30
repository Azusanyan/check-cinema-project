<template>
    <div class="login-container">
        <div class="cinema-header">
            <h1>电影售票系统</h1>
            <p>欢迎管理员登录</p>
        </div>
        <el-form class="login-form" :model="loginForm" :rules="loginRules" ref="myLoginForm" status-icon size="default"
            label-width="auto" label-position="left">
            <h1 class="login-title">管理员登录</h1>
            <el-form-item label="管理员姓名" prop="name">
                <el-input v-model="name" placeholder="请输入用户姓名(必填)" clearable></el-input>
            </el-form-item>
            <el-form-item label="管理员密码" prop="pwd">
                <el-input v-model="pwd" show-password placeholder="请输入用户密码(必填)" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round style="width: 100%;" @click="submitForm(myLoginForm)">登录</el-button>
            </el-form-item>
            <div class="register-link">
                <span> 没有账号，点击<a href="/register">注册</a></span>
            </div>
        </el-form>
    </div>
</template>


<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
/* 导入 ElementPlus 中 表单的类型 和 表单验证的类型 */
import { type FormInstance, type FormRules, ElMessage } from 'element-plus';
/* 从 VueRouter 中导入 useRouter函数 此函数可以创建一个 router
此对象可以激活哈希通过路由传值 */
import { useRouter, type Router } from 'vue-router'
import { useCinemaStore } from '@/stores/counter'
/* 导入接口函数 */
import { login, UserLogin } from '@/api/dao'

const myUserRstStore = useCinemaStore()
myUserRstStore.regUser = undefined

/* 一般 router 用来激活哈希 传递数据 而 route 用来接受数据 */
const router: Router = useRouter()


/* 封装表单对象 根据页面中的 ref 属性获取元素 */
let myLoginForm = ref<FormInstance | undefined>()

/* 封装表单项 对应表单中的 :model="对应这里" */
let loginForm = reactive<LoginUser>({
    name: '',
    pwd: '',
})
/* 转换为 ref 后解构 */
let { name, pwd } = { ...toRefs(loginForm) }

/* 封装对表单项的验证规则 :rules="对应这里" */
let loginRules = reactive<FormRules<LoginUser>>({
    /* 用户姓名的验证规则 此处也对应 el-form-item 中的 prop 属性 */
    name: [
        /* 
            required:true 表示必填
            message:报错信息 trigger:激发事件,这里是失去焦点时激发
        */
        { required: true, message: '请输入用户姓名!', trigger: 'blur', },
    ],
    /* 用户密码的验证规则 */
    pwd: [
        { required: true, message: '请输入用户密码!', trigger: 'blur', },
    ]
})

/* 
    此函数用来重置表单 
    formEl:形参 就是通过 ref 获取的表单对象
*/
const resetForm = (formEl: FormInstance | undefined) => {
    /* 如果无法获取表单对象 返回 */
    if (!formEl) return
    /* 重置表单注意 每个字段必须设置了 prop 属性 */
    formEl.resetFields()
}

/* 
    此函数用来进行表单的提交,之后进入登录的业务逻辑
*/
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return /* 如果没有表单对象返回 */
    /* 表单提交,如果校检成功,则 valid 为 true,但凡有一个校检失败 valid 为 false
    fileds 就是那个出问题的表单项 */
    await formEl.validate((valid, fields) => {
        if (valid) {
            UserLogin(name.value, pwd.value)
                .then(res => {
                    ElMessage({
                        type: res.data.code == 200 ? 'success' : 'error',
                        message: res.data.msg,
                        showClose: true,
                    })
                    /* 如果业务逻辑成功(登录成功) */
                    if (res.data.code == 200) {
                        myUserRstStore.userId = res.data.data
                        localStorage.setItem('adminId', JSON.stringify(res.data.data))
                        router.push({
                            path: '/homeView',
                        })
                    }
                })
        } else {
            console.log('error submit!', fields)
        }
    })
}

</script>

<style scoped>
.login-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
        url("https://ts1.tc.mm.bing.net/th/id/R-C.b2bea884911329e8a9cb22176c9625a0?rik=MXYDcsoMErPAXg&riu=http%3a%2f%2fn.sinaimg.cn%2fsinacn19%2f128%2fw2048h1280%2f20180320%2fecbb-fyskeuc8357977.jpg&ehk=q63QuQc1IEqWRD7b3DicfyzP36piZwnkRHtNxsRIjow%3d&risl=&pid=ImgRaw&r=0") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Helvetica Neue', Arial, sans-serif;
}

.register-link {
    color: #fff;
    font-size: 12px;
}
.register-link a {
    margin-left: 5px;
    font-size: 14px;
    color: rgb(8, 155, 247);
    text-decoration: none;
    transition: all 0.3s ease;
}

.cinema-header {
    text-align: center;
    margin-bottom: 40px;
    color: #fff;
}

.cinema-header h1 {
    font-size: 3rem;
    margin-bottom: 10px;
    font-weight: 300;
    letter-spacing: 3px;
    text-transform: uppercase;
}

.cinema-header p {
    font-size: 1.2rem;
    opacity: 0.8;
    font-weight: 300;
    letter-spacing: 1px;
}

.login-form {
    background-color: rgba(0, 0, 0, 0.6);
    width: 380px;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.login-title {
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.8rem;
    font-weight: 400;
    letter-spacing: 1px;
}

.el-form-item {
    margin-bottom: 25px;
}

.el-form-item__label {
    color: #fff !important;
    font-size: 1rem;
    padding-bottom: 8px;
    display: block;
}

.el-input {
    width: 100%;
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

.el-button {
    margin: 0 8px;
    transition: all 0.3s ease;
    letter-spacing: 1px;
    font-weight: 400;
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

.el-button--primary.is-plain {
    color: #e50914;
    background-color: transparent;
    border-color: #e50914;
}

.el-button--primary.is-plain:hover {
    background-color: rgba(229, 9, 20, 0.1);
    color: #fff;
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