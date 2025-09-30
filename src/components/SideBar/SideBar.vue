<template>
    <div class="sidebar">
        <el-menu :default-active="activeIndex" class="menu" active-text-color="#FFFFFF" background-color="#2c2c32"
            text-color="#fff" :unique-opened="true" router :default-openeds="openedMenus" @select="handleSelect">
            <template v-for="menu in menuList" :key="menu.id">
                <!-- 第一级菜单 -->
                <el-sub-menu :index="menu.id" v-if="menu.nodes && menu.nodes.length > 0">
                    <template #title>
                        <img :src="menu.icon" alt="" class="menu-icon">
                        <span>{{ menu.text }}</span>
                    </template>

                    <!-- 第二级菜单 -->
                    <template v-for="child in menu.nodes" :key="child.id">
                        <el-sub-menu :index="child.href" v-if="child.nodes && child.nodes.length > 0">
                            <template #title>
                                <span>{{ child.text }}</span>
                            </template>

                            <!-- 第三级菜单项 -->
                            <el-menu-item v-for="subChild in child.nodes" :key="subChild.id" :index="subChild.href">
                                {{ subChild.text }}
                            </el-menu-item>
                        </el-sub-menu>

                        <!-- 第二级菜单项（没有第三级） -->
                        <el-menu-item v-else :index="child.href">
                            {{ child.text }}
                        </el-menu-item>
                    </template>
                </el-sub-menu>

                <!-- 第一级菜单项（没有子菜单） -->
                <el-menu-item v-else :index="menu.href">
                    <img :src="menu.icon" alt="" class="menu-icon">
                    <span>{{ menu.text }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'Sidebar',
    props: {
        menuList: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    data () {
        return {
            activeIndex: 1,
            openedMenus: [1, 2, 3, 4, 5, 6, 7, 8, 9] // 存储需要默认展开的菜单href
        }
    },
    created () {
        this.setDefaultOpenedMenus();
    },
    methods: {
        // 设置默认展开的菜单
        setDefaultOpenedMenus () {
            const opened = [];

            // 遍历第一级菜单
            this.menuList.forEach(menu => {
                if (menu.nodes && menu.nodes.length > 0) {
                    opened.push(menu.href); // 添加第一级菜单

                    // 遍历第二级菜单
                    menu.nodes.forEach(child => {
                        if (child.nodes && child.nodes.length > 0) {
                            opened.push(child.href); // 添加第二级菜单
                        }
                    });
                }
            });

            this.openedMenus = opened;
        },

        handleSelect (index) {
            this.activeIndex = index;
            // 其他处理逻辑...
        }
    }
}
</script>

<style scoped>
.sidebar {
    height: 100%;
    background-color: #2c2c32;
}

.menu {
    border-right: none;
}

.menu-icon {
    margin-right: 16px;
    width: 22px;
    height: 22px;
}

/* 菜单项样式 */
.el-menu-item,
.el-sub-menu__title {
    transition: all 0.3s;
}

.el-menu-item.is-active {
    background-color: #2e3037 !important;
}

.el-menu-item:hover,
.el-sub-menu__title:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
}

/* 子菜单缩进 */
.el-menu--inline {
    padding-left: 20px;
}
</style>