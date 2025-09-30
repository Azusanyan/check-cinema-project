<template>
    <el-container class="layout-container" direction="vertical">

        <AppHeader/>
        <Appmain/>
    </el-container>
</template>

<script setup lang="ts">
/* 导入页眉组件 */
import AppHeader from './components/appheader.vue'
import Appmain from './components/appmain.vue'

</script>

<style scoped>
.layout-container{
    /* 设置容器整体高度占满屏幕 */
    height:100vh;
    background-color: whitesmoke;
    margin: 0;
    padding: 0;
    border: none;
}
</style>