<template>
  <div class="app-container" style="height:100%">
    <el-form class="queryForm" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
      label-width="90px">
      <el-form-item label="所属部门" prop="deptId">
        <cascader style="width:226px" v-model="queryParams.deptId" searchUrl="/system/dept/list" keyField="id"
          showField="deptName" parentField="parentId" placeholder="请选择所属部门" checkStrictly />
      </el-form-item>
      <el-form-item label="类别" prop="categoryId">
        <cascader style="width:226px" v-model="queryParams.categoryId" searchUrl="/hmx/testCategory/list" keyField="id"
          showField="categoryName" parentField="parentId" placeholder="请选择类别" checkStrictly />
      </el-form-item>
      <el-form-item label="简称" prop="shortName">
        <el-input v-model="queryParams.shortName" placeholder="请输入简称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否签约" prop="isSign">
        <el-select v-model="queryParams.isSign" placeholder="请选择是否签约" clearable>
          <el-option v-for="dict in dict.type.sys_true_false" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="包括年级" prop="gradeTypes">
        <el-input v-model="queryParams.gradeTypes" placeholder="请输入包括年级" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="校长姓名" prop="headmaster">
        <el-input v-model="queryParams.headmaster" placeholder="请输入校长姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="queryParams.telephone" placeholder="请输入联系电话" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所属省" prop="province">
        <el-input v-model="queryParams.province" placeholder="请输入所属省" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所属市" prop="city">
        <el-input v-model="queryParams.city" placeholder="请输入所属市" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所属区/县" prop="area">
        <el-input v-model="queryParams.area" placeholder="请输入所属区/县" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="daterangeCreateTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格组件 -->
    <Table :data="testSchoolList" :labelList="labelList" :loading="loading" @getList="getList" multiple
      @multipleChange="handleMultipleChange" @toggleSearch="showSearch = !showSearch" @sortChange="handleSortChange">
      <!-- 上方操作按钮 -->
      <template v-slot:operActionBtn>
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['hmx:testSchool:add']">新增</el-button>
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['hmx:testSchool:edit']">修改</el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['hmx:testSchool:remove']">删除</el-button>
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport"
          v-hasPermi="['hmx:testSchool:import']">导入</el-button>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['hmx:testSchool:export']">导出</el-button>
      </template>
      <!-- 自定义列模板 -->
      <template v-slot:logo="{ scope }">
        <image-preview :src="scope.row.logoImage" :height="50" v-if="scope.row.logoImage" />
      </template>
      <template v-slot:isSign="{ scope }">
        <dict-tag :options="dict.type.sys_true_false" :value="scope.row.isSign" />
      </template>
      <template v-slot:videoImage="{ scope }">
        <image-preview :src="scope.row.videoImage" :height="50" v-if="scope.row.videoImage" />
      </template>
      <template v-slot:operAction="{ scope }">
        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </Table>

    <pagination v-show="total" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改学校管理对话框 -->
    <el-dialog z-index="1000" :title="title" :visible.sync="open" width="880px" append-to-body @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属部门" prop="deptId">
          <cascader v-model="form.deptId" searchUrl="/system/dept/list" keyField="id" showField="deptName"
            parentField="parentId" placeholder="请选择所属部门" style="width: 100%;" checkStrictly />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptIds">
          <cascader v-model="form.deptIds" searchUrl="/system/dept/list" keyField="id" showField="deptName"
            parentField="parentId" placeholder="请选择所属部门" style="width: 100%;" checkStrictly multiple />
        </el-form-item>
        <el-form-item label="类别" prop="categoryId">
          <cascader v-model="form.categoryId" searchUrl="/hmx/testCategory/list" keyField="id" showField="categoryName"
            parentField="parentId" placeholder="请选择类别" style="width: 100%;" checkStrictly />
        </el-form-item>
        <el-form-item label="所属类别" prop="categoryIds">
          <cascader v-model="form.categoryIds" searchUrl="/hmx/testCategory/list" keyField="id" showField="categoryName"
            parentField="parentId" placeholder="请选择所属类别" style="width: 100%;" checkStrictly multiple />
        </el-form-item>
        <el-form-item label="名称" prop="schoolName">
          <el-input v-model="form.schoolName" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="学校顺序" prop="schoolSort">
          <el-input-number v-model="form.schoolSort" controls-position="right" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入简称" clearable />
        </el-form-item>
        <el-form-item label="logo" prop="logoImage">
          <image-upload v-model="form.logoImage" :limit="1" />
        </el-form-item>
        <el-form-item label="摘要" prop="schoolSummary">
          <el-input v-model="form.schoolSummary" type="textarea" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="图文介绍" prop="detailContent">
          <tinymceEditor v-model="form.detailContent" v-if="open" />
        </el-form-item>
        <el-form-item label="是否签约" prop="isSign">
          <el-select v-model="form.isSign" placeholder="请选择是否签约" clearable>
            <el-option v-for="dict in dict.type.sys_true_false" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包括年级" prop="gradeTypes">
          <el-input v-model="form.gradeTypes" placeholder="请输入包括年级" clearable />
        </el-form-item>
        <el-form-item label="宣传视频" prop="videoUrl">
          <video-upload v-model="form.videoUrl" :limit="1" />
        </el-form-item>
        <el-form-item label="视频封面" prop="videoImage">
          <image-upload v-model="form.videoImage" :limit="1" />
        </el-form-item>
        <el-form-item label="校长姓名" prop="headmaster">
          <el-input v-model="form.headmaster" placeholder="请输入校长姓名" clearable />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="form.telephone" placeholder="请输入联系电话" clearable />
        </el-form-item>
        <el-form-item label="建校年份" prop="buildYear">
          <el-input v-model="form.buildYear" placeholder="请输入建校年份" clearable />
        </el-form-item>
        <el-form-item label="所属省" prop="province">
          <el-input v-model="form.province" placeholder="请输入所属省" clearable />
        </el-form-item>
        <el-form-item label="所属市" prop="city">
          <el-input v-model="form.city" placeholder="请输入所属市" clearable />
        </el-form-item>
        <el-form-item label="所属区/县" prop="area">
          <el-input v-model="form.area" placeholder="请输入所属区/县" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入学校管理对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <excel-upload ref="excelUpload" @getList="getList" :action="upload.url" :data="upload.data" drag />
      <div align="center">
        <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
          @click="importTemplate">下载模板</el-link>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import { listTestSchool, getTestSchool, delTestSchool, addTestSchool, updateTestSchool } from "@/api/hmx/testSchool";

