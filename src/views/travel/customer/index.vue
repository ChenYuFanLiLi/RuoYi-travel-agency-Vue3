<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
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
            v-hasPermi="['travel:customer:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['travel:customer:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['travel:customer:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:customer:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="${comment}" align="center" prop="id" />
              <el-table-column label="顾客来源" align="center" prop="customerSource" />
              <el-table-column label="顾客线路" align="center" prop="customerRoute" />
              <el-table-column label="顾客姓名" align="center" prop="customerName" />
              <el-table-column label="顾客联系方式" align="center" prop="customerContact" />
              <el-table-column label="证件类型" align="center" prop="idType" />
              <el-table-column label="证件号码" align="center" prop="idNumber" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['travel:customer:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['travel:customer:remove']">删除</el-button>
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

    <!-- 添加或修改客户信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="customerRef" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="顾客来源" prop="customerSource">
                          <el-input v-model="form.customerSource" type="textarea" placeholder="请输入内容" />
                        </el-form-item>
                        <el-form-item label="顾客线路" prop="customerRoute">
                          <el-input v-model="form.customerRoute" type="textarea" placeholder="请输入内容" />
                        </el-form-item>
                        <el-form-item label="顾客姓名" prop="customerName">
                          <el-input v-model="form.customerName" type="textarea" placeholder="请输入内容" />
                        </el-form-item>
                        <el-form-item label="顾客联系方式" prop="customerContact">
                          <el-input v-model="form.customerContact" type="textarea" placeholder="请输入内容" />
                        </el-form-item>
                        <el-form-item label="证件号码" prop="idNumber">
                          <el-input v-model="form.idNumber" type="textarea" placeholder="请输入内容" />
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

<script setup name="Customer">
  import { listCustomer, getCustomer, delCustomer, addCustomer, updateCustomer } from "@/api/travel/customer";

  const { proxy } = getCurrentInstance();

  const customerList = ref([]);
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
                    customerSource: null,
                    customerRoute: null,
                    customerName: null,
                    customerContact: null,
                    idType: null,
                    idNumber: null
    },
    rules: {
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询客户信息列表 */
  function getList() {
    loading.value = true;
    listCustomer(queryParams.value).then(response => {
            customerList.value = response.rows;
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
                    customerSource: null,
                    customerRoute: null,
                    customerName: null,
                    customerContact: null,
                    idType: null,
                    idNumber: null
    };
    proxy.resetForm("customerRef");
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
    title.value = "添加客户信息";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getCustomer(_id).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改客户信息";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["customerRef"].validate(valid => {
      if (valid) {
        if (form.value.id != null) {
          updateCustomer(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addCustomer(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除客户信息编号为"' + _ids + '"的数据项？').then(function() {
      return delCustomer(_ids);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('travel/customer/export', {
      ...queryParams.value
    }, `customer_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
