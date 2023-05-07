<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
                  <el-form-item label="收客记录ID" prop="bookingId">
                    <el-input
                        v-model="queryParams.bookingId"
                        placeholder="请输入收客记录ID"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="组团社ID" prop="groupId">
                    <el-input
                        v-model="queryParams.groupId"
                        placeholder="请输入组团社ID"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="客户姓名" prop="customerName">
                    <el-input
                        v-model="queryParams.customerName"
                        placeholder="请输入客户姓名"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="证件号码" prop="customerIdNumber">
                    <el-input
                        v-model="queryParams.customerIdNumber"
                        placeholder="请输入证件号码"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="联系方式" prop="customerContactInfo">
                    <el-input
                        v-model="queryParams.customerContactInfo"
                        placeholder="请输入联系方式"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="用房信息" prop="customerRoomInfo">
                    <el-input
                        v-model="queryParams.customerRoomInfo"
                        placeholder="请输入用房信息"
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
              <el-table-column label="客户信息ID" align="center" prop="id" />
              <el-table-column label="收客记录ID" align="center" prop="bookingId" />
              <el-table-column label="组团社ID" align="center" prop="groupId" />
              <el-table-column label="客户姓名" align="center" prop="customerName" />
              <el-table-column label="证件类型" align="center" prop="customerIdType" />
              <el-table-column label="证件号码" align="center" prop="customerIdNumber" />
              <el-table-column label="联系方式" align="center" prop="customerContactInfo" />
              <el-table-column label="用房信息" align="center" prop="customerRoomInfo" />
              <el-table-column label="备注" align="center" prop="remark" />
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
                        <el-form-item label="收客记录ID" prop="bookingId">
                          <el-input v-model="form.bookingId" placeholder="请输入收客记录ID" />
                        </el-form-item>
                        <el-form-item label="组团社ID" prop="groupId">
                          <el-input v-model="form.groupId" placeholder="请输入组团社ID" />
                        </el-form-item>
                        <el-form-item label="客户姓名" prop="customerName">
                          <el-input v-model="form.customerName" placeholder="请输入客户姓名" />
                        </el-form-item>
                        <el-form-item label="证件号码" prop="customerIdNumber">
                          <el-input v-model="form.customerIdNumber" placeholder="请输入证件号码" />
                        </el-form-item>
                        <el-form-item label="联系方式" prop="customerContactInfo">
                          <el-input v-model="form.customerContactInfo" placeholder="请输入联系方式" />
                        </el-form-item>
                        <el-form-item label="用房信息" prop="customerRoomInfo">
                          <el-input v-model="form.customerRoomInfo" placeholder="请输入用房信息" />
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="form.remark" placeholder="请输入备注" />
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
                    bookingId: null,
                    groupId: null,
                    customerName: null,
                    customerIdType: null,
                    customerIdNumber: null,
                    customerContactInfo: null,
                    customerRoomInfo: null,
    },
    rules: {
                    bookingId: [
                { required: true, message: "收客记录ID不能为空", trigger: "blur" }
              ],
                    createTime: [
                { required: true, message: "创建时间不能为空", trigger: "blur" }
              ],
                    createBy: [
                { required: true, message: "创建人不能为空", trigger: "blur" }
              ],
                    updateTime: [
                { required: true, message: "更新时间不能为空", trigger: "blur" }
              ],
                    updateBy: [
                { required: true, message: "更新人不能为空", trigger: "blur" }
              ],
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
                    bookingId: null,
                    groupId: null,
                    customerName: null,
                    customerIdType: null,
                    customerIdNumber: null,
                    customerContactInfo: null,
                    customerRoomInfo: null,
                    createTime: null,
                    createBy: null,
                    updateTime: null,
                    updateBy: null,
                    remark: null
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
