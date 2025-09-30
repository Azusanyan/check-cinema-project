/* 导入自定义 axios 实例 request */
import request from '@/util/request'

const path = '/seat'
const path2 = '/cus'
const path3 = '/user'
const path4 = '/order'

/**
 *  1:查询影厅类型
 */
export function checkCinemaType() {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path}/selectVenueType`,
        method: 'get',   /* 发送异步请求的方式 */
    })
}

/**
 * 2:添加影厅
 */

export function addTheater(addCinema: addCinema) {
    return request({
        url: `${path}/addMovieVenue`,
        method: 'post',
        data: addCinema
    })
}

/**
 * 3:添加电影场次
 */

export function addMovieSession(m: addSession) {
    return request({
        url: `${path}/addScenes`,
        method: 'post',
        data: m
    })
}

/**
 *  4:查询全部影厅
 */
export function checkAllCinema() {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path}/selectAllVenue`,
        method: 'get',   /* 发送异步请求的方式 */
    })
}
/**
 *  5:查询全部电影
 */
export function checkAllMovie() {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path}/selectAllMovie`,
        method: 'get',   /* 发送异步请求的方式 */
    })
}


/**
 *  5:分页查询
 */
export function checkPag(pag: checkPagination) {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path}/pageMovie`,
        method: 'post',   /* 发送异步请求的方式 */
        data: pag
    })
}


/**
 *  5:查询一个电影的场次
 */
export function checkoneMm(mov: checkoneMovie) {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path}/selectOneMovie`,
        method: 'get',   /* 发送异步请求的方式 */
        params: mov,
    })
}

/**
 *  6:查询已经购买的座位
 */
export function checkSeats(id: string | number) {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path}/selectSeats?id=${id}`,
        method: 'get',   /* 发送异步请求的方式 */
    })
}

/**
 *  7:购票
 */
export function shopMovie(arr: Array<shop>) {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path}/shop`,
        method: 'post',   /* 发送异步请求的方式 */
        data: arr
    })
}




/**
 *  8:删除
 */
export function deleMovie(id: number | string) {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path}/delMovie/${id}`,
        method: 'delete',
    })
}


/* 查询所有用户信息 */
export function queryAllUserInfo() {
    return request({
        url: `${path3}/queryAllUserInfo`,
        method: 'get',
    })
}

/* 更新用户角色 */
export function updateUserRole(userRole: UserRole) {
    return request({
        url: `${path3}/`,
        method: 'put',
        data: userRole
    })
}



/* 查询菜单 */
export function queryMenusByUserId(userId: number) {
    return request({
        url: `${path3}/queryMenusByUserId?userId=${userId}`,
        method: 'get'
    })
}

export function login(username: string, password: string) {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path2}/login?name=${username}&pwd=${password}`,
        method: 'get',   /* 发送异步请求的方式 */
    })
}

/** 2:注册
 * 
 * @param user RegUser 内部封装了要注册的字段,最多 9 个 id 与 path 可选 
 */
export function reg(user: RegUser) {
    return request({
        url: `${path2}/addCus`,
        method: 'post',
        data: user,
    })
}

export function updatePassword(data:any) {
    return request({
        url: `${path2}/updatePassword`,
        method: 'post',
        data: data,
    })
}



/* 管理员登录 */
export function UserLogin(name: string, pwd: string) {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path3}/userLogin?name=${name}&pwd=${pwd}`,
        method: 'get',   /* 发送异步请求的方式 */
    })
}

/* 影厅播放电影次数 图 */
export function cinemaCountAPI() {
    return request({
        url: `${path}/cinemaCount`,
        method: 'get',
    })
}


/* 电影订单列表 */
export function checkOrderPageAPI(checkOrderPage: OrderPage) {
    return request({
        url: `${path4}/listOrder`,
        method: 'get',
        params: checkOrderPage
    })
}

/* 添加用户 */
export function addUserAPI(user: User) {
    return request({
        url: `${path3}/addUser`,
        method: 'post',
        data: user
    })
}


