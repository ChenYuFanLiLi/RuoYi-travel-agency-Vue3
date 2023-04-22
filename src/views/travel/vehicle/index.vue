<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
                  <el-form-item label="车辆编号" prop="vehicleId">
                    <el-input
                        v-model="queryParams.vehicleId"
                        placeholder="请输入车辆编号"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="实际金额" prop="actualAmount">
                    <el-input
                        v-model="queryParams.actualAmount"
                        placeholder="请输入实际金额"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="车辆类型id" prop="vehicleTypeId">
                    <el-input
                        v-model="queryParams.vehicleTypeId"
                        placeholder="请输入车辆类型id"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="顾客id" prop="customerId">
                    <el-input
                        v-model="queryParams.customerId"
                        placeholder="请输入顾客id"
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
            v-hasPermi="['travel:vehicle:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['travel:vehicle:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['travel:vehicle:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:vehicle:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vehicleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="${comment}" align="center" prop="id" />
              <el-table-column label="车辆编号" align="center" prop="vehicleId" />
              <el-table-column label="实际金额" align="center" prop="actualAmount" />
              <el-table-column label="车辆类型id" align="center" prop="vehicleTypeId" />
              <el-table-column label="顾客id" align="center" prop="customerId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['travel:vehicle:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['travel:vehicle:remove']">删除</el-button>
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

    <!-- 添加或修改客户-车辆对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="vehicleRef" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="车辆编号" prop="vehicleId">
                          <el-input v-model="form.vehicleId" placeholder="请输入车辆编号" />
                        </el-form-item>
                        <el-form-item label="实际金额" prop="actualAmount">
                          <el-input v-model="form.actualAmount" placeholder="请输入实际金额" />
                        </el-form-item>
                        <el-form-item label="车辆类型id" prop="vehicleTypeId">
                          <el-input v-model="form.vehicleTypeId" placeholder="请输入车辆类型id" />
                        </el-form-item>
                        <el-form-item label="顾客id" prop="customerId">
                          <el-input v-model="form.customerId" placeholder="请输入顾客id" />
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

<script setup name="Vehicle">
  import { listVehicle, getVehicle, delVehicle, addVehicle, updateVehicle } from "@/api/travel/vehicle";

  const { proxy } = getCurrentInstance();

  const vehicleList = ref([]);
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
                    vehicleId: null,
                    actualAmount: null,
                    vehicleTypeId: null,
                    customerId: null
    },
    rules: {
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询客户-车辆列表 */
  function getList() {
    loading.value = true;
    listVehicle(queryParams.value).then(response => {
            vehicleList.value = response.rows;
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
                    vehicleId: null,
                    actualAmount: null,
                    vehicleTypeId: null,
                    customerId: null
    };
    proxy.resetForm("vehicleRef");
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
    title.value = "添加客户-车辆";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getVehicle(_id).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改客户-车辆";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["vehicleRef"].validate(valid => {
      if (valid) {
        if (form.value.id != null) {
          updateVehicle(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addVehicle(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除客户-车辆编号为"' + _ids + '"的数据项？').then(function() {
      return delVehicle(_ids);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('travel/vehicle/export', {
      ...queryParams.value
    }, `vehicle_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
