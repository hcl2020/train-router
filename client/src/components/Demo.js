import React from 'react';
import echarts from 'echarts';
import './Demo.css';

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  componentDidMount() {
    console.log('componentDidMount', this);
    this.timerID = setInterval(() => this.tick(), 1000);
    this.initChart();
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
    var myChart = echarts.init(this.refs.chart);
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

  render() {
    return (
      <div className="Demo">
        <h1>Hello, {this.props.name}</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <div ref="chart" style={{ height: '300px' }}></div>
      </div>
    );
  }
}
