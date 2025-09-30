<template>
    <div class="login-container">
        <div class="cinema-header">
            <h1>电影售票系统</h1>
            <p>欢迎您的登录</p>
        </div>
        <el-form class="login-form" :model="loginForm" :rules="loginRules" ref="myLoginForm" status-icon size="default"
            label-width="auto" label-position="left">
            <h1 class="login-title">用户登录</h1>
            <el-form-item label="用户姓名" prop="name">
                <el-input v-model="name" placeholder="请输入用户姓名(必填)" clearable></el-input>
            </el-form-item>
            <!-- show-password 只要添加此属性,则变为密码框 -->
            <el-form-item label="用户密码" prop="pwd">
                <el-input v-model="pwd" show-password placeholder="请输入用户密码(必填)" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button style="width: 100%;" type="primary" round @click="submitForm(myLoginForm)">登录</el-button>
            </el-form-item>
            <div class="register-link">
                <span> 没有账号，点击<a href="/register">注册</a></span>
                <div @click="router.push('/userLogin')">管理员登录</div>
            </div>
            <!-- <div>
                <el-button type="primary" round plain @click="router.push({ path: '/register' })">注册</el-button>
                <el-icon @click="router.push('/userLogin')" size="20px" style="margin-left: 15px;">
                    <User />
                </el-icon>
            </div> -->



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
import { login } from '@/api/dao'

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
        { required: true, message: '请输入用户姓名!', trigger: 'blur', },
    ],
    /* 用户密码的验证规则 */
    pwd: [
        { required: true, message: '请输入用户密码!', trigger: 'blur', },
    ]
})


const resetForm = (formEl: FormInstance | undefined) => {
    /* 如果无法获取表单对象 返回 */
    if (!formEl) return
    /* 重置表单注意 每个字段必须设置了 prop 属性 */
    formEl.resetFields()
}

/* 
    此函数用来进行表单的提交,之后进入登录的业务逻辑
    async 表示异步函数，内部可以使用异步函数
*/
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return /* 如果没有表单对象返回 */
    /* 表单提交,如果校检成功,则 valid 为 true,但凡有一个校检失败 valid 为 false
    fileds 就是那个出问题的表单项 */
    await formEl.validate((valid, fields) => {
        if (valid) {
            login(name.value, pwd.value)
                .then(res => {
                    // ElMessage({
                    //     type: res.data.code == 200 ? 'success' : 'error',
                    //     message: res.data.msg,
                    //     showClose: true,
                    // })

                    /* 如果业务逻辑成功(登录成功) */
                    if (res.data.code == 200) {
                        myUserRstStore.regUser = res.data.data
                        myUserRstStore.userId = res.data.data.id
                        localStorage.setItem('userInfo', JSON.stringify(res.data.data))
                        /* 激活 #/layout 哈希显示 圣杯布局组件 */
                        router.push({
                            path: '/home',
                        })
                    }else {
                        ElMessage({
                            type: 'error',
                            message: '账号或密码错误，请重新输入',
                            showClose: true,
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
/* 主容器样式 */
.login-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
        url("https://img.51miz.com/Element/00/82/44/29/ccdee28e_E824429_866f764f.jpg") no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Helvetica Neue', Arial, sans-serif;
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

.register-link {
    color: #fff;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
}
.register-link a {
    margin-left: 5px;
    font-size: 14px;
    color: rgb(8, 155, 247);
    text-decoration: none;
    transition: all 0.3s ease;
}

/* 登录表单样式 */
.login-form {
    background-color: rgba(0, 0, 0, 0.7);
    width: 380px;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 登录标题样式 */
.login-title {
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.8rem;
    font-weight: 400;
    letter-spacing: 1px;
    text-transform: uppercase;
    position: relative;
}

.login-title:after {
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
}

.el-form-item__label {
    color: #fff !important;
    font-size: 1rem;
    padding-bottom: 8px;
    display: block;
}

/* 输入框样式 */
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

/* 用户图标样式 */
.el-icon {
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
}

.el-icon:hover {
    color: #e50914;
    transform: scale(1.1);
}
</style>