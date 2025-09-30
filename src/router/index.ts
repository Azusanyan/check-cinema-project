import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/views/login/CustomerLogin.vue'),
        },

        {
            path: '/home',
            component: () => import('../views/home/index.vue')
        },
        {
            path: '/updatePwd',
            component: () => import('../views/userManage/UpdatePwd.vue'),
        },
        {
            path: '/myOrder',
            component: () => import('../views/userManage/MyOrders.vue'),
        },
        {
            path: '/question',
            component: () => import('../views/userManage/Question.vue'),
        },
        {
            path: '/ticket',
            name: 'ticket',
            component: () => import('../views/ticket/index.vue'),
        },
        {
            path: '/userLogin',
            component: () => import('@/views/login/UserLogin.vue'),
        },
        {
            path: '/register',
            component: () => import('@/views/register/CystinerRegister.vue'),
        },
        {
            path: '/homeView',
            component: () => import('@/views/components/HomeView.vue'),
            children: [
                {
                    path: '/manage',
                    component: () => import('../views/manage/index.vue'),
                },
                {
                    path: '/manageTable',
                    component: () => import('../views/manage/table.vue'),
                },
                {
                    path: '/cinemaManage',
                    component: () => import('../views/manage/cinemaManage.vue'),
                },
                {
                    path: '/cinemaHall',
                    component: () => import('../views/manage/cinemaHall.vue'),
                },
                {
                    path: '/addUser',
                    component: () => import('@/views/userManage/AddUser.vue'),
                },
                {
                    path: '/listUser',
                    component: () => import('@/views/userManage/ListUser.vue'),
                },
                {
                    path: '/addCustomer',
                    component: () => import('@/views/register/CystinerRegister.vue'),
                },
                {
                    path: '/listCustomer',
                    component: () => import('@/views/customer/ListCustomer.vue'),
                },
                {
                    path: '/userManage',
                    component: () => import('@/views/userManage/UserManage.vue'),
                },
                {
                    path: '/listOrder',
                    component: () => import('../views/order/ListOrder.vue'),
                },
                {
                    path: '/analylistOrder',
                    component: () => import('@/views/order/analylistOrder.vue'),
                },
                {
                    path: '/questionList',
                    component: () => import('@/views/userManage/questionList.vue'),
                },
            ]
        },
        {
            path: '/customerOrder',
            component: () => import('@/views/index.vue'),
        },
    ]
})

export default router
