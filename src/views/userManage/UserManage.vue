<template>
    <el-card class="box-card">
        用户列表:&nbsp;&nbsp;
        <el-select v-model="uid" class="m-2" placeholder="请选择用户" @change="queryRoleByUser" style="width: 240px">
            <el-option v-for="u in us" :label="u.name" :value="u.id" />
        </el-select>
        <el-checkbox-group v-model="rids" style="margin-top: 20px;">
            <el-checkbox v-for="r in rs" :label="r.id" name="type">{{ r.name }}</el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" @click="updateUser">更新</el-button>
    </el-card>
    <el-card class="box-card">
        角色列表:&nbsp;&nbsp;
        <el-select v-model="rid" class="m-2" placeholder="请选择角色" @change="queryMenuByRole" st yle="width: 240px">
            <el-option v-for="r in rs" :label="r.name" :value="r.id" />
        </el-select>
        <el-tree ref="treeRef" :data="Menus" :props="defaultProps" @check-change="handleCheckChange" show-checkbox
            node-key="id" :check-strictly="true" />
        <el-button type="primary" @click="updateRoleMenus">更新</el-button>
    </el-card>

    <!-- <h2>
        树形选择
    </h2>
    <el-tree-select  v-model="value" :data="Menus" multiple :render-after-expand="false" show-checkbox check-strictly
        check-on-click-node style="width: 240px" :props="Props" node-key="id" /> -->
</template>

<script setup lang="ts">
import { queryAllUserInfo, updateUserRole } from '@/api/dao'
import { ref, reactive, toRefs } from 'vue'
import axios from 'axios'
import { ElTree } from 'element-plus'

const userRole = reactive<UserRole>({
    uid: '',
    rids: []
})
let { uid, rids } = { ...toRefs(userRole) }

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

const queryRoleByUser = (id: number) => {
    rids.value = []
    us.value.forEach(u => {
        if (u.id == id) {
            if (u.roles) {
                u.roles.forEach(r => {
                    rids.value.push(r.id)
                })
            }
        }
    })
}

/* 更新用户角色--------- */
const updateUser = () => {
    updateUserRole(userRole).then(res => {
        uid.value = ''
        rids.value = []
        queryAll()
    })
}


/* 树节点 -----------------------------------------*/
const menuRole = reactive<MenuRole>({
    rid: '',
    menus: []
})
let { rid, menus } = { ...toRefs(menuRole) }


const Menus = ref([])
const RoleMenus = ref([])

const queryMenuByRole = () => {
    treeRef.value!.setCheckedKeys([], false)
    axios.get(`http://localhost:8080/user/queryMenusByRoleId?rid=${rid.value}`)
        .then(res => {
            RoleMenus.value = res.data.data
            treeRef.value!.setCheckedKeys(RoleMenus.value, false)
            console.log(res.data.data)
        })
}

const treeRef = ref<InstanceType<typeof ElTree>>()

const queryAllMenu = () => {
    Menus.value = []
    axios.get(`http://localhost:8080/user/queryAllMenus`)
        .then(res => {
            Menus.value = res.data.data
        })
}
queryAllMenu()


const defaultProps = {
    label: 'text',
    children: 'nodes',
}

/* 选择的树节点 */
const TreeIds = ref<Array<number>>([])
const handleCheckChange = (nodeData: any) => {
    TreeIds.value = []
    treeRef.value?.getCheckedNodes().forEach(x => {
        TreeIds.value.push(x.id)
    })
}

const updateRoleMenus = () => {
    axios.post(`http://localhost:8080/user/updateRoleMenus`, {
        rid: rid.value,
        menus: TreeIds.value
    })
        .then(res => {
            queryAllMenu()
            rid.value = ''
            treeRef.value!.setCheckedKeys([], false)
        })
}


/* 树形选择 */
const value = ref([])
const Props = {
    label: 'text',
    children: 'nodes',
}



</script>

<style scoped></style>