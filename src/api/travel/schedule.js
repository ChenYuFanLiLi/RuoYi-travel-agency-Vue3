import request from '@/utils/request'

// 查询线路信息管理列表
export function listSchedule(query) {
  return request({
    url: '/travel/schedule/list',
    method: 'get',
    params: query
  })
}

// 查询线路信息管理详细
export function getSchedule(id) {
  return request({
    url: '/travel/schedule/' + id,
    method: 'get'
  })
}

// 新增线路信息管理
export function addSchedule(data) {
  return request({
    url: '/travel/schedule',
    method: 'post',
    data: data
  })
}

// 修改线路信息管理
export function updateSchedule(data) {
  return request({
    url: '/travel/schedule',
    method: 'put',
    data: data
  })
}

// 删除线路信息管理
export function delSchedule(id) {
  return request({
    url: '/travel/schedule/' + id,
    method: 'delete'
  })
}
