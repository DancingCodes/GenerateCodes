<template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :inline="true">
        <el-form-item label="标题" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="表单名称" prop="formName">
            <el-input v-model="ruleForm.formName" placeholder="请输入表单名称(英文)" />
        </el-form-item>


        <div v-for="(item, index) in ruleForm.attributeList" :key="index" class="attributeList">
            <el-form-item label="属性label" :prop="`attributeList.${index}.label`" :rules="rules.label">
                <el-input v-model="item.label" placeholder="请输入属性label" />
            </el-form-item>
            <el-form-item label="属性prop" :prop="`attributeList.${index}.prop`" :rules="rules.prop">
                <el-input v-model="item.prop" placeholder="请输入属性prop(英)" />
            </el-form-item>
            <el-form-item>
                <el-button @click="ruleForm.attributeList.splice(index, 1)">
                    删除
                </el-button>
            </el-form-item>
        </div>
        <el-form-item>
            <el-button @click="ruleForm.attributeList.push({})">
                添加属性
            </el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
                生成
            </el-button>
        </el-form-item>
    </el-form>
    <CodeView :code="code" />
</template>

<script setup>
import Dialog from '@/Template/Dialog'
import CodeView from '@/compoents/CodeView/index.vue'
import { ref, reactive } from 'vue'
const code = ref()

const ruleForm = reactive({
    title: '',
    formName: '',
    attributeList: []
})
const ruleFormRef = ref()
const rules = {
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
    ],
    formName: [
        { required: true, message: '请输入表单名称', trigger: 'blur' },
    ],
    label: [
        { required: true, message: '请输入属性label', trigger: 'blur' },
    ],
    prop: [
        { required: true, message: '请输入属性prop', trigger: 'blur' },
    ]
}

const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate(valid => {
        if (valid) {
            code.value = Dialog(ruleForm.title, ruleForm.formName, ruleForm.attributeList)
        }
    })
}

</script>

<style lang="scss" scoped></style>