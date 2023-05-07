<template>
  <!-- 添加或修改组团社信息对话框 -->
    <el-form ref="groupRef" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="组团社名称" prop="groupName">
            <el-input v-model="form.groupName" placeholder="请输入组团社名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人姓名" prop="groupLeaderName">
            <el-input v-model="form.groupLeaderName" placeholder="请输入组团社负责人姓名"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人电话" prop="groupLeaderPhone">
            <el-input v-model="form.groupLeaderPhone" placeholder="请输入组团社负责人电话"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司名称" prop="groupCompanyName">
            <el-input v-model="form.groupCompanyName" placeholder="请输入组团社公司名称"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
      <el-col :span="12">
        <el-form-item label="传真号码" prop="groupFax">
          <el-input v-model="form.groupFax" placeholder="请输入组团社传真号码"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电话号码" prop="groupPhone">
          <el-input v-model="form.groupPhone" placeholder="请输入组团社电话号码"/>
        </el-form-item>
      </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="groupMobile">
            <el-input v-model="form.groupMobile" placeholder="请输入组团社手机号码"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收件人" prop="groupRecipient">
            <el-input v-model="form.groupRecipient" placeholder="请输入组团社收件人"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注"/>
      </el-form-item>
    </el-form>

</template>

<script setup name="addGroup">
import {listGroup, getGroup, delGroup, addGroup, updateGroup} from "@/api/travel/group";
const {proxy} = getCurrentInstance();
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form:{},
  rules:{}
})
function reset() {
  form.value = {
    id: null,
    groupName: null,
    groupLeaderName: null,
    groupLeaderPhone: null,
    groupCompanyName: null,
    groupFax: null,
    groupPhone: null,
    groupMobile: null,
    groupRecipient: null,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null,
    remark: null
  };
  proxy.resetForm("groupRef");
}
const {form,rules} = toRefs(data)

async function submitForm() {
  const valid = await proxy.$refs["groupRef"].validate();
  if (valid) {
    const response = await addGroup(form.value);
    proxy.$modal.msgSuccess("添加成功");
    return response;
  }else {
    return false;
  }
}
defineExpose({
  submitForm,form,reset
})

</script>

<style scoped>

</style>