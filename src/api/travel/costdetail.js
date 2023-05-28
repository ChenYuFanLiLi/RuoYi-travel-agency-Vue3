import request from '@/utils/request'

// 查询成本核算明细列表
export function listCostdetail(query) {
  return request({
    url: '/travel/costdetail/list',
    method: 'get',
    params: query
  })
}

// 查询成本核算明细详细
export function getCostdetail(id) {
  return request({
    url: '/travel/costdetail/' + id,
    method: 'get'
  })
}

// 新增成本核算明细
export function addCostdetail(data) {
  return request({
    url: '/travel/costdetail',
    method: 'post',
    data: data
  })
}

// 修改成本核算明细
export function updateCostdetail(data) {
  return request({
    url: '/travel/costdetail',
    method: 'put',
    data: data
  })
}

// 删除成本核算明细
export function delCostdetail(id) {
  return request({
    url: '/travel/costdetail/' + id,
    method: 'delete'
  })
}
