<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="线路名称" prop="scheduleName">
        <el-input
            v-model="queryParams.scheduleName"
            placeholder="请输入线路名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="线路天数" prop="scheduleDays">
        <el-input
            v-model="queryParams.scheduleDays"
            placeholder="请输入线路天数"
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
            v-hasPermi="['travel:schedule:add']"
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
            v-hasPermi="['travel:schedule:edit']"
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
            v-hasPermi="['travel:schedule:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:schedule:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="scheduleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--              <el-table-column label="线路ID" align="center" prop="id" />-->
      <el-table-column label="线路名称" align="center" prop="scheduleName"/>
      <el-table-column label="线路天数" align="center" prop="scheduleDays"/>
      <el-table-column label="线路说明" align="center" prop="scheduleDescription"/>
      <!--              <el-table-column label="行程安排" align="center" prop="itinerarySchedule" />-->
      <!--              <el-table-column label="行程顺序" align="center" prop="itineraryOrder" />-->
      <!--              <el-table-column label="住宿地" align="center" prop="accommodationPlace" />-->
      <!--              <el-table-column label="餐饮" align="center" prop="mealInfo" />-->
      <!--              <el-table-column label="单价" align="center" prop="price" />-->
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['travel:schedule:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['travel:schedule:remove']">删除
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

    <!-- 添加或修改线路信息管理对话框 -->
    <el-dialog :title="title" v-model="open" width="1440px" append-to-body>
      <el-form ref="scheduleRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="线路名称" prop="scheduleName">
          <el-input v-model="form.scheduleName" placeholder="请输入线路名称"/>
        </el-form-item>
        <el-form-item label="线路天数" prop="scheduleDays">
          <el-input v-model="form.scheduleDays" placeholder="请输入线路天数"/>
        </el-form-item>
        <el-form-item label="线路说明" prop="scheduleDescription">
          <el-input v-model="form.scheduleDescription" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
        <el-divider content-position="center">线路安排信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddScheduleRouting">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteScheduleRouting">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="scheduleRoutingList" :row-class-name="rowScheduleRoutingIndex"
                  @selection-change="handleScheduleRoutingSelectionChange" ref="scheduleRouting">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column v-if="false" label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="行程安排顺序" prop="routingOrder" width="120">
            <template #default="scope">
              <el-input v-model="scope.row.index" style="text-align: center" placeholder="请输入行程安排顺序"/>
            </template>
          </el-table-column>
          <el-table-column label="行程安排" prop="routingOrder" width="600">
            <template #default="scope">
              <el-input type="textarea" v-model="scope.row.routingContent" placeholder="请输入行程安排"/>
            </template>
          </el-table-column>
          <el-table-column label="住宿地" prop="routingPlace" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.routingPlace" placeholder="请输入住宿地"/>
            </template>
          </el-table-column>
          <el-table-column label="餐饮" prop="routingMeal" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.routingMeal" placeholder="请输入餐饮"/>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="300">
            <template #default="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注"/>
            </template>
          </el-table-column>
        </el-table>
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

<script setup name="Schedule">
import {listSchedule, getSchedule, delSchedule, addSchedule, updateSchedule} from "@/api/travel/schedule";

const {proxy} = getCurrentInstance();

const scheduleList = ref([]);
const scheduleRoutingList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedScheduleRouting = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    scheduleName: null,
    scheduleDays: null,
    scheduleDescription: null,
    itinerarySchedule: null,
    itineraryOrder: null,
    accommodationPlace: null,
    mealInfo: null,
    price: null,
  },
  rules: {
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

/** 查询线路信息管理列表 */
function getList() {
  loading.value = true;
  listSchedule(queryParams.value).then(response => {
    scheduleList.value = response.rows;
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
    scheduleName: null,
    scheduleDays: null,
    scheduleDescription: null,
    itinerarySchedule: null,
    itineraryOrder: null,
    accommodationPlace: null,
    mealInfo: null,
    price: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    remark: null
  };
  scheduleRoutingList.value = [];
  proxy.resetForm("scheduleRef");
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
  title.value = "添加线路信息管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getSchedule(_id).then(response => {
    form.value = response.data;
    scheduleRoutingList.value = response.data.scheduleRoutingList;
    open.value = true;
    title.value = "修改线路信息管理";
  });
}

/** 提交按钮 */
function submitForm() {
  scheduleRoutingList.value.forEach(item=>{
    item.routingOrder = item.index;
  })
  proxy.$refs["scheduleRef"].validate(valid => {
    if (valid) {
      form.value.scheduleRoutingList = scheduleRoutingList.value;
      if (form.value.id != null) {
        updateSchedule(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSchedule(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除线路信息管理编号为"' + _ids + '"的数据项？').then(function () {
    return delSchedule(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 线路安排序号 */
function rowScheduleRoutingIndex({row, rowIndex}) {
  row.index = rowIndex + 1;
}

/** 线路安排添加按钮操作 */
function handleAddScheduleRouting() {
  let obj = {};
  obj.routingContent = "";
  obj.routingOrder = "";
  obj.routingPlace = "";
  obj.routingMeal = "";
  obj.remark = "";
  scheduleRoutingList.value.push(obj);
}

/** 线路安排删除按钮操作 */
function handleDeleteScheduleRouting() {
  if (checkedScheduleRouting.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的线路安排数据");
  } else {
    const scheduleRoutings = scheduleRoutingList.value;
    const checkedScheduleRoutings = checkedScheduleRouting.value;
    scheduleRoutingList.value = scheduleRoutings.filter(function (item) {
      return checkedScheduleRoutings.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleScheduleRoutingSelectionChange(selection) {
  checkedScheduleRouting.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('travel/schedule/export', {
    ...queryParams.value
  }, `schedule_${new Date().getTime()}.xlsx`)
}

getList();
</script>
