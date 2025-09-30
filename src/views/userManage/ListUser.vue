<template>
    <!-- 添加用户 -->
    <el-button plain @click="add()" style="margin:10px 0">
        添加用户
    </el-button>

    <el-dialog v-model="dialogAddUser" title="添加用户" width="500">
        <el-form :model="user" class="demo-form-inline" ref="myAddForm" :rules="addRules">
            <el-form-item label="用户姓名" prop="name">
                <el-input v-model="user.name" placeholder="请输入用户姓名" clearable />
            </el-form-item>
            <el-form-item label="用户密码" prop="pwd">
                <el-input v-model="user.pwd" placeholder="请输入用户密码" clearable show-password />
            </el-form-item>
            <el-form-item label="用户电话" prop="phone">
                <el-input v-model="user.phone" placeholder="请输入用户电话" clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="resetForm(myAddForm)">取消</el-button>
                <el-button type="primary" @click="addUser(myAddForm)">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 用户列表 -->
    <el-table :data="us" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="pwd" label="密码" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column label="权限">
            <template #default="scope">
                <span v-for="t in scope.row.roles">
                    <el-tag :type="t.id === 1 ? 'warning' : 'success'">
                        {{ t.name }}
                    </el-tag>
                    &nbsp;
                </span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { queryAllUserInfo, updateUserRole, addUserAPI } from '@/api/dao'
import { ref, reactive, toRefs } from 'vue'
import { type FormInstance, type FormRules, ElMessage } from 'element-plus';
import axios from 'axios';



const us = ref<Array<User>>([])
const rs = ref<Array<Role>>([])
const ms = ref<Array<Menu>>([])

const queryAll = () => {
    queryAllUserInfo().then(res => {
        us.value = res.data.data.user
        rs.value = res.data.data.roles
        ms.value = res.data.data.menus
    })
}
queryAll()


/* 添加用户的弹窗 */
const dialogAddUser = ref(false)
const user = ref<User>({
    id: 1,
    name: '',
    pwd: '',
    phone: '',
    roles: []
})


let myAddForm = ref<FormInstance | undefined>()
const resetForm = (formEl: FormInstance | undefined) => {
    /* 如果无法获取表单对象 返回 */
    if (!formEl) return
    /* 重置表单注意 每个字段必须设置了 prop 属性 */
    formEl.resetFields()
}

const add = () => {
    resetForm(myAddForm.value)
    dialogAddUser.value = true
}

/* 封装对表单项的验证规则 :rules="对应这里" */
let addRules = reactive<FormRules<User>>({
    /* 用户姓名的验证规则 此处也对应 el-form-item 中的 prop 属性 */
    name: [
        { required: true, message: '请输入用户姓名!', trigger: 'blur', },
    ],
    /* 用户密码的验证规则 */
    pwd: [
        { required: true, message: '请输入用户密码!', trigger: 'blur', },
    ],
    phone: [
        { required: true, message: '请输入电话号码', trigger: 'blur' },
        {
            pattern: /^(?:(?:\+|00)86)?1\d{10}$/
            , message: '请输入合法电话号码', trigger: 'blur'
        }
    ],
})


const addUser = async (formEl: FormInstance | undefined) => {
    if (!formEl) return /* 如果没有表单对象返回 */
    await formEl.validate((valid, fields) => {
        if (valid) {
            addUserAPI(user.value).then(res => {
                ElMessage({
                    type: res.data.code === 200 ? 'success' : 'error',
                    message: res.data.msg
                })
                queryAll()
                dialogAddUser.value = false
            })
        }
    })
}


</script>

<style scoped></style>