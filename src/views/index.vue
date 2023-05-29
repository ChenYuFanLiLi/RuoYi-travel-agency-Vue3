<template>
  <div class="app-container home">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div style="font-size: 2rem">客户数量</div>
          </template>
          <div style="height: 400px;width: auto" id="customerLineChart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div style="font-size: 2rem">行程数量</div>
          </template>
          <div style="height: 400px;width: auto" id="itineraryLineChart"></div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script setup name="Index">
import {onMounted} from "vue";

const version = ref('3.8.5')

import * as echarts from 'echarts';
import {getCustomerLineChart, getItineraryLineChart} from "@/api/system";

onMounted(()=>{
  initCustomerLineChart();
  initItineraryLineChart();
})

function initCustomerLineChart(){
  var customerLineChart = echarts.init(document.getElementById("customerLineChart"));
  getCustomerLineChart().then((res)=>{
    let option = {
      xAxis: {
        type: 'category',
        data: res.data.month
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: res.data.num,
          type: 'line',
          itemStyle:{normal:{label:{show:true}}},
          markPoint:{
            data:[
              {
                type:'max',
                name:"最大接待人数"
              }
            ]
          },
          markLine:{
            data:[
              {
                type:'average',
                name:'平均值'
              }
            ]
          }
        }
      ]
    };
    customerLineChart.setOption(option);
  })
}
function initItineraryLineChart(){
  var itineraryLineChart = echarts.init(document.getElementById("itineraryLineChart"));
  getItineraryLineChart().then((res)=>{
    let option = {
      xAxis: {
        type: 'category',
        boundaryGap:false,
        data: res.data.month
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: res.data.num,
          type: 'line',
          areaStyle:{},
          smooth: true,
          itemStyle:{normal:{label:{show:true}}},
          markPoint:{
            data:[
              {
                type:'max',
                name:"最大行程数"
              }
            ]
          },
          markLine:{
            data:[
              {
                type:'average',
                name:'平均值'
              }
            ]
          }
        }
      ]
    };
    itineraryLineChart.setOption(option);
  })
}


function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

