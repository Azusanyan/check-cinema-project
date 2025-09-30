/* 导⼊函数,此函数可以创建⼀个 Store 实例 */
import { defineStore } from "pinia"

//用于存储，防止刷新后数据的丢失
export const useCinemaStore = defineStore('myCart', {
    state() {
        return {
            //as用于定义初始化为空的数组
            cinemaType: [] as Array<cinemaType>, /* 影厅类型 */
            allcinema: [] as Array<allcinama>,/* 所有影厅 */
            allMovie: [] as Array<allMovie>, /* 所有电影 */
            paginationData: [] as Array<paginationData>, /* 分页查询的数据 */
            oneMovie: {} as getoneMovie, /* 购票的那个电影的信息 */
            regUser: {} as RegUser | undefined,
            userId: -1 as number    /* 会员id */
            
        }
    },
    getters: {
        //各种运算返回数据...
    },

    actions: {
        //主要状态管理业务逻辑集散地...
    },
    persist: {
        /* 开启缓存后,则刷新不再重置 仓库 初始化的数据 */
        enabled: true,
    }
})