<template>
  <div v-if="item.nodes">
    <template v-if="item.nodes.length == 0">
        <el-menu-item :index="item.href">
          <i class="el-icon-menu"></i>
          {{item.text}}
        </el-menu-item>
    </template>

    <el-sub-menu v-else :index="item.href">
      <template #title >
        <el-icon><Menu /></el-icon>
        {{item.text}}
      </template>

      <template v-for="child in item.nodes">
        <sidebar-item
          v-if="child.nodes&&child.nodes.length>0"
          :item="child"
          :key="child.href"/>
        <el-menu-item v-else :key="child.href" :index="child.href">
          <el-icon><Location /></el-icon>
          {{child.text}}
        </el-menu-item>
      </template>
    </el-sub-menu>
  </div>
  <div v-else>
      <el-menu-item :index="item.href">
        <i class="el-icon-menu"></i>
        {{item.text}}
      </el-menu-item>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
