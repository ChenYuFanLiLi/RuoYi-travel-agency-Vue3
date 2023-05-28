import request from '@/utils/request'

export function listItinerary() {
  return request({
    url: '/travel/accounting/listItinerary',
    method: 'get',
  })
}

// 查询成本核算列表
export function listAccounting(query) {
  return request({
    url: '/travel/accounting/list',
    method: 'get',
    params: query
  })
}

// 查询成本核算详细
export function getAccounting(id) {
  return request({
    url: '/travel/accounting/' + id,
    method: 'get'
  })
}

// 新增成本核算
export function addAccounting(data) {
  return request({
    url: '/travel/accounting',
    method: 'post',
    data: data
  })
}

// 修改成本核算
export function updateAccounting(data) {
  return request({
    url: '/travel/accounting',
    method: 'put',
    data: data
  })
}

// 删除成本核算
export function delAccounting(id) {
  return request({
    url: '/travel/accounting/' + id,
    method: 'delete'
  })
}
