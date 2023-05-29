<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="团队编号" prop="teamId">
        <el-input
            v-model="queryParams.teamId"
            placeholder="请输入团队编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="团号" prop="groupNumber">
        <el-input
            v-model="queryParams.groupNumber"
            placeholder="请输入团号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出发日期" prop="planDepartureDate">
        <el-date-picker clearable
                        v-model="queryParams.planDepartureDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择出发日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="导游姓名" prop="guideName">
        <el-input
            v-model="queryParams.guideName"
            placeholder="请输入导游姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="导游电话" prop="guidePhone">
        <el-input
            v-model="queryParams.guidePhone"
            placeholder="请输入导游电话"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机电话" prop="driverPhone">
        <el-input
            v-model="queryParams.driverPhone"
            placeholder="请输入司机电话"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="司机姓名" prop="driverName">
        <el-input
            v-model="queryParams.driverName"
            placeholder="请输入司机姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号码" prop="carNumber">
        <el-input
            v-model="queryParams.carNumber"
            placeholder="请输入车牌号码"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计调姓名" prop="plannerName">
        <el-input
            v-model="queryParams.plannerName"
            placeholder="请输入计调姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计调电话" prop="plannerPhone">
        <el-input
            v-model="queryParams.plannerPhone"
            placeholder="请输入计调电话"
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
            v-hasPermi="['travel:plan:edit']"
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
            v-hasPermi="['travel:plan:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:plan:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id"/>
      <el-table-column label="行程ID" align="center" prop="itineraryId"/>
      <el-table-column label="团队编号" align="center" prop="teamId"/>
      <el-table-column label="团号" align="center" prop="groupNumber"/>
      <el-table-column label="出发日期" align="center" prop="planDepartureDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planDepartureDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导游姓名" align="center" prop="guideName"/>
      <el-table-column label="导游电话" align="center" prop="guidePhone"/>
      <el-table-column label="司机电话" align="center" prop="driverPhone"/>
      <el-table-column label="司机姓名" align="center" prop="driverName"/>
      <el-table-column label="车牌号码" align="center" prop="carNumber"/>
      <el-table-column label="计调姓名" align="center" prop="plannerName"/>
      <el-table-column label="计调电话" align="center" prop="plannerPhone"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['travel:plan:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Edit" @click="planDetail(scope.row)"
                     v-hasPermi="['travel:plan:edit']">项目明细
          </el-button>
          <el-button link type="primary" icon="Edit" @click="cashDetail(scope.row)"
                     v-hasPermi="['travel:plan:edit']">现收明细
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['travel:plan:remove']">删除
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

    <!-- 添加或修改操作计划对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="planRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="行程" prop="itineraryId">
          <el-select v-model="form.itineraryId" placeholder="请选择行程">
            <el-option
                v-for="itinerary in itineraryList"
                :key="itinerary.value"
                :label="itinerary.label"
                :value="itinerary.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="团号" prop="groupNumber">
          <el-input v-model="form.groupNumber" placeholder="请输入团号"/>
        </el-form-item>
        <el-form-item label="出发日期" prop="planDepartureDate">
          <el-date-picker clearable
                          v-model="form.planDepartureDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择出发日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="导游姓名" prop="guideName">
          <el-input v-model="form.guideName" placeholder="请输入导游姓名"/>
        </el-form-item>
        <el-form-item label="导游电话" prop="guidePhone">
          <el-input v-model="form.guidePhone" placeholder="请输入导游电话"/>
        </el-form-item>
        <el-form-item label="司机电话" prop="driverPhone">
          <el-input v-model="form.driverPhone" placeholder="请输入司机电话"/>
        </el-form-item>
        <el-form-item label="司机姓名" prop="driverName">
          <el-input v-model="form.driverName" placeholder="请输入司机姓名"/>
        </el-form-item>
        <el-form-item label="车牌号码" prop="carNumber">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号码"/>
        </el-form-item>
        <el-form-item label="计调姓名" prop="plannerName">
          <el-input v-model="form.plannerName" placeholder="请输入计调姓名"/>
        </el-form-item>
        <el-form-item label="计调电话" prop="plannerPhone">
          <el-input v-model="form.plannerPhone" placeholder="请输入计调电话"/>
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

    <el-dialog :title="planDetailTitle" v-model="planDetailView" width="90rem" destroy-on-close>
      <PlanDetail-modal :detailPlanID="detailPlanID">
      </PlanDetail-modal>
    </el-dialog>

    <el-dialog :title="cashDetailTitle" v-model="cashDetailView" width="90rem" destroy-on-close>
      <CashDetail-modal :detailPlanID="detailPlanID">
      </CashDetail-modal>
    </el-dialog>

  </div>
</template>

<script setup name="Plan">
import {listPlan, getPlan, delPlan, addPlan, updatePlan, listItinerary} from "@/api/travel/plan";
import {ref} from "vue";
import PlanDetailModal from '../planDetail/planDetailModal.vue'
import CashDetailModal from '../cashdetail/cashDetailModal.vue'
import request from "@/utils/request";

const {proxy} = getCurrentInstance();

const itineraryList = ref([]);

const planDetailView = ref(false);
const planDetailTitle = ref("");
const detailPlanID = ref(null);

const cashDetailView = ref(false);
const cashDetailTitle = ref("");

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
    itineraryId: null,
    teamId: null,
    groupNumber: null,
    planDepartureDate: null,
    guideName: null,
    guidePhone: null,
    driverPhone: null,
    driverName: null,
    carNumber: null,
    plannerName: null,
    plannerPhone: null,
  },
  rules: {
    itineraryId: [
      {required: true, message: "行程ID不能为空", trigger: "change"}
    ],
    planDepartureDate: [
      {required: true, message: "出发日期不能为空", trigger: "blur"}
    ],
    guideName: [
      {required: true, message: "导游姓名不能为空", trigger: "blur"}
    ],
    guidePhone: [
      {required: true, message: "导游电话不能为空", trigger: "blur"}
    ],
    driverPhone: [
      {required: true, message: "司机电话不能为空", trigger: "blur"}
    ],
    driverName: [
      {required: true, message: "司机姓名不能为空", trigger: "blur"}
    ],
    carNumber: [
      {required: true, message: "车牌号码不能为空", trigger: "blur"}
    ],
    plannerName: [
      {required: true, message: "计调姓名不能为空", trigger: "blur"}
    ],
    plannerPhone: [
      {required: true, message: "计调电话不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询未选择行程表 */
function getListItinerary() {
  listItinerary(queryParams.value).then(response => {
    itineraryList.value = response;
  });
}

/** 项目明细 */
function planDetail(row) {
  planDetailTitle.value = row.groupNumber;
  planDetailView.value = true;
  detailPlanID.value = row.id;
}

/** 现收明细 */
function cashDetail(row) {
  cashDetailTitle.value = row.groupNumber;
  cashDetailView.value = true;
  detailPlanID.value = row.id;
}

/** 查询操作计划列表 */
function getList() {
  loading.value = true;
  listPlan().then(response => {
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
    id: null,
    itineraryId: null,
    teamId: null,
    groupNumber: null,
    planDepartureDate: null,
    guideName: null,
    guidePhone: null,
    driverPhone: null,
    driverName: null,
    carNumber: null,
    plannerName: null,
    plannerPhone: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    remark: null
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加操作计划";
  getListItinerary();
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPlan(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改操作计划";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["planRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除操作计划编号为"' + _ids + '"的数据项？').then(function () {
    return delPlan(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('travel/plan/export', {
    ...queryParams.value
  }, `plan_${new Date().getTime()}.xlsx`)
  // console.log(queryParams.value)
  // request({
  //   url: 'travel/plan/export',
  //   method: 'post',
  //   params: queryParams.value,
  // }).then((res)=>{
  //   window.location.href = "http://localhost:8080/profile/download/"+res.msg;
  // })
}

getList();
</script>
