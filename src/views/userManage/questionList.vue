<template>
    <div class="container">
        <!-- 查询表单 -->
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
            <el-form-item label="问题内容">
                <el-input v-model="queryForm.question" placeholder="请输入问题内容" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleQuery" icon="Search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click="resetQuery()" icon="Delete">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 新增按钮 -->
        <!-- <el-row>
            <el-col :span="24">
                <el-button type="primary" plain @click="addQuestion()">新增问题</el-button>
            </el-col>
        </el-row> -->

        <!-- 表格 -->
        <div style="margin-top: 20px;">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="aname" label="平台用户" />
                <el-table-column prop="question" label="问题内容" />
                <el-table-column prop="userName" label="管理员名称" />
                <el-table-column prop="answer" label="平台回复" />
                <el-table-column prop="questionTime" label="提问时间">
                    <template #default="scope">
                        {{ formatDateTime(scope.row.questionTime) }}

                    </template>
                </el-table-column>
                <el-table-column prop="answerTime" label="回答时间">
                    <template #default="scope">
                        {{ formatDateTime(scope.row.answerTime) }}
                    </template>
                </el-table-column>
                <el-table-column prop="flag" label="回复状态">
                    <template #default="scope">
                        <el-tag :type="scope.row.flag === 1 ? 'success' : 'danger'">
                            {{ scope.row.flag === 1 ? '已回复' : '未回复' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="warning" link v-if="scope.row.flag === 0"
                            @click="handleEdit(scope)">回复</el-button>
                        <el-button type="danger" link @click="handleDelete(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div style="text-align: center;margin: 10px 0px;">
                <el-pagination v-model:current-page="queryForm.pageNum" v-model:page-size="queryForm.pageSize"
                    :page-sizes="[5, 10, 20, 40]" layout="sizes, prev, pager, next" :total="total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>

        <!-- 添加/编辑问题弹窗 -->
        <el-dialog v-model="dialogVisible" :title="formTitle">
            <el-form :model="questionForm" :rules="questionRules" ref="questionFormRef" label-width="100px">
                <el-form-item label="问题内容" prop="question">
                    <el-input v-model="questionForm.question" autocomplete="off" disabled />
                </el-form-item>
                <el-form-item label="平台回复" prop="answer">
                    <el-input type="textarea" :rows="4" v-model="questionForm.answer" autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveQuestion">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { selectPage, saveQuestion, updateQuestion, deleteQuestionById } from '@/api/dao'

// 查询表单
const queryForm = reactive({
    question: '',
    pageNum: 1,
    pageSize: 10,
})
const total = ref(0)
const tableData = ref([])

// 获取问题列表
const getList = () => {
    selectPage(queryForm).then((res) => {
        tableData.value = res.data.data.rows
        total.value = res.data.data.total
    })
}
getList()


const formatDateTime = (datetimeStr) => {
    if (!datetimeStr) return '';
    const dt = new Date(datetimeStr);
    return dt.toLocaleString();
};
// 查询
const handleQuery = () => {
    getList()
}

// 重置查询
const resetQuery = () => {
    queryForm.question = ''
    queryForm.pageNum = 1
    queryForm.pageSize = 10
    getList()
}

// 分页
const handleSizeChange = (val: number) => {
    queryForm.pageSize = val
    getList()
}
const handleCurrentChange = (val: number) => {
    queryForm.pageNum = val
    getList()
}

// 添加/编辑问题
const dialogVisible = ref(false)
const formTitle = ref('添加问题')
const questionForm = reactive({
    id: 0,
    question: '',
    answer: '',
    aid: 0,
})
const questionRules = reactive({
    question: [{ required: true, message: '请输入问题内容', trigger: 'blur' }],
    answer: [{ required: true, message: '请输入平台回复', trigger: 'blur' }],
})
const questionFormRef = ref()

// 打开新增弹窗
const addQuestion = () => {
    formTitle.value = '添加问题'
    questionForm.id = 0
    questionForm.question = ''
    questionForm.answer = ''
    dialogVisible.value = true
}

// 打开编辑弹窗
const handleEdit = (scope: any) => {
    formTitle.value = '编辑问题'
    questionForm.id = scope.row.id
    questionForm.question = scope.row.question
    questionForm.answer = scope.row.answer
    dialogVisible.value = true
}

// 保存问题
const saveQuestion = () => {
    questionFormRef.value?.validate((valid: boolean) => {
        if (valid) {
            if (questionForm.id === 0) {
                // 添加问题
                saveQuestion(questionForm).then((res) => {
                    ElMessage.success(res.data.msg)
                    dialogVisible.value = false
                    getList()
                })
            } else {
                let adminId = localStorage.getItem('adminId')
                console.log('adminId', adminId)
                questionForm.aid = Number(adminId)
                // 编辑问题
                updateQuestion(questionForm).then((res) => {
                    ElMessage.success('回复成功')
                    dialogVisible.value = false
                    getList()
                })
            }
        }
    })
}

let adminId = localStorage.getItem('adminId')
console.log('adminId', adminId)
// 删除问题
const handleDelete = (scope: any) => {
    deleteQuestionById(scope.row.id).then((res) => {
        ElMessage.success('删除成功')
        getList()
    })
}
</script>

<style scoped>
.container {
    padding: 20px;
}
</style>