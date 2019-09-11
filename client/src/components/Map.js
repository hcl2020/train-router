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

    let citys1 = [
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
    let citys2 = [
      '成都',
      '重庆北',
      '涪陵',
      '彭水',
      '黔江',
      '秀山',
      '铜仁',
      '怀化',
      '湘潭',
      '株洲',
      '衡阳',
      '郴州',
      '韶关东',
      '广州'
    ];

    let citys3 = [
      '成都东',
      '重庆西',
      '贵阳',
      '怀化',
      '新化',
      '娄底',
      '湘潭',
      '株洲',
      '衡阳',
      '韶关东',
      '广州',
      '东莞',
      '深圳'
    ];

    let citys4 = [
      '成都东',
      '隆昌北',
      '永川东',
      '重庆西',
      '綦江东',
      '桐梓北',
      '息烽',
      '贵阳东',
      '都匀东',
      '桂林北',
      '桂林',
      '永福南',
      '鹿寨北',
      '柳州',
      '来宾北',
      '南宁东'
    ];

    citys1.map(city => this.addCityMarker(city));
    citys2.map(city => this.addCityMarker(city));
    citys3.map(city => this.addCityMarker(city));
    citys4.map(city => this.addCityMarker(city));
    this.addCityline(citys2, '#c00');
    this.addCityline(citys3, '#06c');
    this.addCityline(citys4, '#0f6');
  }

  getCityPoint(city, address = city + '火车站') {
    return new Promise((resolve, reject) => {
      let key = '__tran_router_cache_CityPoint_' + city + '__' + address;
      try {
        let data = JSON.parse(localStorage.getItem(key));
        if (data) {
          let [lng, lat] = data;
          return resolve(new BMap.Point(lng, lat));
        }
      } catch (error) {}

      this.geocoder.getPoint(
        address,
        point => {
          if (point) {
            resolve(point);
            // console.log({ point });
            let { lng, lat } = point;
            localStorage.setItem(key, JSON.stringify([lng, lat]));
          } else {
            reject();
          }
        },
        city
      );
    });
  }

  async addCityMarker(city) {
    let point = await this.getCityPoint(city);
    this.addOverlay(new BMap.Marker(point));
  }

  async addCityline(citys, color = '#06c') {
    let points = await Promise.all(citys.map(city => this.getCityPoint(city)));
    let polyline = new BMap.Polyline(points, {
      strokeColor: color,
      strokeWeight: 6,
      strokeOpacity: 0.5
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
