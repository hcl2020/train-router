import React from 'react';
import echarts from 'echarts';
import 'echarts/extension/bmap/bmap';

import './Demo.css';
import { city, geoCoordMap } from './data';
import mapStyle from '../config/mapStyle';

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  componentDidMount() {
    console.log('componentDidMount', this);
    this.timerID = setInterval(() => this.tick(), 1000);
    // this.initChart();
    this.initChartMap();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  initChart() {
    let myChart = echarts.init(this.refs.chart);
    // 绘制图表
    myChart.setOption({
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    });
  }

  initChartMap() {
    let data = city;

    let convertData = function(data) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        let geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
    };

    function renderItem(params, api) {
      let coords = [
        [116.7, 39.53],
        [103.73, 36.03],
        [112.91, 27.87],
        [120.65, 28.01],
        [119.57, 39.95]
      ];
      let points = [];
      for (let i = 0; i < coords.length; i++) {
        points.push(api.coord(coords[i]));
      }
      let color = api.visual('color');

      return {
        type: 'polygon',
        shape: {
          points: echarts.graphic.clipPointsByRect(points, {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          })
        },
        style: api.style({
          fill: color,
          stroke: echarts.color.lift(color)
        })
      };
    }
    let option = {
      backgroundColor: 'transparent',
      title: {
        text: '全国主要城市空气质量',
        subtext: 'data from PM25.in',
        sublink: 'http://www.pm25.in',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      bmap: {
        center: [104.114129, 37.550339],
        zoom: 5,
        roam: true,
        mapStyle
      },
      series: [
        {
          name: 'pm2.5',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: convertData(data),
          symbolSize: function(val) {
            return val[2] / 10;
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#ddb926'
            }
          }
        },
        {
          name: 'Top 5',
          type: 'effectScatter',
          coordinateSystem: 'bmap',
          data: convertData(
            data
              .sort(function(a, b) {
                return b.value - a.value;
              })
              .slice(0, 6)
          ),
          symbolSize: function(val) {
            return val[2] / 10;
          },
          showEffectOn: 'emphasis',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#f4e925',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          zlevel: 1
        },
        {
          type: 'custom',
          coordinateSystem: 'bmap',
          renderItem: renderItem,
          itemStyle: {
            normal: {
              opacity: 0.5
            }
          },
          animation: false,
          silent: true,
          data: [0],
          z: -10
        }
      ]
    };
    let myChart = echarts.init(this.refs.chart);

    myChart.setOption(option);
  }

  render() {
    return (
      <div className="Demo">
        <h1>
          Hello, {this.props.name}, It is {this.state.date.toLocaleTimeString()}
        </h1>
        <div ref="chart" style={{ height: '600px' }}></div>
      </div>
    );
  }
}
