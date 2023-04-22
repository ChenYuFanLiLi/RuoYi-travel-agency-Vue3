import request from '@/utils/request'

// 查询组团社信息列表
export function listGroupInfo(query) {
  return request({
    url: '/travel/groupInfo/list',
    method: 'get',
    params: query
  })
}

// 查询组团社信息详细
export function getGroupInfo(groupId) {
  return request({
    url: '/travel/groupInfo/' + groupId,
    method: 'get'
  })
}

// 新增组团社信息
export function addGroupInfo(data) {
  return request({
    url: '/travel/groupInfo',
    method: 'post',
    data: data
  })
}

// 修改组团社信息
export function updateGroupInfo(data) {
  return request({
    url: '/travel/groupInfo',
    method: 'put',
    data: data
  })
}

// 删除组团社信息
export function delGroupInfo(groupId) {
  return request({
    url: '/travel/groupInfo/' + groupId,
    method: 'delete'
  })
}
