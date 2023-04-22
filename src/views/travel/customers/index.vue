<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
                  <el-form-item label="发团日期" prop="departureDate">
                    <el-date-picker clearable
                                    v-model="queryParams.departureDate"
                                    type="date"
                                    value-format="YYYY-MM-DD"
                                    placeholder="请选择发团日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="线路id" prop="routeId">
                    <el-input
                        v-model="queryParams.routeId"
                        placeholder="请输入线路id"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="计划数量" prop="plannedQuantity">
                    <el-input
                        v-model="queryParams.plannedQuantity"
                        placeholder="请输入计划数量"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="占位预留" prop="reservedQuantity">
                    <el-input
                        v-model="queryParams.reservedQuantity"
                        placeholder="请输入占位预留"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="已确认" prop="confirmedQuantity">
                    <el-input
                        v-model="queryParams.confirmedQuantity"
                        placeholder="请输入已确认"
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
            v-hasPermi="['travel:customers:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['travel:customers:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['travel:customers:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:customers:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customersList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="${comment}" align="center" prop="id" />
              <el-table-column label="发团日期" align="center" prop="departureDate" width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.departureDate, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="线路id" align="center" prop="routeId" />
              <el-table-column label="计划数量" align="center" prop="plannedQuantity" />
              <el-table-column label="占位预留" align="center" prop="reservedQuantity" />
              <el-table-column label="已确认" align="center" prop="confirmedQuantity" />
              <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['travel:customers:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['travel:customers:remove']">删除</el-button>
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

    <!-- 添加或修改收客对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="customersRef" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="发团日期" prop="departureDate">
                          <el-date-picker clearable
                                          v-model="form.departureDate"
                                          type="date"
                                          value-format="YYYY-MM-DD"
                                          placeholder="请选择发团日期">
                          </el-date-picker>
                        </el-form-item>
                        <el-form-item label="线路id" prop="routeId">
                          <el-input v-model="form.routeId" placeholder="请输入线路id" />
                        </el-form-item>
                        <el-form-item label="计划数量" prop="plannedQuantity">
                          <el-input v-model="form.plannedQuantity" placeholder="请输入计划数量" />
                        </el-form-item>
                        <el-form-item label="占位预留" prop="reservedQuantity">
                          <el-input v-model="form.reservedQuantity" placeholder="请输入占位预留" />
                        </el-form-item>
                        <el-form-item label="已确认" prop="confirmedQuantity">
                          <el-input v-model="form.confirmedQuantity" placeholder="请输入已确认" />
                        </el-form-item>
                        <el-form-item label="备注" prop="remarks">
                          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
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

<script setup name="Customers">
  import { listCustomers, getCustomers, delCustomers, addCustomers, updateCustomers } from "@/api/travel/customers";

  const { proxy } = getCurrentInstance();

  const customersList = ref([]);
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
                    departureDate: null,
                    routeId: null,
                    plannedQuantity: null,
                    reservedQuantity: null,
                    confirmedQuantity: null,
                    remarks: null
    },
    rules: {
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询收客列表 */
  function getList() {
    loading.value = true;
    listCustomers(queryParams.value).then(response => {
            customersList.value = response.rows;
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
                    departureDate: null,
                    routeId: null,
                    plannedQuantity: null,
                    reservedQuantity: null,
                    confirmedQuantity: null,
                    remarks: null
    };
    proxy.resetForm("customersRef");
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
    title.value = "添加收客";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getCustomers(_id).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改收客";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["customersRef"].validate(valid => {
      if (valid) {
        if (form.value.id != null) {
          updateCustomers(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addCustomers(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除收客编号为"' + _ids + '"的数据项？').then(function() {
      return delCustomers(_ids);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('travel/customers/export', {
      ...queryParams.value
    }, `customers_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
