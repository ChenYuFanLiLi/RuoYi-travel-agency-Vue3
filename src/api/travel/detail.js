import request from '@/utils/request'

// 查询成本核算明细列表
export function listDetail(query) {
  return request({
    url: '/travel/detail/list',
    method: 'get',
    params: query
  })
}

// 查询成本核算明细详细
export function getDetail(id) {
  return request({
    url: '/travel/detail/' + id,
    method: 'get'
  })
}

// 新增成本核算明细
export function addDetail(data) {
  return request({
    url: '/travel/detail',
    method: 'post',
    data: data
  })
}

// 修改成本核算明细
export function updateDetail(data) {
  return request({
    url: '/travel/detail',
    method: 'put',
    data: data
  })
}

// 删除成本核算明细
export function delDetail(id) {
  return request({
    url: '/travel/detail/' + id,
    method: 'delete'
  })
}
