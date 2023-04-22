import request from '@/utils/request'

// 查询客户-车辆列表
export function listCustomerVehicle(query) {
  return request({
    url: '/travel/customerVehicle/list',
    method: 'get',
    params: query
  })
}

// 查询客户-车辆详细
export function getCustomerVehicle(id) {
  return request({
    url: '/travel/customerVehicle/' + id,
    method: 'get'
  })
}

// 新增客户-车辆
export function addCustomerVehicle(data) {
  return request({
    url: '/travel/customerVehicle',
    method: 'post',
    data: data
  })
}

// 修改客户-车辆
export function updateCustomerVehicle(data) {
  return request({
    url: '/travel/customerVehicle',
    method: 'put',
    data: data
  })
}

// 删除客户-车辆
export function delCustomerVehicle(id) {
  return request({
    url: '/travel/customerVehicle/' + id,
    method: 'delete'
  })
}
