declare interface UserRole {
    uid: number | string
    rids: Array<number | string>
}

declare interface User {
    id: number
    name: String
    phone: number | string
    pwd: string
    roles: Array<Role>
}

declare interface Role {
    id: number
    flag: number
    name: string
    menus: Array<Menu>
}

declare interface Menu {
    href: string
    icon: String
    id: number
    pid: number
    sort: number
    text: string
}

declare interface MenuRole {
    rid: number | string
    menus: Array<number>
}