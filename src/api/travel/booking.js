import request from '@/utils/request'

// 查询收客记录列表
export function listBooking(query) {
  return request({
    url: '/travel/booking/list',
    method: 'get',
    params: query
  })
}

// 查询收客记录详细
export function getBooking(id) {
  return request({
    url: '/travel/booking/' + id,
    method: 'get'
  })
}

// 新增收客记录
export function addBooking(data) {
  return request({
    url: '/travel/booking',
    method: 'post',
    data: data
  })
}

// 修改收客记录
export function updateBooking(data) {
  return request({
    url: '/travel/booking',
    method: 'put',
    data: data
  })
}

// 删除收客记录
export function delBooking(id) {
  return request({
    url: '/travel/booking/' + id,
    method: 'delete'
  })
}
