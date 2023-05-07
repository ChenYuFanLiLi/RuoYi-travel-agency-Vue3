<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="组团社名称" prop="groupName">
        <el-input
            v-model="queryParams.groupName"
            placeholder="请输入组团社名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组团社负责人姓名" prop="groupLeaderName">
        <el-input
            v-model="queryParams.groupLeaderName"
            placeholder="请输入组团社负责人姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组团社负责人电话" prop="groupLeaderPhone">
        <el-input
            v-model="queryParams.groupLeaderPhone"
            placeholder="请输入组团社负责人电话"
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
            v-hasPermi="['travel:booking:add']"
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
            v-hasPermi="['travel:booking:edit']"
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
            v-hasPermi="['travel:booking:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:booking:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bookingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="收客记录ID" align="center" prop="id"/>
      <el-table-column label="收客信息ID" align="center" prop="bookingInfoId"/>
      <el-table-column label="行程ID" align="center" prop="itineraryId"/>
      <el-table-column label="组团社ID" align="center" prop="groupId"/>
      <el-table-column label="留位人ID" align="center" prop="bookerId"/>
      <el-table-column label="预定数量" align="center" prop="bookingCount"/>
      <el-table-column label="组团社名称" align="center" prop="groupName"/>
      <el-table-column label="组团社负责人姓名" align="center" prop="groupLeaderName"/>
      <el-table-column label="组团社负责人电话" align="center" prop="groupLeaderPhone"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['travel:booking:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['travel:booking:remove']">删除
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

    <!-- 添加或修改收客记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bookingRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="收客信息ID" prop="bookingInfoId">
          <el-input v-model="form.bookingInfoId" placeholder="请输入收客信息ID"/>
        </el-form-item>
        <el-form-item label="行程ID" prop="itineraryId">
          <el-input v-model="form.itineraryId" placeholder="请输入行程ID"/>
        </el-form-item>
        <el-form-item label="组团社ID" prop="groupId">
          <el-input v-model="form.groupId" placeholder="请输入组团社ID"/>
        </el-form-item>
        <el-form-item label="留位人ID" prop="bookerId">
          <el-input v-model="form.bookerId" placeholder="请输入留位人ID"/>
        </el-form-item>
        <el-form-item label="预定数量" prop="bookingCount">
          <el-input v-model="form.bookingCount" placeholder="请输入预定数量"/>
        </el-form-item>
        <el-form-item label="组团社名称" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入组团社名称"/>
        </el-form-item>
        <el-form-item label="组团社负责人姓名" prop="groupLeaderName">
          <el-input v-model="form.groupLeaderName" placeholder="请输入组团社负责人姓名"/>
        </el-form-item>
        <el-form-item label="组团社负责人电话" prop="groupLeaderPhone">
          <el-input v-model="form.groupLeaderPhone" placeholder="请输入组团社负责人电话"/>
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

<script setup name="Booking">
import {listBooking, getBooking, delBooking, addBooking, updateBooking} from "@/api/travel/booking";

const {proxy} = getCurrentInstance();

const bookingList = ref([]);
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
    bookingInfoId: null,
    itineraryId: null,
    groupId: null,
    bookerId: null,
    bookingCount: null,
    groupName: null,
    groupLeaderName: null,
    groupLeaderPhone: null,
  },
  rules: {
    itineraryId: [
      {required: true, message: "行程ID不能为空", trigger: "blur"}
    ],
    groupId: [
      {required: true, message: "组团社ID不能为空", trigger: "blur"}
    ],
    bookingCount: [
      {required: true, message: "预定数量不能为空", trigger: "blur"}
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

/** 查询收客记录列表 */
function getList() {
  loading.value = true;
  listBooking(queryParams.value).then(response => {
    bookingList.value = response.rows;
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
    bookingInfoId: null,
    itineraryId: null,
    groupId: null,
    bookerId: null,
    bookingCount: null,
    groupName: null,
    groupLeaderName: null,
    groupLeaderPhone: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("bookingRef");
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
  title.value = "添加收客记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getBooking(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改收客记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["bookingRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBooking(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBooking(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除收客记录编号为"' + _ids + '"的数据项？').then(function () {
    return delBooking(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('travel/booking/export', {
    ...queryParams.value
  }, `booking_${new Date().getTime()}.xlsx`)
}

getList();
</script>
