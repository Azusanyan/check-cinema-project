declare interface allMovie{/* 查询全部电影 */
    id:string
    name:string
    synopsis:string
    posters:string
    longTime:string
    boxOffice:string
    flag:number
}

declare interface Movie{
    id?:string
    name:string
    synopsis:string
    posters:string
    longTime:string|number
    boxOffice?:string
    flag?:number
}