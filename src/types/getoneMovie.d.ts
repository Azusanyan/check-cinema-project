//declare声明为全局变量了，无需再次导入
declare interface getoneMovie{
    id:number	    //电影场次id
    movieName:string	    //电影名称
    posters:string	    //电影海报
    synopsis:string	    //电影介绍
    longTime:number	    //电影时间长
    money:number	    //票价
    sale:number	    //已选座位数
    startTime:number	    //电影开场时间
    venueName:string	    //影厅名称
    x:number	    //影厅座位排数
    y:number	    //影厅座位列数
    typeId:number	    //影厅类型id
    typeName:string	    //影厅类型名称
}