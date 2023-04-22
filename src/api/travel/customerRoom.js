import request from '@/utils/request'

// 查询客户-房间列表
export function listCustomerRoom(query) {
  return request({
    url: '/travel/customerRoom/list',
    method: 'get',
    params: query
  })
}

// 查询客户-房间详细
export function getCustomerRoom(id) {
  return request({
    url: '/travel/customerRoom/' + id,
    method: 'get'
  })
}

// 新增客户-房间
export function addCustomerRoom(data) {
  return request({
    url: '/travel/customerRoom',
    method: 'post',
    data: data
  })
}

// 修改客户-房间
export function updateCustomerRoom(data) {
  return request({
    url: '/travel/customerRoom',
    method: 'put',
    data: data
  })
}

// 删除客户-房间
export function delCustomerRoom(id) {
  return request({
    url: '/travel/customerRoom/' + id,
    method: 'delete'
  })
}
