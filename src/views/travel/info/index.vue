<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
                  <el-form-item label="线路id" prop="routeId">
                    <el-input
                        v-model="queryParams.routeId"
                        placeholder="请输入线路id"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="预留人数" prop="reservedQuantity">
                    <el-input
                        v-model="queryParams.reservedQuantity"
                        placeholder="请输入预留人数"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
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
            v-hasPermi="['travel:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['travel:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['travel:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:info:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="${comment}" align="center" prop="groupId" />
              <el-table-column label="线路id" align="center" prop="routeId" />
              <el-table-column label="组团社名称" align="center" prop="groupName" />
              <el-table-column label="预留人数" align="center" prop="reservedQuantity" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['travel:info:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['travel:info:remove']">删除</el-button>
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

    <!-- 添加或修改组团社信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="infoRef" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="线路id" prop="routeId">
                          <el-input v-model="form.routeId" placeholder="请输入线路id" />
                        </el-form-item>
                        <el-form-item label="组团社名称" prop="groupName">
                          <el-input v-model="form.groupName" type="textarea" placeholder="请输入内容" />
                        </el-form-item>
                        <el-form-item label="预留人数" prop="reservedQuantity">
                          <el-input v-model="form.reservedQuantity" placeholder="请输入预留人数" />
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

<script setup name="Info">
  import { listInfo, getInfo, delInfo, addInfo, updateInfo } from "@/api/travel/info";

  const { proxy } = getCurrentInstance();

  const infoList = ref([]);
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
                    routeId: null,
                    groupName: null,
                    reservedQuantity: null
    },
    rules: {
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询组团社信息列表 */
  function getList() {
    loading.value = true;
    listInfo(queryParams.value).then(response => {
            infoList.value = response.rows;
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
                    groupId: null,
                    routeId: null,
                    groupName: null,
                    reservedQuantity: null
    };
    proxy.resetForm("infoRef");
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
    ids.value = selection.map(item => item.groupId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加组团社信息";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _groupId = row.groupId || ids.value
    getInfo(_groupId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改组团社信息";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["infoRef"].validate(valid => {
      if (valid) {
        if (form.value.groupId != null) {
          updateInfo(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addInfo(form.value).then(response => {
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
    const _groupIds = row.groupId || ids.value;
    proxy.$modal.confirm('是否确认删除组团社信息编号为"' + _groupIds + '"的数据项？').then(function() {
      return delInfo(_groupIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('travel/info/export', {
      ...queryParams.value
    }, `info_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
