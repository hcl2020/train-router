import React from 'react';
import mapStyle from '../config/mapStyle';
let { BMap } = window;

const ZOOM = 6;
export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.geocoder = new BMap.Geocoder();
  }

  render() {
    return (
      <div>
        <div ref="container" style={{ height: '600px' }}></div>
      </div>
    );
  }

  componentDidMount() {
    console.log('componentDidMount', this);
    this.initMap();
    this.init();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  initMap() {
    let map = new BMap.Map(this.refs.container);
    let point = new BMap.Point(116.404, 39.915);

    map.centerAndZoom(point, ZOOM);
    map.setMapStyleV2(mapStyle);
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());

    this.map = map;
  }

  async init() {
    let pos = await this.getCityPoint('成都');
    this.goto(pos);

    let citys = [
      '成都',
      '贵阳',
      '桂林',
      '衡阳',
      '湘潭',
      '长沙',
      '岳阳',
      '武汉',
      '重庆',
      '成都'
    ];
    citys.map(city => this.addCityMarker(city));
    citys.reduce((a, b) => {
      this.addCityline(a, b);
      return b;
    });
  }

  getCityPoint(city, address = city) {
    return new Promise((resolve, reject) => {
      this.geocoder.getPoint(
        address,
        point => (point ? resolve(point) : reject()),
        city
      );
    });
  }

  async addCityMarker(city) {
    let point = await this.getCityPoint(city);
    this.addOverlay(new BMap.Marker(point));
  }

  async addCityline(city0, city1) {
    let points = await Promise.all(
      [city0, city1].map(city => this.getCityPoint(city))
    );
    let polyline = new BMap.Polyline(points, {
      strokeColor: '#c00',
      strokeWeight: 6,
      strokeOpacity: 0.75
    });
    this.addOverlay(polyline);
  }

  goto(point, zoom = ZOOM) {
    if (this.map) {
      this.map.centerAndZoom(point, zoom);
    }
  }

  addOverlay(overlay) {
    if (this.map) {
      this.map.addOverlay(overlay);
    }
  }
}
