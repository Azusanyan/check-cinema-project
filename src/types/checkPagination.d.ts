declare interface checkPagination{
    pageSize:number	
    pageNum:number
    movieName:tring
    typeId:number|string	
    startTime:Date|string
}

declare interface paginationData{
    id:number	//电影场次id
    movieName:string	//电影名称
    posters:string	//电影海报
    synopsis:string	//电影简介
    longTime:number	//电影时长
    money:number	//电影票价
    startTime:date	//电影开始时间
    venueName:string	//影厅名称
    x:number	//影厅排数
    y:number	//影厅列数
    typeId:number	//影厅类型id
    typeName:string	//影厅类型名称
}