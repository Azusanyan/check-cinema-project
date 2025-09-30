
<template>
    <!-- height:注意 此属性不是 html 属性 而是 ElementPlus 页眉属性 -->
    <el-header class="header" height="5vh">
        <h1 class="title">
        <img src="../../assets/etoak_logo.png" class="logo"/>
            易卖网
        </h1>
        <el-menu 
        :default-active="route.path ? route.path : ''"
        class="el-menu-demo" 
        mode="horizontal" 
        :ellipsis="false"
        background-color="#292e49"
        text-color="#fff"
        :router="true"
        style="height: 8vh;">
            <div class="flex-grow" />
            <el-menu-item index="/home">购票首页</el-menu-item>
            <el-menu-item index="/manage" >电影场次管理</el-menu-item>
        </el-menu>
        <h1 class="title">欢迎回来</h1>
    </el-header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()




</script>

<style scoped>
/* 设置页眉 */
.layout-container .header {
    /* 设置内部文本颜色 */
    color: whitesmoke;
    /* 设置渐变背景色 
    to right 表示渐变方向这里是 从左往右 后面是渐变的颜色选项,可以书写多种 */
    background-color: #292e49;
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
