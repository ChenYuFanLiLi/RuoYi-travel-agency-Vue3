import request from '@/utils/request'

// 查询行程列表
export function listItinerary() {
  return request({
    url: '/travel/plan/listItinerary',
    method: 'get',
  })
}

// 查询操作计划列表
export function listPlan(query) {
  return request({
    url: '/travel/plan/list',
    method: 'get',
    params: query
  })
}

// 查询操作计划详细
export function getPlan(id) {
  return request({
    url: '/travel/plan/' + id,
    method: 'get'
  })
}

// 新增操作计划
export function addPlan(data) {
  return request({
    url: '/travel/plan',
    method: 'post',
    data: data
  })
}

// 修改操作计划
export function updatePlan(data) {
  return request({
    url: '/travel/plan',
    method: 'put',
    data: data
  })
}

// 删除操作计划
export function delPlan(id) {
  return request({
    url: '/travel/plan/' + id,
    method: 'delete'
  })
}
