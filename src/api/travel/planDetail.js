import request from '@/utils/request'

// 查询项目列表
export function ListProject() {
  return request({
    url: '/travel/project/list',
    method: 'get',
  })
}

// 查询计划项目明细列表
export function listPlanDetail(query) {
  return request({
    url: '/travel/planDetail/list',
    method: 'get',
    params: query
  })
}

// 查询计划项目明细详细
export function getPlanDetail(id) {
  return request({
    url: '/travel/planDetail/' + id,
    method: 'get'
  })
}

// 新增计划项目明细
export function addPlanDetail(data) {
  return request({
    url: '/travel/planDetail',
    method: 'post',
    data: data
  })
}

// 修改计划项目明细
export function updatePlanDetail(data) {
  return request({
    url: '/travel/planDetail',
    method: 'put',
    data: data
  })
}

// 删除计划项目明细
export function delPlanDetail(id) {
  return request({
    url: '/travel/planDetail/' + id,
    method: 'delete'
  })
}
