import request from '@/utils/request'

// 查询组团社信息列表
export function listInfo(query) {
  return request({
    url: '/travel/info/list',
    method: 'get',
    params: query
  })
}

// 查询组团社信息详细
export function getInfo(groupId) {
  return request({
    url: '/travel/info/' + groupId,
    method: 'get'
  })
}

// 新增组团社信息
export function addInfo(data) {
  return request({
    url: '/travel/info',
    method: 'post',
    data: data
  })
}

// 修改组团社信息
export function updateInfo(data) {
  return request({
    url: '/travel/info',
    method: 'put',
    data: data
  })
}

// 删除组团社信息
export function delInfo(groupId) {
  return request({
    url: '/travel/info/' + groupId,
    method: 'delete'
  })
}
