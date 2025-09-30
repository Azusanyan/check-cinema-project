<template>
    <div class="question-page">
        <el-header class="header" height="5vh">
            <h1 class="title">
                <img src="https://www.logosc.cn/oss/icons/2021/12/02/wfVSt-aPavSh0XR.png" class="logo">
                影厅影院管理系统
            </h1>
            <!-- <h1 class="title">欢迎回来</h1> -->
            <el-dropdown @command="handleCommand">
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
        <div>
            <h1 style="color: #fff;">向商家提问</h1>

            <div class="question-form">
                <h3>我要提问</h3>
                <textarea v-model="newQuestion" placeholder="请输入您的问题..." @keyup.enter="submitQuestion"></textarea>
                <button class="submit-btn" @click="submitQuestion">提交问题</button>
            </div>

            <div class="questions-list">
                <h3>我的提问记录</h3>
                <div v-if="loading" class="loading">正在加载问题记录...</div>
                <div v-else-if="questions.length === 0" class="no-questions">暂无提问记录</div>
                <div v-else class="questions-container">
                    <div v-for="question in questions" :key="question.id" class="question-item">
                        <div class="question-text">{{ question.question }}</div>
                        <div v-if="question.answer" class="answer-text">平台回复: {{ question.answer }}</div>
                        <div v-else class="unanswered">商家尚未回复</div>
                        <div class="time">
                            提问时间: {{ formatDateTime(question.questionTime) }}
                            <span v-if="question.answerTime"> | 回复时间: {{ formatDateTime(question.answerTime) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';
import { saveQuestion, selectPage } from '@/api/dao';
import { useRouter } from 'vue-router'

export default {
    setup () {
        const newQuestion = ref('');
        const questions = ref([]);
        const loading = ref(true);
        const error = ref(null);
        const queryForm = ref({
            uid: 0,
            pageNum: 1,
            pageSize: 10
        });

        const router = useRouter()

        // 获取当前用户ID (实际项目中应从登录状态获取)
        // const getCurrentUserId = () => {
        //     return JSON.parse(localStorage.getItem('userInfo')).id || 0;
        // };

        // 格式化日期时间
        const formatDateTime = (datetimeStr) => {
            if (!datetimeStr) return '';
            const dt = new Date(datetimeStr);
            return dt.toLocaleString();
        };

        // 获取问题列表
        const fetchQuestions = async () => {
            try {
                loading.value = true;
                // 模拟API调用
                // 实际项目中应替换为真实的API调用
                // const response = await fetch(`/api/questions?uid=${getCurrentUserId()}`);
                queryForm.value.uid = JSON.parse(localStorage.getItem('userInfo')).id

                selectPage(queryForm.value).then(res => {
                    questions.value = res.data.data.rows
                })
                // const data = await response.json();

            } catch (err) {
                error.value = '加载问题记录失败，请刷新重试';
                console.error('Error fetching questions:', err);
            } finally {
                loading.value = false;
            }
        };

        // 提交问题
        const submitQuestion = async () => {
            const questionText = newQuestion.value.trim();

            if (!questionText) {
                alert('请输入问题内容');
                return;
            }

            try {
                // 模拟API调用
                // 实际项目中应替换为真实的API调用
                // const response = await fetch('/api/questions', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({
                //         question: questionText,
                //         uid: getCurrentUserId()
                //     })
                // });



                // const data = await response.json();

                let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                let jsonData = {
                    uid: userInfo.id,
                    question: questionText,
                    flag: 0,
                }

                saveQuestion(jsonData).then(res => {
                    ElMessage.success('问题提交成功！');
                    newQuestion.value = ''
                    fetchQuestions()
                })

            } catch (err) {
                console.error('Error submitting question:', err);
                alert('提交过程中出错');
            }
        };

        const logout = () => {

            router.replace('/');
        }
        const handleCommand = (command) => {
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


        // 组件挂载时获取问题列表
        onMounted(() => {
            fetchQuestions();
        });

        return {
            newQuestion,
            questions,
            loading,
            error,
            submitQuestion,
            formatDateTime,
            handleCommand
        };
    }
};
</script>

<style scoped>
.container {
    width: 100%;
    height: 100vh;
    background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)),
        url("@/assets/images/cinema-bg-dark.jpg") no-repeat center center;
    background-size: cover;
    padding: 20px;
}

.question-page {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    /* padding: 20px; */
    font-family: 'Arial', sans-serif;
    /* background-color: #f5f5f5; */
    background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)),
        url("@/assets/images/cinema-bg-dark.jpg") no-repeat center center;
    background-size: cover;
    overflow: auto;
}

.question-page h1 {
    text-align: center;
    margin-bottom: 30px;
}

.question-form {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.question-form h3 {
    margin-top: 0;
    color: #444;
}

.question-form textarea {
    width: 98%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-height: 100px;
    margin-bottom: 15px;
    resize: vertical;
    font-family: inherit;
    font-size: 14px;
}

.submit-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.submit-btn:hover {
    background-color: #45a049;
}

.questions-list {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.questions-list h3 {
    margin-top: 0;
    color: #444;
}

.loading,
.no-questions {
    text-align: center;
    padding: 20px;
    color: #666;
}

.question-item {
    border-bottom: 1px solid #eee;
    padding: 15px 0;
}

.question-item:last-child {
    border-bottom: none;
}

.question-text {
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
}

.answer-text {
    color: #666;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 4px;
    margin-top: 5px;
    border-left: 3px solid #4CAF50;
}

.unanswered {
    color: #ff9800;
    font-style: italic;
}

.time {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}

.error {
    color: #f44336;
    text-align: center;
    padding: 10px;
    background-color: #ffebee;
    border-radius: 4px;
    margin-bottom: 15px;
}

.header {
    /* 设置内部文本颜色 */
    color: whitesmoke;
    /* 设置渐变背景色 
    to right 表示渐变方向这里是 从左往右 后面是渐变的颜色选项,可以书写多种 */

    padding: 0px 20px;
    /* background-color: rgba(0, 0, 0, 0.8); */
    background: linear-gradient(to right, #141414, #e50914);
    border-radius: 4px;
    border-bottom: 3px solid #e50914;
    transition: all 0.3s ease;


    /* 页眉开启弹性盒子 */
    display: flex;
    /* 设置主轴两端对齐 */
    justify-content: space-between;
    /* 设置交叉轴居中 */
    align-items: center;
    height: 8vh;
}

/* 设置 logo */
.header .title .logo {
    /* logo 宽度 */
    width: 25px;
    vertical-align: middle;
}

/* 设置标题 */
.header .title {
    /* 设置标题阴影 */
    text-shadow: 5px 5px 3px black;
    /* 设置标题向右偏移 */
    margin-left: 50px;
    /* 设置标题大小 */
    font-size: large;
}

/* 设置文本提示信息 */
.header .info {
    /* 向左偏移 100 像素 */
    margin-right: 10px;
    /* 添加阴影 */
    text-shadow: 6px 6px 3px black;
    /* 字体大小 */
    font-size: large;
}
</style>