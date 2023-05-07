import request from '@/utils/request'

// 查询行程列表
export function listItinerary(query) {
  return request({
    url: '/travel/itinerary/list',
    method: 'get',
    params: query
  })
}

// 查询行程详细
export function getItinerary(id) {
  return request({
    url: '/travel/itinerary/' + id,
    method: 'get'
  })
}

// 新增行程
export function addItinerary(data) {
  return request({
    url: '/travel/itinerary',
    method: 'post',
    data: data
  })
}

// 修改行程
export function updateItinerary(data) {
  return request({
    url: '/travel/itinerary',
    method: 'put',
    data: data
  })
}

// 删除行程
export function delItinerary(id) {
  return request({
    url: '/travel/itinerary/' + id,
    method: 'delete'
  })
}
