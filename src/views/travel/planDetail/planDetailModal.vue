<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <!--                  <el-form-item label="操作计划ID" prop="operationPlanId">-->
      <!--                    <el-input-->
      <!--                        v-model="queryParams.operationPlanId"-->
      <!--                        placeholder="请输入操作计划ID"-->
      <!--                        clearable-->
      <!--                        @keyup.enter="handleQuery"-->
      <!--                    />-->
      <!--                  </el-form-item>-->
      <!--                  <el-form-item label="行程详情ID" prop="travelScheduleId">-->
      <!--                    <el-input-->
      <!--                        v-model="queryParams.travelScheduleId"-->
      <!--                        placeholder="请输入行程详情ID"-->
      <!--                        clearable-->
      <!--                        @keyup.enter="handleQuery"-->
      <!--                    />-->
      <!--                  </el-form-item>-->
      <el-form-item label="类型" prop="planType">
        <el-select v-model="queryParams.planType" placeholder="请选择类型" clearable>
          <el-option
              v-for="dict in travel_project_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
            v-model="queryParams.projectName"
            placeholder="请输入项目名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="项目成本" prop="projectCost">-->
<!--        <el-input-->
<!--            v-model="queryParams.projectCost"-->
<!--            placeholder="请输入项目成本"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="项目数量" prop="projectQuantity">-->
<!--        <el-input-->
<!--            v-model="queryParams.projectQuantity"-->
<!--            placeholder="请输入项目数量"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="项目单位" prop="projectUnit">-->
<!--        <el-input-->
<!--            v-model="queryParams.projectUnit"-->
<!--            placeholder="请输入项目单位"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="金额" prop="planAmount">-->
<!--        <el-input-->
<!--            v-model="queryParams.planAmount"-->
<!--            placeholder="请输入金额"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="现金" prop="planCash">-->
<!--        <el-input-->
<!--            v-model="queryParams.planCash"-->
<!--            placeholder="请输入现金"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="刷卡" prop="planCard">-->
<!--        <el-input-->
<!--            v-model="queryParams.planCard"-->
<!--            placeholder="请输入刷卡"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="转账" prop="planTransfer">-->
<!--        <el-input-->
<!--            v-model="queryParams.planTransfer"-->
<!--            placeholder="请输入转账"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="冲抵" prop="planOffset">-->
<!--        <el-input-->
<!--            v-model="queryParams.planOffset"-->
<!--            placeholder="请输入冲抵"-->
<!--            clearable-->
<!--            @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="挂账" prop="planCredit">-->
<!--        <el-input-->
<!--            v-model="queryParams.planCredit"-->
<!--            placeholder="请输入挂账"-->
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

    <el-table v-loading="loading" :data="planDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="计划项目明细ID" align="center" prop="id"/>
      <el-table-column label="操作计划ID" align="center" prop="operationPlanId"/>
      <!--              <el-table-column label="行程详情ID" align="center" prop="travelScheduleId" />-->
      <el-table-column label="类型" align="center" prop="planType">
        <template #default="scope">
          <dict-tag :options="travel_project_type" :value="scope.row.planType"/>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" prop="projectName"/>
      <el-table-column label="项目成本" align="center" prop="projectCost"/>
      <el-table-column label="项目数量" align="center" prop="projectQuantity"/>
      <el-table-column label="项目单位" align="center" prop="projectUnit"/>
      <el-table-column label="金额" align="center" prop="planAmount"/>
      <el-table-column label="现金" align="center" prop="planCash"/>
      <el-table-column label="刷卡" align="center" prop="planCard"/>
      <el-table-column label="转账" align="center" prop="planTransfer"/>
      <el-table-column label="冲抵" align="center" prop="planOffset"/>
      <el-table-column label="挂账" align="center" prop="planCredit"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['travel:plan:edit']">修改
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

    <!-- 添加或修改计划项目明细对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="planDetailRef" :model="form" :rules="rules" label-width="80px">
        <!--                        <el-form-item label="操作计划ID" prop="operationPlanId">-->
        <!--                          <el-input v-model="form.operationPlanId" placeholder="请输入操作计划ID" />-->
        <!--                        </el-form-item>-->
        <!--                        <el-form-item label="行程详情ID" prop="travelScheduleId">-->
        <!--                          <el-input v-model="form.travelScheduleId" placeholder="请输入行程详情ID" />-->
        <!--                        </el-form-item>-->
        <el-form-item label="项目" prop="projectId">
          <el-select v-model="form.projectId" placeholder="请选择项目" @change="projectChange">
            <el-option
                v-for="project in projectList"
                :key="project.id"
                :label="project.projectName"
                :value="project.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="planType">
          <el-select v-model="form.planType" placeholder="请选择类型">
            <el-option
                v-for="dict in travel_project_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称"/>
        </el-form-item>
        <el-form-item label="项目成本" prop="projectCost">
          <el-input v-model="form.projectCost" placeholder="请输入项目成本" @change="calcAmount"/>
        </el-form-item>
        <el-form-item label="项目数量" prop="projectQuantity">
          <el-input v-model="form.projectQuantity" placeholder="请输入项目数量" @change="calcAmount"/>
        </el-form-item>
        <el-form-item label="项目单位" prop="projectUnit">
          <el-input v-model="form.projectUnit" placeholder="请输入项目单位"/>
        </el-form-item>
        <el-form-item label="金额" prop="planAmount">
          <el-input v-model="form.planAmount" placeholder="自动计算" disabled/>
        </el-form-item>
        <el-form-item label="现金" prop="planCash">
          <el-input v-model="form.planCash" placeholder="请输入现金"/>
        </el-form-item>
        <el-form-item label="刷卡" prop="planCard">
          <el-input v-model="form.planCard" placeholder="请输入刷卡"/>
        </el-form-item>
        <el-form-item label="转账" prop="planTransfer">
          <el-input v-model="form.planTransfer" placeholder="请输入转账"/>
        </el-form-item>
        <el-form-item label="冲抵" prop="planOffset">
          <el-input v-model="form.planOffset" placeholder="请输入冲抵"/>
        </el-form-item>
        <el-form-item label="挂账" prop="planCredit">
          <el-input v-model="form.planCredit" placeholder="请输入挂账"/>
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
  </div>
