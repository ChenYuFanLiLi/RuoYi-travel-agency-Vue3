import request from '@/utils/request'

// 查询现金明细列表
export function listCashdetail(query) {
  return request({
    url: '/travel/cashdetail/list',
    method: 'get',
    params: query
  })
}

// 查询现金明细详细
export function getCashdetail(id) {
  return request({
    url: '/travel/cashdetail/' + id,
    method: 'get'
  })
}

// 新增现金明细
export function addCashdetail(data) {
  return request({
    url: '/travel/cashdetail',
    method: 'post',
    data: data
  })
}

// 修改现金明细
export function updateCashdetail(data) {
  return request({
    url: '/travel/cashdetail',
    method: 'put',
    data: data
  })
}

// 删除现金明细
export function delCashdetail(id) {
  return request({
    url: '/travel/cashdetail/' + id,
    method: 'delete'
  })
}
