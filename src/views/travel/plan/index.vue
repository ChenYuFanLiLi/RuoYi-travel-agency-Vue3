<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
                  <el-form-item label="日期" prop="date">
                    <el-date-picker clearable
                                    v-model="queryParams.date"
                                    type="date"
                                    value-format="YYYY-MM-DD"
                                    placeholder="请选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="科目id" prop="subjectId">
                    <el-input
                        v-model="queryParams.subjectId"
                        placeholder="请输入科目id"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="计划数量" prop="planQuantity">
                    <el-input
                        v-model="queryParams.planQuantity"
                        placeholder="请输入计划数量"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="金额" prop="amount">
                    <el-input
                        v-model="queryParams.amount"
                        placeholder="请输入金额"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="现金" prop="cash">
                    <el-input
                        v-model="queryParams.cash"
                        placeholder="请输入现金"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="刷卡" prop="card">
                    <el-input
                        v-model="queryParams.card"
                        placeholder="请输入刷卡"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="转账" prop="transfer">
                    <el-input
                        v-model="queryParams.transfer"
                        placeholder="请输入转账"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="冲抵" prop="offset">
                    <el-input
                        v-model="queryParams.offset"
                        placeholder="请输入冲抵"
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
            v-hasPermi="['travel:plan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['travel:plan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['travel:plan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:plan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="${comment}" align="center" prop="planId" />
              <el-table-column label="日期" align="center" prop="date" width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="科目id" align="center" prop="subjectId" />
              <el-table-column label="计划类型" align="center" prop="planType" />
              <el-table-column label="计划数量" align="center" prop="planQuantity" />
              <el-table-column label="金额" align="center" prop="amount" />
              <el-table-column label="现金" align="center" prop="cash" />
              <el-table-column label="刷卡" align="center" prop="card" />
              <el-table-column label="转账" align="center" prop="transfer" />
              <el-table-column label="冲抵" align="center" prop="offset" />
              <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['travel:plan:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['travel:plan:remove']">删除</el-button>
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

    <!-- 添加或修改操作计划对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="planRef" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="日期" prop="date">
                          <el-date-picker clearable
                                          v-model="form.date"
                                          type="date"
                                          value-format="YYYY-MM-DD"
                                          placeholder="请选择日期">
                          </el-date-picker>
                        </el-form-item>
                        <el-form-item label="科目id" prop="subjectId">
                          <el-input v-model="form.subjectId" placeholder="请输入科目id" />
                        </el-form-item>
                        <el-form-item label="计划数量" prop="planQuantity">
                          <el-input v-model="form.planQuantity" placeholder="请输入计划数量" />
                        </el-form-item>
                        <el-form-item label="金额" prop="amount">
                          <el-input v-model="form.amount" placeholder="请输入金额" />
                        </el-form-item>
                        <el-form-item label="现金" prop="cash">
                          <el-input v-model="form.cash" placeholder="请输入现金" />
                        </el-form-item>
                        <el-form-item label="刷卡" prop="card">
                          <el-input v-model="form.card" placeholder="请输入刷卡" />
                        </el-form-item>
                        <el-form-item label="转账" prop="transfer">
                          <el-input v-model="form.transfer" placeholder="请输入转账" />
                        </el-form-item>
                        <el-form-item label="冲抵" prop="offset">
                          <el-input v-model="form.offset" placeholder="请输入冲抵" />
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

<script setup name="Plan">
  import { listPlan, getPlan, delPlan, addPlan, updatePlan } from "@/api/travel/plan";

  const { proxy } = getCurrentInstance();

  const planList = ref([]);
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
                    date: null,
                    subjectId: null,
                    planType: null,
                    planQuantity: null,
                    amount: null,
                    cash: null,
                    card: null,
                    transfer: null,
                    offset: null,
                    remarks: null
    },
    rules: {
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询操作计划列表 */
  function getList() {
    loading.value = true;
    listPlan(queryParams.value).then(response => {
            planList.value = response.rows;
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
                    planId: null,
                    date: null,
                    subjectId: null,
                    planType: null,
                    planQuantity: null,
                    amount: null,
                    cash: null,
                    card: null,
                    transfer: null,
                    offset: null,
                    remarks: null
    };
    proxy.resetForm("planRef");
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
    ids.value = selection.map(item => item.planId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加操作计划";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _planId = row.planId || ids.value
    getPlan(_planId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改操作计划";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["planRef"].validate(valid => {
      if (valid) {
        if (form.value.planId != null) {
          updatePlan(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addPlan(form.value).then(response => {
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
    const _planIds = row.planId || ids.value;
    proxy.$modal.confirm('是否确认删除操作计划编号为"' + _planIds + '"的数据项？').then(function() {
      return delPlan(_planIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('travel/plan/export', {
      ...queryParams.value
    }, `plan_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
