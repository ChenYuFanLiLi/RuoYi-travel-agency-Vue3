import request from "@/utils/request";
import {parseStrEmpty} from "@/utils/ruoyi";

export function getCustomerLineChart(){
    return request({
        url:'/index/getCustomerLineChart',
        method:'get',
    })
}
export function getItineraryLineChart(){
    return request({
        url:'/index/getItineraryLineChart',
        method:'get',
    })
}