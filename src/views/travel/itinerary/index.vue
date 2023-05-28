<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="行程名称" prop="itineraryName">
        <el-input
            v-model="queryParams.itineraryName"
            placeholder="请输入行程名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行程简称" prop="itineraryShortName">
        <el-input
            v-model="queryParams.itineraryShortName"
            placeholder="请输入行程简称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发团日期" prop="departureDate">
        <el-date-picker clearable
                        v-model="queryParams.departureDate"
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="请选择发团日期">
        </el-date-picker>
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
            v-hasPermi="['travel:itinerary:add']"
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
            v-hasPermi="['travel:itinerary:edit']"
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
            v-hasPermi="['travel:itinerary:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['travel:itinerary:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="itineraryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="发团日期" align="center" prop="departureDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.departureDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行程名称" align="center" prop="itineraryName"/>
      <el-table-column label="计划数量" align="center" prop="planQuantity"/>
      <el-table-column label="占位预留" align="center" prop="itineraryObligate"/>
      <el-table-column label="确认或已有名单" align="center" prop="itineraryConfirm"/>
      <el-table-column label="余位" align="center" prop="itineraryRemaining"/>
      <el-table-column label="超收" align="center" prop="itineraryOverCollection"/>
      <el-table-column label="收客社简述" align="center" prop="clientBrief"/>
      <el-table-column label="行程文档" align="center" prop="itineraryDocument">
        <template #default="scope">
          <el-button v-if="scope.row.itineraryDocument!=null&&scope.row.itineraryDocument!=''" @click="downloadDocument(scope.row.itineraryDocument,scope.row.itineraryName+'行程文档')">点击下载</el-button>
          <div v-else>未上传文档</div>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="350">
        <template #default="scope">
          <div class="table-button">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                       v-hasPermi="['travel:itinerary:edit']">修改
            </el-button>
            <el-button link type="primary" icon="Edit" @click="bookingViewShow(scope.row)"
                      v-hasPermi="['travel:booking:edit']">收客记录
            </el-button>
            <el-button link type="primary" icon="User" @click="customerViewShow(scope.row)"
                      v-hasPermi="['travel:customer:view']">客户信息
            </el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                       v-hasPermi="['travel:itinerary:remove']">删除
            </el-button>
          </div>
        </template>
      </el-table-column>
      <!--      <el-table-column label="行程ID" align="center" prop="id"/>-->
      <!--      <el-table-column label="行程简称" align="center" prop="itineraryShortName"/>-->

      <!--      <el-table-column label="行程安排" align="center" prop="itinerarySchedule"/>-->
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
<!--    修改行程记录-->
    <el-dialog :title="bookingTitle" v-model="bookingView" width="90rem"  destroy-on-close>
      <booking-modal :itineraryId="bookingItineraryId">
      </booking-modal>
    </el-dialog>

<!--    客户信息-->
    <el-dialog :title="customerTitle" v-model="customerView" width="90rem" destroy-on-close>
      <customer-by-itinerary :itineraryId="customerItineraryId">
      </customer-by-itinerary>
    </el-dialog>

    <!-- 添加或修改行程对话框 -->
    <el-dialog :title="title" v-model="open" width="60rem" append-to-body>
      <el-form ref="itineraryRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="行程名称" prop="itineraryName">
              <el-input v-model="form.itineraryName" placeholder="请输入行程名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行程简称" prop="itineraryShortName">
              <el-input v-model="form.itineraryShortName" placeholder="请输入行程简称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="线路名称" prop="scheduleName">
              <el-input v-model="form.scheduleName" placeholder="请输入线路名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线路天数" prop="scheduleDays">
              <el-input v-model="form.scheduleDays" placeholder="请输入线路天数"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="线路说明" prop="scheduleDescription">
              <el-input v-model="form.scheduleDescription" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行程安排" prop="itinerarySchedule">
              <el-input v-model="form.itinerarySchedule" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划数量" prop="planQuantity">
              <el-input v-model="form.planQuantity" placeholder="请输入计划数量"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发团日期" prop="departureDate">
              <el-date-picker clearable
                              v-model="form.departureDate"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择发团日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收客社简述" prop="clientBrief">
              <el-input v-model="form.clientBrief" placeholder="请输入收客社简述"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行程文档" prop="itineraryDocument">
              <file-upload limit="1" file-size="500" v-model="form.itineraryDocument"/>
            </el-form-item>
          </el-col>
        </el-row>
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

<script setup name="Itinerary">
import {listItinerary, getItinerary, delItinerary, addItinerary, updateItinerary,downloadDocument} from "@/api/travel/itinerary";
import {listBooking, getBooking, delBooking, addBooking, updateBooking} from "@/api/travel/booking";
import BookingModal from '../booking/bookingModal.vue'
import {ref} from "vue";
import FileUpload from "@/components/FileUpload/index.vue";
import {download} from "@/utils/request";
import CustomerByItinerary from "@/views/travel/customer/customerByItinerary.vue";

const {proxy} = getCurrentInstance();

const itineraryList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");


// const bookingRef = ref(null);
const bookingView = ref(false);
const bookingTitle = ref("");
const bookingItineraryId = ref(null);

const customerTitle = ref("")
const customerView = ref(false)
const customerItineraryId = ref(0);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    itineraryName: null,
    itineraryShortName: null,
    scheduleName: null,
    scheduleDays: null,
    scheduleDescription: null,
    itinerarySchedule: null,
    planQuantity: null,
    departureDate: null,
    clientBrief: null,
    itineraryDocument: null,
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



/** 查询行程列表 */
function getList() {
  loading.value = true;
  listItinerary(queryParams.value).then(response => {
    itineraryList.value = response.rows;
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
    itineraryName: null,
    itineraryShortName: null,
    scheduleName: null,
    scheduleDays: null,
    scheduleDescription: null,
    itinerarySchedule: null,
    planQuantity: null,
    departureDate: null,
    clientBrief: null,
    itineraryDocument: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("itineraryRef");
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
  title.value = "添加行程";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getItinerary(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改行程";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["itineraryRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateItinerary(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addItinerary(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除行程编号为"' + _ids + '"的数据项？').then(function () {
    return delItinerary(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/**
 * 收客记录
 * @param row 行程
 * @constructor
 */
function bookingViewShow(row){
  bookingTitle.value=row.itineraryName;
  bookingView.value=true;
  bookingItineraryId.value=row.id;
}

/**
 * 显示客户记录
 * @param row
 */
function customerViewShow(row) {
  customerTitle.value = row.itineraryName;
  customerView.value=true
  customerItineraryId.value = row.id;
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('travel/itinerary/export', {
    ...queryParams.value
  }, `itinerary_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style type="scss">
el-table-column{
  white-space: nowrap;
}
.table-button{
  display: flex;
}
</style>
