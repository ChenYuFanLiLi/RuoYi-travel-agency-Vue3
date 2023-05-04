import request from '@/utils/request'

// 查询组团社信息列表
export function listGroup(query) {
  return request({
    url: '/travel/group/list',
    method: 'get',
    params: query
  })
}

// 查询组团社信息详细
export function getGroup(id) {
  return request({
    url: '/travel/group/' + id,
    method: 'get'
  })
}

// 新增组团社信息
export function addGroup(data) {
  return request({
    url: '/travel/group',
    method: 'post',
    data: data
  })
}

// 修改组团社信息
export function updateGroup(data) {
  return request({
    url: '/travel/group',
    method: 'put',
    data: data
  })
}

// 删除组团社信息
export function delGroup(id) {
  return request({
    url: '/travel/group/' + id,
    method: 'delete'
  })
}
