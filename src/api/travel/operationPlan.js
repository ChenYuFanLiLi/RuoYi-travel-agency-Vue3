import request from '@/utils/request'

// 查询操作计划列表
export function listOperationPlan(query) {
  return request({
    url: '/travel/operationPlan/list',
    method: 'get',
    params: query
  })
}

// 查询操作计划详细
export function getOperationPlan(planId) {
  return request({
    url: '/travel/operationPlan/' + planId,
    method: 'get'
  })
}

// 新增操作计划
export function addOperationPlan(data) {
  return request({
    url: '/travel/operationPlan',
    method: 'post',
    data: data
  })
}

// 修改操作计划
export function updateOperationPlan(data) {
  return request({
    url: '/travel/operationPlan',
    method: 'put',
    data: data
  })
}

// 删除操作计划
export function delOperationPlan(planId) {
  return request({
    url: '/travel/operationPlan/' + planId,
    method: 'delete'
  })
}
