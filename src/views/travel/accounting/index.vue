<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="团号" prop="tourNumber">
        <el-input
            v-model="queryParams.tourNumber"
            placeholder="请输入团号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出发日期" prop="departureDate">
        <el-date-picker clearable
                        v-model="queryParams.departureDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择出发日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="团队编号" prop="teamNumber">
        <el-input
            v-model="queryParams.teamNumber"
            placeholder="请输入团队编号"
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
            v-hasPermi="['travel:accounting:add']"
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
            v-hasPermi="['travel:accounting:edit']"
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
            v-hasPermi="['travel:accounting:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:accounting:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accountingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id"/>
      <el-table-column label="团号" align="center" prop="tourNumber"/>
      <el-table-column label="出发日期" align="center" prop="departureDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.departureDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团队编号" align="center" prop="teamNumber"/>
      <el-table-column label="合计转出" align="center" prop="costTotalTransfer"/>
      <el-table-column label="导游垫款" align="center" prop="costGuideAdvance"/>
      <el-table-column label="报账明细" align="center" prop="costReimbursementDetail"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['travel:accounting:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Edit" @click="costDetail(scope.row)"
                     v-hasPermi="['travel:accounting:edit']">明细记录
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['travel:accounting:remove']">删除
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

    <!-- 添加或修改成本核算对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="accountingRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="行程" prop="itineraryId">
          <el-select v-model="form.itineraryId" placeholder="请选择行程(含操作计划)" @change="itineraryChange">
            <el-option
                v-for="itinerary in itineraryList"
                :key="itinerary.value"
                :label="itinerary.label"
                :value="itinerary.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="团号" prop="tourNumber">
          <el-input v-model="form.tourNumber" placeholder="请输入团号"/>
        </el-form-item>
        <el-form-item label="出发日期" prop="departureDate">
          <el-date-picker clearable
                          v-model="form.departureDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择行程" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="团队编号" prop="teamNumber">
          <el-input v-model="form.teamNumber" placeholder="请选择行程" disabled/>
        </el-form-item>
        <el-form-item label="合计转出" prop="costTotalTransfer">
          <el-input v-model="form.costTotalTransfer" placeholder="请输入合计转出"/>
        </el-form-item>
        <el-form-item label="导游垫款" prop="costGuideAdvance">
          <el-input v-model="form.costGuideAdvance" placeholder="请输入导游垫款"/>
        </el-form-item>
        <el-form-item label="报账明细" prop="costReimbursementDetail">
          <el-input v-model="form.costReimbursementDetail" placeholder="请输入报账明细"/>
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

    <el-dialog :title="costDetailTitle" v-model="costDetailView" width="90rem" destroy-on-close>
      <CostDetail-modal :detailCostID="detailCostID">
      </CostDetail-modal>
    </el-dialog>

  </div>
</template>

<script setup name="Accounting">
import {
  listAccounting,
  getAccounting,
  delAccounting,
  addAccounting,
  updateAccounting,
  listItinerary
} from "@/api/travel/accounting";
import {ref} from "vue";

import CostDetailModal from '../costdetail/costDetailModal.vue'

const {proxy} = getCurrentInstance();

const itineraryList = ref([]);

const costDetailTitle = ref("");
const costDetailView = ref(false);
const detailCostID = ref(null);

const accountingList = ref([]);
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
    itineraryId: null,
    operationPlanId: null,
    tourNumber: null,
    departureDate: null,
    teamNumber: null,
    costTotalTransfer: null,
    costGuideAdvance: null,
    costReimbursementDetail: null,
  },
  rules: {
    itineraryId: [
      {required: true, message: "行程ID不能为空", trigger: "change"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

function getListItinerary() {
  listItinerary(queryParams.value).then(response => {
    itineraryList.value = response;
  });
}

function costDetail(row) {
  costDetailTitle.value = row.tourNumber;
  costDetailView.value = true;
  detailCostID.value = row.id;
}

/** 查询成本核算列表 */
function getList() {
  loading.value = true;
  listAccounting(queryParams.value).then(response => {
    accountingList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 选择行程填入信息 */
function itineraryChange(value) {
  console.log(value);
  itineraryList.value.forEach((item) => {
    if (item.value == value) {
      data.form.itineraryId = item.value;
      data.form.teamNumber = item.team_id;
      data.form.tourNumber = item.group_number;
      data.form.departureDate = item.plan_departure_date;
      data.form.operationPlanId = item.operation_plan_id;
    }
  })
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
    itineraryId: null,
    operationPlanId: null,
    tourNumber: null,
    departureDate: null,
    teamNumber: null,
    costTotalTransfer: null,
    costGuideAdvance: null,
    costReimbursementDetail: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("accountingRef");
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
  title.value = "添加成本核算";
  getListItinerary();
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getAccounting(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改成本核算";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["accountingRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAccounting(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAccounting(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除成本核算编号为"' + _ids + '"的数据项？').then(function () {
    return delAccounting(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('travel/accounting/export', {
    ...queryParams.value
  }, `accounting_${new Date().getTime()}.xlsx`)
}

getList();
</script>
