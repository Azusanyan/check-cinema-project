/// <reference types="vite/client" />

/* 提示 ts 所有的.vue 后缀的文件 类型为 Components
来自 Vue 技术,这样 ts 就可以使用 SFC 单文件组件了,否则很可能
在 main.ts 中划红线不识别 根组件 */
declare module '*vue' {
    import { ComponentOptions } from "vue";
    const ComponentOptions: ComponentOptions
    export default ComponentOptions
}

declare module 'element-plus/dist/locale/zh-cn.mjs'
