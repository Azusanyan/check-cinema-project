/* 导入 axios 依赖 */
import axios from "axios";
/* 创建一个我们自己的自定义 axios 实例,这个实例可以配置多个参数
从而实现一次书写多处使用的可能 */
const request = axios.create({
    /* 设置基本地址 这里读取的就是 配置文件 .env.development 文件中的
    http://db.etoak.com:9527 */
    baseURL: import.meta.env.VITE_APP_BASE_API,
    /* 设置超时时间,如果异步请求发送过去超过超时时间还未返回响应,则报错
    单位 ms */
    timeout:5000,
})
/* 导出我们的自定义 axios 实例,注意 这个实例依然是 Promise */
export default request
