<template>
    <div class="app">
        <div class="menu">
            <el-menu @select="menuSelect">
                <el-menu-item v-for="item in menuList" :key="item.name" :index="item.name">
                    {{ item.name }}
                </el-menu-item>
            </el-menu>
        </div>
        <div class="view">
            <router-view />
        </div>
    </div>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter()
const menuList = [{
    name: 'Form',
    routerPath: '/Form'
}, {
    name: 'Dialog',
    routerPath: '/Dialog'
}]
const menuSelect = (name) => {
    router.push(menuList.find(item => item.name === name).routerPath)
}
</script>
<style lang="scss" scoped>
.app {
    display: flex;
    height: 100vh;

    .menu {
        :deep(.el-menu) {
            height: 100%;
        }
    }

    .view {
        flex: 1;
        height: 100%;
        overflow-y: scroll;
        padding: 20px;
        box-sizing: border-box;


    }

    ::-webkit-scrollbar {
        display: none;
    }
}
</style>
