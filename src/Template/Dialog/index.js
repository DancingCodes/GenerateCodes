export default (title, formName, attributeList) => {
    let templateAttribute = ''
    attributeList.forEach(item => {
        templateAttribute += `
        <el-form-item :label="${item.label}" :prop="${item.prop}">
            <el-input v-model="${formName}.form.${item.prop}" placeholder="请输入${item.label}" clearable/>
        </el-form-item>
        `
    })
    const template = `
    <el-button @click="${formName}Open(scope.row)">${title}</el-button>
    <el-dialog :title="${formName}.title" :visible.sync="${formName}.open" @close="${formName}Cancel">
        <el-form ref="${formName}" :model="${formName}.form" :rules="${formName}.rules">
            ${templateAttribute}
        </el-form>
        <div slot="footer">
            <el-button :loading="${formName}.buttonLoading" type="primary" @click="${formName}Submit">
                确 定
            </el-button>
            <el-button @click="${formName}.open = false;">取 消</el-button>
        </div>
    </el-dialog>
    `
    let dataAttribute = ''
    attributeList.forEach(item => {
        dataAttribute += `
        ${item.prop}: [
            {
                required: true,
                message: "${item.label}不能为空",
                trigger: "blur",
            }
        ],
        `
    })
    const data = `
    ${formName}: {
        open: false,
        title: "${title}",
        buttonLoading: false,
        form: {},
        rules: {
            ${dataAttribute}
        }
    },
    `
    const methods = `
    ${formName}Open({id}) {
        this.${formName}.form.id = id;
        this.${formName}.open = true;
    },
    ${formName}Submit() {
        this.$refs["${formName}"].validate(valid => {
            if (valid) {
                this.${formName}.buttonLoading = true;
                接口(this.${formName}.form).then(() => {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                }).finally(() => {
                    this.${formName}.buttonLoading = false;
                    this.${formName}.open = false;
                    this.getList();
                });
            }
        });
    },
    ${formName}Cancel() {
        this.${formName}.form = {};
    }
    `
    return {
        template, data, methods
    }
} 