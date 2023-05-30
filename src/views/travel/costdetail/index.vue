<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
                  <el-form-item label="成本核算ID" prop="operationCostId">
                    <el-input
                        v-model="queryParams.operationCostId"
                        placeholder="请输入成本核算ID"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="行程ID" prop="travelScheduleId">
                    <el-input
                        v-model="queryParams.travelScheduleId"
                        placeholder="请输入行程ID"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="项目ID" prop="projectId">
                    <el-input
                        v-model="queryParams.projectId"
                        placeholder="请输入项目ID"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="项目名称" prop="projectName">
                    <el-input
                        v-model="queryParams.projectName"
                        placeholder="请输入项目名称"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="项目成本" prop="projectCost">
                    <el-input
                        v-model="queryParams.projectCost"
                        placeholder="请输入项目成本"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="项目数量" prop="projectAmount">
                    <el-input
                        v-model="queryParams.projectAmount"
                        placeholder="请输入项目数量"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="项目单位" prop="projectUnit">
                    <el-input
                        v-model="queryParams.projectUnit"
                        placeholder="请输入项目单位"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="金额" prop="costAmount">
                    <el-input
                        v-model="queryParams.costAmount"
                        placeholder="请输入金额"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="现金" prop="costCash">
                    <el-input
                        v-model="queryParams.costCash"
                        placeholder="请输入现金"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="刷卡" prop="costCard">
                    <el-input
                        v-model="queryParams.costCard"
                        placeholder="请输入刷卡"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="转账" prop="costTransfer">
                    <el-input
                        v-model="queryParams.costTransfer"
                        placeholder="请输入转账"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="冲抵" prop="costOffset">
                    <el-input
                        v-model="queryParams.costOffset"
                        placeholder="请输入冲抵"
                        clearable
                        @keyup.enter="handleQuery"
                    />
                  </el-form-item>
                  <el-form-item label="挂账" prop="costOnCredit">
                    <el-input
                        v-model="queryParams.costOnCredit"
                        placeholder="请输入挂账"
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
            v-hasPermi="['travel:costdetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['travel:costdetail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['travel:costdetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:costdetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="costdetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="主键" align="center" prop="id" />
              <el-table-column label="成本核算ID" align="center" prop="operationCostId" />
              <el-table-column label="行程ID" align="center" prop="travelScheduleId" />
              <el-table-column label="项目ID" align="center" prop="projectId" />
              <el-table-column label="项目类型" align="center" prop="planType" />
              <el-table-column label="项目名称" align="center" prop="projectName" />
              <el-table-column label="项目成本" align="center" prop="projectCost" />
              <el-table-column label="项目数量" align="center" prop="projectAmount" />
              <el-table-column label="项目单位" align="center" prop="projectUnit" />
              <el-table-column label="金额" align="center" prop="costAmount" />
              <el-table-column label="现金" align="center" prop="costCash" />
              <el-table-column label="刷卡" align="center" prop="costCard" />
              <el-table-column label="转账" align="center" prop="costTransfer" />
              <el-table-column label="冲抵" align="center" prop="costOffset" />
              <el-table-column label="挂账" align="center" prop="costOnCredit" />
              <el-table-column label="凭据" align="center" prop="costVoucher" width="100">
                <template #default="scope">
                  <image-preview :src="scope.row.costVoucher" :width="50" :height="50"/>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['travel:costdetail:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['travel:costdetail:remove']">删除</el-button>
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

    <!-- 添加或修改成本核算明细对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="costdetailRef" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="成本核算ID" prop="operationCostId">
                          <el-input v-model="form.operationCostId" placeholder="请输入成本核算ID" />
                        </el-form-item>
                        <el-form-item label="行程ID" prop="travelScheduleId">
                          <el-input v-model="form.travelScheduleId" placeholder="请输入行程ID" />
                        </el-form-item>
                        <el-form-item label="项目ID" prop="projectId">
                          <el-input v-model="form.projectId" placeholder="请输入项目ID" />
                        </el-form-item>
                        <el-form-item label="项目名称" prop="projectName">
                          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
                        </el-form-item>
                        <el-form-item label="项目成本" prop="projectCost">
                          <el-input v-model="form.projectCost" placeholder="请输入项目成本" />
                        </el-form-item>
                        <el-form-item label="项目数量" prop="projectAmount">
                          <el-input v-model="form.projectAmount" placeholder="请输入项目数量" />
                        </el-form-item>
                        <el-form-item label="项目单位" prop="projectUnit">
                          <el-input v-model="form.projectUnit" placeholder="请输入项目单位" />
                        </el-form-item>
                        <el-form-item label="金额" prop="costAmount">
                          <el-input v-model="form.costAmount" placeholder="请输入金额" />
                        </el-form-item>
                        <el-form-item label="现金" prop="costCash">
                          <el-input v-model="form.costCash" placeholder="请输入现金" />
                        </el-form-item>
                        <el-form-item label="刷卡" prop="costCard">
                          <el-input v-model="form.costCard" placeholder="请输入刷卡" />
                        </el-form-item>
                        <el-form-item label="转账" prop="costTransfer">
                          <el-input v-model="form.costTransfer" placeholder="请输入转账" />
                        </el-form-item>
                        <el-form-item label="冲抵" prop="costOffset">
                          <el-input v-model="form.costOffset" placeholder="请输入冲抵" />
                        </el-form-item>
                        <el-form-item label="挂账" prop="costOnCredit">
                          <el-input v-model="form.costOnCredit" placeholder="请输入挂账" />
                        </el-form-item>
                        <el-form-item label="凭据" prop="costVoucher">
                          <image-upload v-model="form.costVoucher"/>
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

<script setup name="Costdetail">
  import { listCostdetail, getCostdetail, delCostdetail, addCostdetail, updateCostdetail } from "@/api/travel/costdetail";

  const { proxy } = getCurrentInstance();

  const costdetailList = ref([]);
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
                    operationCostId: null,
                    travelScheduleId: null,
                    projectId: null,
                    planType: null,
                    projectName: null,
                    projectCost: null,
                    projectAmount: null,
                    projectUnit: null,
                    costAmount: null,
                    costCash: null,
                    costCard: null,
                    costTransfer: null,
                    costOffset: null,
                    costOnCredit: null,
                    costVoucher: null,
    },
    rules: {
                    operationCostId: [
                { required: true, message: "成本核算ID不能为空", trigger: "blur" }
              ],
                    projectName: [
                { required: true, message: "项目名称不能为空", trigger: "blur" }
              ],
                    projectCost: [
                { required: true, message: "项目成本不能为空", trigger: "blur" }
              ],
                    projectAmount: [
                { required: true, message: "项目数量不能为空", trigger: "blur" }
              ],
                    projectUnit: [
                { required: true, message: "项目单位不能为空", trigger: "blur" }
              ],
                    costAmount: [
                { required: true, message: "金额不能为空", trigger: "blur" }
              ],
                    costCash: [
                { required: true, message: "现金不能为空", trigger: "blur" }
              ],
                    costCard: [
                { required: true, message: "刷卡不能为空", trigger: "blur" }
              ],
                    costTransfer: [
                { required: true, message: "转账不能为空", trigger: "blur" }
              ],
                    costOffset: [
                { required: true, message: "冲抵不能为空", trigger: "blur" }
              ],
                    costOnCredit: [
                { required: true, message: "挂账不能为空", trigger: "blur" }
              ],
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询成本核算明细列表 */
  function getList() {
    loading.value = true;
    listCostdetail(queryParams.value).then(response => {
            costdetailList.value = response.rows;
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
                    operationCostId: null,
                    travelScheduleId: null,
                    projectId: null,
                    planType: null,
                    projectName: null,
                    projectCost: null,
                    projectAmount: null,
                    projectUnit: null,
                    costAmount: null,
                    costCash: null,
                    costCard: null,
                    costTransfer: null,
                    costOffset: null,
                    costOnCredit: null,
                    costVoucher: null,
                    createTime: null,
                    createBy: null,
                    updateTime: null,
                    updateBy: null,
                    remark: null
    };
    proxy.resetForm("costdetailRef");
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
    title.value = "添加成本核算明细";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getCostdetail(_id).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改成本核算明细";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["costdetailRef"].validate(valid => {
      if (valid) {
        if (form.value.id != null) {
          updateCostdetail(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addCostdetail(form.value).then(response => {
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
    proxy.$modal.confirm('是否确认删除成本核算明细编号为"' + _ids + '"的数据项？').then(function() {
      return delCostdetail(_ids);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('travel/costdetail/export', {
      ...queryParams.value
    }, `costdetail_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
