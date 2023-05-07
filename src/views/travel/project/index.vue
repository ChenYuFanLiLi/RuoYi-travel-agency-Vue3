<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
            v-model="queryParams.projectName"
            placeholder="请输入项目名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--                  <el-form-item label="项目拟单价" prop="projectSuggestedPrice">-->
      <!--                    <el-input-->
      <!--                        v-model="queryParams.projectSuggestedPrice"-->
      <!--                        placeholder="请输入项目拟单价"-->
      <!--                        clearable-->
      <!--                        @keyup.enter="handleQuery"-->
      <!--                    />-->
      <!--                  </el-form-item>-->
      <!--                  <el-form-item label="项目成本" prop="projectCost">-->
      <!--                    <el-input-->
      <!--                        v-model="queryParams.projectCost"-->
      <!--                        placeholder="请输入项目成本"-->
      <!--                        clearable-->
      <!--                        @keyup.enter="handleQuery"-->
      <!--                    />-->
      <!--                  </el-form-item>-->
      <el-form-item label="项目类型" prop="projectType">
        <el-select v-model="queryParams.projectType" placeholder="请选择项目类型" clearable>
          <el-option
              v-for="dict in travel_project_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--                  <el-form-item label="项目单位" prop="projectUnit">-->
      <!--                    <el-input-->
      <!--                        v-model="queryParams.projectUnit"-->
      <!--                        placeholder="请输入项目单位"-->
      <!--                        clearable-->
      <!--                        @keyup.enter="handleQuery"-->
      <!--                    />-->
      <!--                  </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['travel:project:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['travel:project:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['travel:project:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:project:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="projectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id"/>
      <el-table-column label="项目名称" align="center" prop="projectName"/>
      <el-table-column label="项目拟单价" align="center" prop="projectSuggestedPrice"/>
      <el-table-column label="项目成本" align="center" prop="projectCost"/>
      <el-table-column label="项目类型" align="center" prop="projectType">
        <template #default="scope">
          <dict-tag :options="travel_project_type" :value="scope.row.projectType"/>
        </template>
      </el-table-column>
      <el-table-column label="项目单位" align="center" prop="projectUnit"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['travel:project:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['travel:project:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改项目对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="projectRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称"/>
        </el-form-item>
        <el-form-item label="项目拟单价" prop="projectSuggestedPrice">
          <el-input v-model="form.projectSuggestedPrice" placeholder="请输入项目拟单价"/>
        </el-form-item>
        <el-form-item label="项目成本" prop="projectCost">
          <el-input v-model="form.projectCost" placeholder="请输入项目成本"/>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-select v-model="form.projectType" placeholder="请选择项目类型">
            <el-option
                v-for="dict in travel_project_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目单位" prop="projectUnit">
          <el-input v-model="form.projectUnit" placeholder="请输入项目单位"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Project">
import {listProject, getProject, delProject, addProject, updateProject} from "@/api/travel/project";

const {proxy} = getCurrentInstance();
const {travel_project_type} = proxy.useDict('travel_project_type');

const projectList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    projectName: null,
    projectSuggestedPrice: null,
    projectCost: null,
    projectType: null,
    projectUnit: null,
  },
  rules: {
    projectName: [
      {required: true, message: "项目名称不能为空", trigger: "blur"}
    ],
    projectSuggestedPrice: [
      {required: true, message: "项目拟单价不能为空", trigger: "blur"}
    ],
    projectCost: [
      {required: true, message: "项目成本不能为空", trigger: "blur"}
    ],
    projectType: [
      {required: true, message: "项目类型不能为空", trigger: "change"}
    ],
    projectUnit: [
      {required: true, message: "项目单位不能为空", trigger: "blur"}
    ],
    createTime: [
      {required: true, message: "创建时间不能为空", trigger: "blur"}
    ],
    createBy: [
      {required: true, message: "创建人不能为空", trigger: "blur"}
    ],
    updateTime: [
      {required: true, message: "更新时间不能为空", trigger: "blur"}
    ],
    updateBy: [
      {required: true, message: "更新人不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询项目列表 */
function getList() {
  loading.value = true;
  listProject(queryParams.value).then(response => {
    projectList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    projectName: null,
    projectSuggestedPrice: null,
    projectCost: null,
    projectType: null,
    projectUnit: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("projectRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加项目";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getProject(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改项目";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["projectRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateProject(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProject(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除项目编号为"' + _ids + '"的数据项？').then(function () {
    return delProject(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('travel/project/export', {
    ...queryParams.value
  }, `project_${new Date().getTime()}.xlsx`)
}

getList();
</script>
