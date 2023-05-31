<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="关联ID" prop="relatedId">-->
<!--        <el-input-->
<!--            v-model="queryParams.relatedId"-->
<!--            placeholder="请输入关联ID"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="现收项目" prop="cashProject">
        <el-input
            v-model="queryParams.cashProject"
            placeholder="请输入现收项目"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="单价" prop="cashUnitPrice">-->
<!--        <el-input-->
<!--            v-model="queryParams.cashUnitPrice"-->
<!--            placeholder="请输入单价"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="单位" prop="cashUnit">-->
<!--        <el-input-->
<!--            v-model="queryParams.cashUnit"-->
<!--            placeholder="请输入单位"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="数量" prop="cashQuantity">-->
<!--        <el-input-->
<!--            v-model="queryParams.cashQuantity"-->
<!--            placeholder="请输入数量"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="金额" prop="cashAmount">-->
<!--        <el-input-->
<!--            v-model="queryParams.cashAmount"-->
<!--            placeholder="请输入金额"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="抵现" prop="cashDiscount">-->
<!--        <el-input-->
<!--            v-model="queryParams.cashDiscount"-->
<!--            placeholder="请输入抵现"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="类型" prop="cashType">-->
<!--        <el-input-->
<!--            v-model="queryParams.cashType"-->
<!--            placeholder="请输入类型"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
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
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="warning"-->
<!--            plain-->
<!--            icon="Download"-->
<!--            @click="handleExport"-->
<!--            v-hasPermi="['travel:plan:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cashdetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" />
<!--      <el-table-column label="关联ID" align="center" prop="relatedId" />-->
      <el-table-column label="现收项目" align="center" prop="cashProject" />
      <el-table-column label="单价" align="center" prop="cashUnitPrice" />
      <el-table-column label="单位" align="center" prop="cashUnit" />
      <el-table-column label="数量" align="center" prop="cashQuantity" />
      <el-table-column label="金额" align="center" prop="cashAmount" />
      <el-table-column label="抵现" align="center" prop="cashDiscount" />
<!--      <el-table-column label="类型" align="center" prop="cashType" />-->
      <el-table-column label="备注" align="center" prop="remark" />
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

    <!-- 添加或修改现金明细对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="cashdetailRef" :model="form" :rules="rules" label-width="80px">
<!--        <el-form-item label="关联ID" prop="relatedId">-->
<!--          <el-input v-model="form.relatedId" placeholder="请输入关联ID" />-->
<!--        </el-form-item>-->
        <el-form-item label="现收项目" prop="cashProject">
          <el-input v-model="form.cashProject" placeholder="请输入现收项目" />
        </el-form-item>
        <el-form-item label="单价" prop="cashUnitPrice">
          <el-input v-model="form.cashUnitPrice" placeholder="请输入单价" />
        </el-form-item>
        <el-form-item label="单位" prop="cashUnit">
          <el-input v-model="form.cashUnit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="数量" prop="cashQuantity">
          <el-input v-model="form.cashQuantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="金额" prop="cashAmount">
          <el-input v-model="form.cashAmount" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="抵现" prop="cashDiscount">
          <el-input v-model="form.cashDiscount" placeholder="请输入抵现" />
        </el-form-item>
<!--        <el-form-item label="类型" prop="cashType">-->
<!--          <el-input v-model="form.cashType" placeholder="请输入类型" />-->
<!--        </el-form-item>-->
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

<script setup name="Cashdetail">
import { listCashdetail, getCashdetail, delCashdetail, addCashdetail, updateCashdetail } from "@/api/travel/cashdetail";
import {defineProps} from "vue";

const props = defineProps({detailPlanID: Number})
const { proxy } = getCurrentInstance();

const cashdetailList = ref([]);
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
    relatedId: props.detailPlanID,
    cashProject: null,
    cashUnitPrice: null,
    cashUnit: null,
    cashQuantity: null,
    cashAmount: null,
    cashDiscount: null,
    cashType: "plan",
  },
  rules: {
    relatedId: [
      { required: true, message: "关联ID不能为空", trigger: "blur" }
    ],
    cashUnitPrice: [
      { required: true, message: "单价不能为空", trigger: "blur" }
    ],
    cashUnit: [
      { required: true, message: "单位不能为空", trigger: "blur" }
    ],
    cashQuantity: [
      { required: true, message: "数量不能为空", trigger: "blur" }
    ],
    cashAmount: [
      { required: true, message: "金额不能为空", trigger: "blur" }
    ],
    cashDiscount: [
      { required: true, message: "抵现不能为空", trigger: "blur" }
    ],
    cashType: [
      { required: true, message: "类型不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询现金明细列表 */
function getList() {
  loading.value = true;
  listCashdetail(queryParams.value).then(response => {
    cashdetailList.value = response.rows;
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
    relatedId: props.detailPlanID,
    cashProject: null,
    cashUnitPrice: null,
    cashUnit: null,
    cashQuantity: null,
    cashAmount: null,
    cashDiscount: null,
    cashType: "plan",
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("cashdetailRef");
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
  title.value = "添加现金明细";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCashdetail(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改现金明细";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["cashdetailRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCashdetail(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCashdetail(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除现金明细编号为"' + _ids + '"的数据项？').then(function() {
    return delCashdetail(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('travel/cashdetail/export', {
    ...queryParams.value
  }, `cashdetail_${new Date().getTime()}.xlsx`)
}

getList();
</script>