export default {
  name: "TestSchool",
  dicts: ['sys_true_false'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 学校管理表格数据
      testSchoolList: [],
      labelList: [
        {
          prop: 'id',
          label: 'id主键',
        },
        {
          prop: 'deptId',
          label: '所属部门',
        }, {
          prop: 'deptIds',
          label: '所属部门',
        }, {
          prop: 'categoryId',
          label: '类别',
        }, {
          prop: 'categoryIds',
          label: '所属类别',
        }, {
          prop: 'schoolName',
          label: '名称',
        }, {
          prop: 'schoolSort',
          label: '学校顺序',
        }, {
          prop: 'shortName',
          label: '简称',
        }, {
          prop: 'logo',
          label: 'logo',
        }, {
          prop: 'isSign',
          label: '是否签约',
        }, {
          prop: 'gradeTypes',
          label: '包括年级',
        }, {
          prop: 'videoUrl',
          label: '宣传视频',
        }, {
          prop: 'videoImage',
          label: '视频封面',
        }, {
          prop: 'headmaster',
          label: '校长姓名',
        }, {
          prop: 'telephone',
          label: '联系电话',
        }, {
          prop: 'buildYear',
          label: '建校年份',
        }, {
          prop: 'province',
          label: '所属省',
        }, {
          prop: 'city',
          label: '所属市',
        }, {
          prop: 'area',
          label: '所属区/县',
        }, {
          prop: 'createTime',
          label: '创建时间',
        }, {
          prop: 'operAction',
          label: '操作',
          fixed: 'right',
          showOverflowTooltip: false
        }],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 创建时间范围
      daterangeCreateTime: [],
      // 上传参数
      upload: {
        // 自定义参数
        id: null,
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "学校管理导入",
        // 上传的地址
        url: "/hmx/testSchool/importData"
      },
      // 查询参数
      queryParams: {
        deptId: null,
        categoryId: null,
        shortName: null,
        isSign: null,
        gradeTypes: null,
        headmaster: null,
        telephone: null,
        province: null,
        city: null,
        area: null,
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        isSign: [
          { required: true, message: "是否签约不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询学校管理列表 */
    getList() {
      this.loading = true;
      if (this.daterangeCreateTime !== undefined && this.daterangeCreateTime.length > 0) {
        this.queryParams.beginDateCreateTime = this.daterangeCreateTime[0];
        this.queryParams.endDateCreateTime = this.daterangeCreateTime[1];
      } else {
        this.queryParams.beginDateCreateTime = null;
        this.queryParams.endDateCreateTime = null;
      }
      listTestSchool(this.queryParams).then(response => {
        this.testSchoolList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).finally(() => {
        this.loading = false;
      });

    },
    // 取消按钮
    cancel() {
      this.reset();
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        deptId: null,
        deptIds: null,
        categoryId: null,
        categoryIds: null,
        schoolName: null,
        schoolSort: null,
        shortName: null,
        logoImage: null,
        schoolSummary: null,
        detailContent: null,
        isSign: null,
        gradeTypes: null,
        videoUrl: null,
        videoImage: null,
        headmaster: null,
        telephone: null,
        buildYear: null,
        province: null,
        city: null,
        area: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 单选框选中数据
    handleSingleChange(row) {
      console.log(row)
    },
    // 多选框选中数据
    handleMultipleChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 排序触发事件 */
    handleSortChange({ prop, order }) {
      this.queryParams.orderByColumn = prop;
      this.queryParams.isAsc = order;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学校管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTestSchool(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学校管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateTestSchool(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(() => {
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addTestSchool(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).catch(() => {
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除学校管理编号为"' + ids + '"的数据项？').then(function () {
        return delTestSchool(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/hmx/testSchool/export', {
        ...this.queryParams,
        idList: this.ids
      }, `testSchool_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      //自定义参数初始化;
      this.upload.id = null;
      this.upload.open = true;
    },
    /** 提交上传文件 */
    submitFileForm() {
      if (this.$refs.excelUpload.$refs.upload.uploadFiles.length == 0) {
        this.$modal.msgError('请先上传文件！');
        return;
      }
      if (this.upload.id) {
        this.$refs.excelUpload.$refs.upload.data.id = this.upload.id;
      }
      this.$refs.excelUpload.$refs.upload.submit();
      this.upload.open = false;
    },
    /** 下载模板操作 */
    importTemplate() {
      let params = {}
      if (this.upload.id) {
        params.id = this.upload.id;
      }
      this.download("/hmx/testSchool/importTemplate", params, `testSchool_template_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