/* 查询所有会员信息 */
export function selectCustomerAPI() {
    return request({
        url: `${path2}/selectCustomer`,
        method: 'get',
    })
}

/* 订单分析图1 */
export function pieOrderOneAPI() {
    return request({
        url: `${path4}/pieOrderOne`,
        method: 'get',
    })
}

/* 订单分析图2 */
export function pieOrderTwoAPI() {
    return request({
        url: `${path4}/pieOrderTwo`,
        method: 'get',
    })
}


/* 订单分析图3 */
export function barOrderAPI() {
    return request({
        url: `${path4}/barOrder`,
        method: 'get',
    })
}

/* 删除订单 */
export function deleteOrderAPI(id: number) {
    return request({
        url: `${path4}/deleteOrder?id=${id}`,
        method: 'get',
    })
}

/* 上架下架电影 */
export function onOrOffAPI(id: number, flag: number) {
    return request({
        url: `${path}/onOrOff?id=${id}&flag=${flag}`,
        method: 'get',
    })
}

/* 添加电影 */
export function addMovieAPI(movie: Movie) {
    return request({
        url: `${path}/addMovie`,
        method: 'post',
        data: movie
    })
}



export function selectSeatVenue(query:any) {
    return request({
        url: `${path}/selectSeatVenue`,
        method: 'get',
        params: query
    })
}



export function getAllVenueType() {
    return request({
        url: `${path}/getAllVenueType`,
        method: 'get',
    })
}


export function updateVenue(data:any) {
    return request({
        url: `${path}/updateVenue`,
        method: 'post',
        data: data
    })
}

export function updateUserInfo(data:any) {
    return request({
        url: `${path}/updateUserInfo`,
        method: 'post',
        data: data
    })
}


export function deleteVenue(id: number | string) {
    /* 我们的自定义 axios 实例就是一个 Promise 因此这里返回 request 即可 */
    return request({
        url: `${path}/deleteVenue/${id}`,
        method: 'delete',
    })
}


export function getUserInfo(id: number | string) {
    return request({
        url: `${path}/getUserInfo?id=${id}`,
        method: 'get',
    })
}

export function getMyOrder(params: any) {
    return request({
        url: `${path2}/getMyOrder`,
        method: 'get',
        params: params
    })
}

export function deleteSeat(id: any,oid:any) {
    return request({
        url: `${path2}/deleteSeat?id=${id}&oid=${oid}`,
        method: 'get'
    })
}

export function getAllMovie(data:any) {
    return request({
        url: `${path2}/getAllMovie`,
        method: 'get',
        params: data
    })
}

export function addMovie(data:any) {
    return request({
        url: `${path2}/addMovie`,
        method: 'post',
        data: data
    })
}

export function updateMovie(data:any) {
    return request({
        url: `${path2}/updateMovie`,
        method: 'post',
        data: data
    })
}
export function deleteMovie(id: any) {
    return request({
        url: `${path2}/deleteMovie?id=${id}`,
        method: 'get'
    })
}


export function getAllCustomer(data:any) {
    return request({
        url: `${path2}/getAllCustomer`,
        method: 'get',
        params: data
    })
}

export function updateCustomer(data:any) {
    return request({
        url: `${path2}/updateCustomer`,
        method: 'post',
        data: data
    })
}
export function deleteCustomer(id: any) {
    return request({
        url: `${path2}/deleteCustomer?id=${id}`,
        method: 'get'
    })
}

export function selectPage(params:any) {
    return request({
        url: '/question/selectPage',
        method: 'get',
        params: params
    })
}


export function getQuestionById(id: any) {
    return request({
        url: '/question/' + id,
        method: 'get'
    })
}

export function saveQuestion(data:any) {
    return request({
        url: '/question',
        method: 'post',
        data: data
    })
}

export function updateQuestion(data: any) {
    return request({
        url: '/question',
        method: 'put',
        data:data
    })
}

export function deleteQuestionById(id: any) {
    return request({
        url: '/question/' + id,
        method: 'delete'
    })
}