</template>

<script setup name="PlanDetailModal">
import {
  listPlanDetail,
  getPlanDetail,
  delPlanDetail,
  addPlanDetail,
  updatePlanDetail,
  ListProject
} from "@/api/travel/planDetail";
import {defineProps, ref} from "vue";
import {listItinerary} from "@/api/travel/plan";

const props = defineProps({detailPlanID: Number})
const {proxy} = getCurrentInstance();
const {travel_project_type} = proxy.useDict('travel_project_type');

const projectList = ref([]);

const planDetailList = ref([]);
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
    operationPlanId: props.detailPlanID,
    travelScheduleId: null,
    planType: null,
    projectName: null,
    projectCost: null,
    projectQuantity: null,
    projectUnit: null,
    planAmount: null,
    planCash: null,
    planCard: null,
    planTransfer: null,
    planOffset: null,
    planCredit: null,
  },
  rules: {
    operationPlanId: [
      {required: true, message: "操作计划ID不能为空", trigger: "blur"}
    ],
    // travelScheduleId: [
    //   {required: true, message: "行程详情ID不能为空", trigger: "blur"}
    // ],
    planType: [
      {required: true, message: "类型不能为空", trigger: "change"}
    ],
    projectName: [
      {required: true, message: "项目名称不能为空", trigger: "blur"}
    ],
    projectCost: [
      {required: true, message: "项目成本不能为空", trigger: "blur"}
    ],
    projectQuantity: [
      {required: true, message: "项目数量不能为空", trigger: "blur"}
    ],
    projectUnit: [
      {required: true, message: "项目单位不能为空", trigger: "blur"}
    ],
    planAmount: [
      {required: true, message: "金额不能为空", trigger: "blur"}
    ],
    planCash: [
      {required: true, message: "现金不能为空", trigger: "blur"}
    ],
    planCard: [
      {required: true, message: "刷卡不能为空", trigger: "blur"}
    ],
    planTransfer: [
      {required: true, message: "转账不能为空", trigger: "blur"}
    ],
    planOffset: [
      {required: true, message: "冲抵不能为空", trigger: "blur"}
    ],
    planCredit: [
      {required: true, message: "挂账不能为空", trigger: "blur"}
    ],
    createTime: [
      {required: true, message: "创建时间不能为空", trigger: "blur"}
    ],
    createBy: [
      {required: true, message: "创建人不能为空", trigger: "blur"}
    ],
    updateTime: [
      {required: true, message: "更新时间不能为空", trigger: "blur"}
    ],
    updateBy: [
      {required: true, message: "更新人不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询项目表 */
function getListProject() {
  ListProject().then(response => {
    projectList.value = response.rows;
  });
}

/** 选择项目填入信息 */
function projectChange(value) {
  projectList.value.forEach((item)=>{
    if(item.id == value){
      data.form.projectName = item.projectName;
      data.form.planType = item.projectType;
      data.form.projectCost = item.projectCost;
      data.form.projectUnit = item.projectUnit;
    }
  })
}

/** 自动计算金额 */
function calcAmount() {
  if(data.form.projectCost != ''&& data.form.projectQuantity != ''){
    data.form.planAmount = data.form.projectCost * data.form.projectQuantity;
  }
}

/** 查询计划项目明细列表 */
function getList() {
  loading.value = true;
  listPlanDetail(queryParams.value).then(response => {
    planDetailList.value = response.rows;
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
    operationPlanId: props.detailPlanID,
    travelScheduleId: null,
    projectId: null,
    planType: null,
    projectName: null,
    projectCost: null,
    projectQuantity: null,
    projectUnit: null,
    planAmount: null,
    planCash: null,
    planCard: null,
    planTransfer: null,
    planOffset: null,
    planCredit: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("planDetailRef");
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
  title.value = "添加计划项目明细";
  getListProject();
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPlanDetail(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改计划项目明细";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["planDetailRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePlanDetail(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPlanDetail(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除计划项目明细编号为"' + _ids + '"的数据项？').then(function () {
    return delPlanDetail(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('travel/planDetail/export', {
    ...queryParams.value
  }, `planDetail_${new Date().getTime()}.xlsx`)
}

getList();
</script>
