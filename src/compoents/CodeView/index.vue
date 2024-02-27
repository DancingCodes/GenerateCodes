<template>
    <div class="CodeView">
        <template v-if="code.template">
            <div class="title">template</div>
            <div class="code">
                {{ code.template }}
            </div>
        </template>
        <template v-if="code.data">
            <div class="title">data</div>
            <div class="code">
                {{ code.data }}
            </div>
        </template>
        <template v-if="code.methods">
            <div class="title">methods</div>
            <div class="code">
                {{ code.methods }}
            </div>
        </template>
    </div>
</template>

<script setup>
const prop = defineProps({
    code: {
        default: {
            template: null,
            data: null,
            methods: null
        }
    },
})
</script>

<style lang="scss" scoped>
.CodeView {
    .title {
        background-color: skyblue;
        color: #000000;
        font-weight: bold;
        font-size: 18px;
        padding: 4px 10px;
    }

    .title:not(:first-child) {
        margin-top: 20px;
    }

    .code {
        white-space: pre-wrap;
        background-color: rgba($color: #000000, $alpha: 0.1);
        font-family: cursive;
        font-size: 18px;
    }
}
</style>