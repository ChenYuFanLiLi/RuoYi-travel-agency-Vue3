import request from '@/utils/request'

// 查询收客列表
export function listCustomers(query) {
  return request({
    url: '/travel/customers/list',
    method: 'get',
    params: query
  })
}

// 查询收客详细
export function getCustomers(id) {
  return request({
    url: '/travel/customers/' + id,
    method: 'get'
  })
}

// 新增收客
export function addCustomers(data) {
  return request({
    url: '/travel/customers',
    method: 'post',
    data: data
  })
}

// 修改收客
export function updateCustomers(data) {
  return request({
    url: '/travel/customers',
    method: 'put',
    data: data
  })
}

// 删除收客
export function delCustomers(id) {
  return request({
    url: '/travel/customers/' + id,
    method: 'delete'
  })
}
