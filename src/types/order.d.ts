declare interface OrderPage {
    pageSize:number
    pageNumber:number
    movieName:string
    typeId:number|string
    startTime:string
}

declare interface OrderInfo{
    id:number
    customerName:string
    movieName:string
    money:number
    num:number
    orderTime:string
    venueName:string
    time:number
}