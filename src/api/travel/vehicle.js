import request from '@/utils/request'

// 查询客户-车辆列表
export function listVehicle(query) {
  return request({
    url: '/travel/vehicle/list',
    method: 'get',
    params: query
  })
}

// 查询客户-车辆详细
export function getVehicle(id) {
  return request({
    url: '/travel/vehicle/' + id,
    method: 'get'
  })
}

// 新增客户-车辆
export function addVehicle(data) {
  return request({
    url: '/travel/vehicle',
    method: 'post',
    data: data
  })
}

// 修改客户-车辆
export function updateVehicle(data) {
  return request({
    url: '/travel/vehicle',
    method: 'put',
    data: data
  })
}

// 删除客户-车辆
export function delVehicle(id) {
  return request({
    url: '/travel/vehicle/' + id,
    method: 'delete'
  })
}
