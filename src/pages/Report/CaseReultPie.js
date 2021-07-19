import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from "bizcharts";
import { DataView } from '@antv/data-set';
import Debounce from 'lodash.debounce';
import {Divider} from "antd";

class Pieslice extends React.Component {
  state = {
    legendData: [],
    legendBlock: false,
  };
  resize = Debounce(() => {
    const { hasLegend } = this.props;
    const { legendBlock } = this.state;
    if (!hasLegend || !this.root) {
      window.removeEventListener('resize', this.resize);
      return;
    }
    if (
      this.root &&
      this.root.parentNode &&
      this.root.parentNode.clientWidth <= 380
    ) {
      if (!legendBlock) {
        this.setState({
          legendBlock: true,
        });
      }
    } else if (legendBlock) {
      this.setState({
        legendBlock: false,
      });
    }
  }, 400);

  componentDidMount() {
    window.addEventListener(
      'resize',
      () => {
        this.requestRef = requestAnimationFrame(() => this.resize());
      },
      { passive: true },
    );
  }
  componentDidUpdate(preProps){
    const { data } = this.props;
    if (data !== preProps.data) {
      // because of charts data create when rendered
      // so there is a trick for get rendered time
      this.getLegendData();
    }
  }
  componentWillUnmount() {
    if (this.requestRef) {
      window.cancelAnimationFrame(this.requestRef);
    }
    window.removeEventListener('resize', this.resize);
    if (this.resize) {
      this.resize.cancel();
    }
  }
  getG2Instance = (chart) => {
    this.chart = chart;
    requestAnimationFrame(() => {
      this.getLegendData();
      this.resize();
    });
  };

  getLegendData = () => {
    if (!this.chart) return;
    const geom = this.chart.getAllGeoms()[0]; // 获取所有的图形
    if (!geom) return;
    const items = geom.get('dataArray') || []; // 获取图形对应的

    const legendData = items.map((item) => {
      /* eslint no-underscore-dangle:0 */
      const origin = item[0]._origin;
      origin.color = item[0].color;
      origin.checked = true;
      return origin;
    });

    this.setState({
      legendData,
    });
  };

  render() {
    const {
      valueFormat, subTitle, total, hasLegend = false, className,
      style, height = 0, forceFit = true, percent, color, inner = 0.75,
      animate = true, colors, lineWidth = 1,
    } = this.props;
    const salesPieData = {
      data: [
        {"x": "Fail", "y": 0},
        {"x": "Pass", "y": 1},
        {"x": "Block", "y": 0},
        {"x": "Error", "y": 4},
        {"x": "Investigated", "y": 0},
        {"x": "Unknown", "y": 0}
      ],
      total: 4
    };
    let statusData = {};
    salesPieData.data.map(item=>{statusData[item.x]=item.y});
    // const statusData = ()=>{
    //   let tmpData = {}
    //   salesPieData.data.map(item=>{tmpData[item.x]=item.y})
    //   return
    // }
    const dv = new DataView();
    dv.source(salesPieData.data).transform({
      type: 'percent',
      field: 'y',
      dimension: 'x',
      as: 'percent',
    });
    const scale = {
      x: {
        type: 'cat',
        range: [0, 1],
      },
      y: {
        min: 0,
      },
    };
    const {
      data: propsData,
      selected: propsSelected = true,
      tooltip: propsTooltip = true,
    } = this.props;
    let data = propsData || [];
    let selected = propsSelected;
    let tooltip = propsTooltip;

    const defaultColors = colors;
    data = data || [];
    selected = selected || true;
    tooltip = tooltip || true;
    let formatColor;
    if (percent || percent === 0) {
      selected = false;
      tooltip = false;
      formatColor = (value) => {
        if (value === '占比') {
          return color || 'rgba(24, 144, 255, 0.85)';
        }
        return '#F0F2F5';
      };

      data = [
        {
          x: '占比',
          y: parseFloat(`${percent}`),
        },
        {
          x: '反比',
          y: 100 - parseFloat(`${percent}`),
        },
      ];
    }

    const tooltipFormat= [
      'x*y*percent',
      (x, y, p) => ({
        name: x,
        value: `${(p * 100).toFixed(2)}%`,
      }),
    ];
    return (
      <Chart
        scale={scale}
        data={dv}
        forceFit
        height={150}
        padding={[12, 0, 12, 0]}
      >
        <Coord type="theta" innerRadius={0.75}/>
        <Legend position={"bottom"} itemFormatter={(val => {return val + "  (" +  statusData[val] + ")"})}/>
        <Tooltip showTitle={false} />
        <Guide>
          <Guide.Text
            position={["50%", "50%"]}
            content={salesPieData.data.reduce((pre, now) => now.y + pre, 0)}
            style={{
              lineHeight: "12px",
              fontSize: "8",
              fill: "#262626",
              textAlign: "center"
            }}
          />
        </Guide>
        <Geom
          tooltip={tooltipFormat}
          type="intervalStack"
          position="percent"
          color={['x', percent || percent === 0 ? formatColor : defaultColors]}
          selected={selected}
        >
          {/*<Label content="name" />*/}
        </Geom>
      </Chart>
    );
  }
}

export default Pieslice
