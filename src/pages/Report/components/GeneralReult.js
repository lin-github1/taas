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
  Util
} from "bizcharts";
import {DataView} from "@antv/data-set";

const GeneralResult = (props)=>{
  const executeResult = [
    {"x": "Pass", "y": 109}, {"x": "Failed", "y": 1},
    {"x": "Investigated", "y": 0}, {"x": "Unavailable", "y": 8},
    {"x": "Error", "y": 0}, {"x": "Block", "y": 6}, {"x": "Unknown", "y": 0}
  ];
  const dv = new DataView();
  dv.source(executeResult).transform({
    type: 'percent',
    field: 'y',
    dimension: 'x',
    as: 'percent',
  });
  const getG2Instance = (chart) => {
    this.chart = chart;
    requestAnimationFrame(() => {
      this.getLegendData();
      this.resize();
    });
  };

  return(
    <Chart
      height={180}
      data={dv}
      // scale={cols}
      padding={[12, 0, 12, 0]}
      // onGetG2Instance={getG2Instance}
    >
      <Coord type="theta" innerRadius={0.75} />
      <Geom
        style={{ lineWidth: 1, stroke: '#fff' }}
        // tooltip={tooltip ? tooltipFormat : undefined}
        type="intervalStack"
        position="percent"
        color={['x', (value) => {
          if (value === '占比') {
            return 'rgba(24, 144, 255, 0.85)' || 'rgba(24, 144, 255, 0.85)';
          }
          return '#F0F2F5';
        }]}
        // selected={true}
      />
    </Chart>
  )
};

export default GeneralResult
