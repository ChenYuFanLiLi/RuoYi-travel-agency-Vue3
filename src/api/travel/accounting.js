import request from '@/utils/request'

// 查询成本核算，用于记录团队成本核算信息列表
export function listAccounting(query) {
  return request({
    url: '/travel/accounting/list',
    method: 'get',
    params: query
  })
}

// 查询成本核算，用于记录团队成本核算信息详细
export function getAccounting(id) {
  return request({
    url: '/travel/accounting/' + id,
    method: 'get'
  })
}

// 新增成本核算，用于记录团队成本核算信息
export function addAccounting(data) {
  return request({
    url: '/travel/accounting',
    method: 'post',
    data: data
  })
}

// 修改成本核算，用于记录团队成本核算信息
export function updateAccounting(data) {
  return request({
    url: '/travel/accounting',
    method: 'put',
    data: data
  })
}

// 删除成本核算，用于记录团队成本核算信息
export function delAccounting(id) {
  return request({
    url: '/travel/accounting/' + id,
    method: 'delete'
  })
}
