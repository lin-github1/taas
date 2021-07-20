import React from 'react';
import classNames from 'classnames';
import {
  G2,
  Chart,
  Tooltip,
  Geom,
  Coord,
  Label,
  LabelProps,
  LegendProps, Legend, View
} from 'bizcharts';
import DataSet from '@antv/data-set';
import FitText from 'rc-fit-text';
import { Padding } from '../types';
import './double_ring_pie.less';

export interface DataItem {
  type: string;
  name: string;
  value: number;
}

interface LegendDataItem {
  type: string;
  name: string;
  value: number;
  checked: boolean;
  color: string;
  percent: number;
}

export interface PieProps {
  className?: string;
  style?: React.CSSProperties;
  //
  type?: 'polar' | 'theta';
  // 图表动画开关，默认为 true
  animate?: boolean;
  color?: string;
  colors?: string[];
  selected?: boolean;
  // 指定图表的高度，单位为 'px'
  height?: number;
  // 图表内边距
  padding?: Padding;
  data: DataItem[];
  total?: React.ReactNode | number | (() => React.ReactNode | number);
  // 是否开启自动计算总数
  autoTotal?: boolean;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  // 图例配置
  legend?: LegendProps;
  // 是否显示Label
  showLabel?: boolean;
  // 标注文本
  label?: LabelProps;
  // 详细图例显示开关
  hasLegend?: boolean;
  valueFormat?: (value: string) => string | React.ReactNode;
  titleMap?: {
    [key: string]: any;
  };
  // 是否显示tooltip
  tooltip?: boolean;
  // 设置半径，[0-1]的小数
  radius?: number;
  // 内部极坐标系的半径，[0-1]的小数
  innerRadius?: number;
  lineWidth?: number;
  // 百分比显示
  percent?: number;
  // 图表的宽度自适应开关
  forceFit?: boolean;
  // 获取 chart 实例的回调
  onGetG2Instance?: (chart: G2.Chart) => void;
  chartTitle?: React.ReactNode | number | (() => React.ReactNode | number);
}

const scale = {
  type: {
    type: 'cat',
    range: [0, 1],
  },
  name: {
    type: 'cat',
    range: [0, 1],
  },
  value: {
    min: 0,
  },
};

const defaultScale = {
  type: {
    type: 'cat',
    range: [0, 1],
  },
  name: {
    type: 'cat',
    range: [0, 1],
  },
  value: {
    min: 0,
  },
};

const { DataView } = DataSet;

const DounRingPieChart: React.FC<PieProps> = (props) => {
  const chartRef = React.useRef<G2.Chart>(null);
  const prefixCls = 'rc-pie-chart';
  const rootRef = React.useRef(null);
  const {
    className,
    style,
    type,
    height,
    forceFit,
    padding,
    animate,
    percent,
    color,
    colors,
    title,
    subTitle,
    hasLegend,
    valueFormat,
    label,
    showLabel,
    total,
    autoTotal,
    radius,
    legend,
    innerRadius,
    lineWidth,
    onGetG2Instance,
    chartTitle
  } = props;
  const [innerWidth, setInnerWidth] = React.useState<number>(0);
  const [legendBlock, setLegendBlock] = React.useState<boolean>(false);
  const [legendData, setLegendData] = React.useState<LegendDataItem[]>([]);
  const [totalNumber, setTotalNumber] = React.useState<number>(0);

  React.useEffect(() => {
    let requestRef = null;
    window.addEventListener('resize', () => {
      requestRef = requestAnimationFrame(() => resize());
    }, { passive: true });
    return () => {
      window.cancelAnimationFrame(requestRef);
      window.removeEventListener('resize', resize);
    }
  }, []);

  React.useEffect(() => {
    let newTotal = 0;
    if (autoTotal) {
      data.forEach(item => {
        if (item.value) {
          newTotal += item.value;
        }
      })
    } else {
      newTotal = typeof total === 'function' ? total() : total
    }
    setTotalNumber(newTotal);
  }, [props.total, props.autoTotal, props.data, legendData]);

  React.useEffect(() => {
    getLegendData();
  }, [props.data]);

  // 用于自定义图例
  const getLegendData = () => {
    if (!chartRef.current) return;
    const geom = chartRef.current.getAllGeoms()[0];
    if (!geom) return;
    // @ts-ignore
    const items = geom.get('dataArray') || [];
    const data = items.map((item: { color: any; _origin: any }[]) => {
      const origin = item[0]._origin;
      origin.color = item[0].color;
      origin.checked = true;
      return origin;
    });
    setLegendData(data);
  };

  const handleLegendClick = (item: any, i: string | number) => {
    const newItem = item;
    newItem.checked = !newItem.checked;
    const newLegendData = [...legendData];
    newLegendData[i] = newItem;

    const filteredLegendData = newLegendData.filter(l => l.checked).map(l => l.type);

    if (chartRef.current) {
      chartRef.current.filter('type', val => filteredLegendData.indexOf(val + '') > -1);
    }
    setLegendData(newLegendData);
  };

  const resize = () => {
    const root: HTMLDivElement = rootRef.current;

    if (!hasLegend || !root) {
      window.removeEventListener('resize', resize);
      return;
    }

    if (
      root &&
      root.parentNode &&
      (root.parentNode as HTMLElement).clientWidth <= 380
    ) {
      if (!legendBlock) {
        setLegendBlock(true);
      }
    } else {
      setLegendBlock(false);
    }
  };

  const handleGetG2Instance = (chart: G2.Chart) => {
    chartRef.current = chart;
    setInnerWidth(chart.get('height') * innerRadius);
    onGetG2Instance && onGetG2Instance(chart);
  };
  // type
  // name
  // value
  const tooltipFormat: [
    string,
    (...args: any[]) => { name?: string; value: string }
  ] = [
    'type*y*percent',
    (type: string, value: number, p: number) => ({
      name: type,
      value: `${value} [ ${(p * 100).toFixed(2)}% ]`,
    }),
  ];

  const defaultColors = colors;
  let formatColor;
  let data = props.data || [];
  let tooltip = props.tooltip;
  let selected = props.selected;

  if (percent || percent === 0) {
    selected = false;
    tooltip = false;
    formatColor = (value: string) => {
      if (value === '占比') {
        return color || 'rgba(24, 144, 255, 0.85)';
      }
      return '#F0F2F5';
    };

    data = [
      {
        type: '占比',
        value: parseFloat(percent + ''),
      },
      {
        type: '反比',
        value: 100 - parseFloat(percent + ''),
      },
    ];
  }

  const dv = new DataView();
  dv.source(data).transform({
    type: 'percent',
    field: 'value',
    dimension: 'type',
    as: 'percent',
  });
  const cols = Object.assign({}, defaultScale, scale);
  const dv1 = new DataView();
  dv1.source(data).transform({
    type: 'percent',
    field: 'value',
    dimension: 'name',
    as: 'percent',
  });
  return (
    <div
      className={classNames(className, {
        [`${prefixCls}`]: true,
        [`show-legend`]: !!hasLegend,
        ['legend-block']: legendBlock
      })}
      ref={rootRef}
      style={style}
    >
      <div className={`${prefixCls}__chart`}>
        <Chart
          scale={type === 'theta' ? cols : undefined}
          height={height}
          forceFit={forceFit}
          data={dv}
          padding={padding}
          animate={animate}
          onGetG2Instance={handleGetG2Instance}
        >
          {chartTitle && (
            <h3 className='main-title' style={{
              fontSize:16,
              color:"black",
              textAlign:"center",
              marginBottom: 0
            }}>
              {chartTitle}
            </h3>
          )}
          {/** 提示信息(tooltip)组件 */}
          {!!tooltip && <Tooltip showTitle={false} />}
          {/*<Tooltip*/}
          {/*  showTitle={false}*/}
          {/*  itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"*/}
          {/*/>*/}
          {/** 坐标系组件 */}
          <Coord
            type={type}
            radius={0.5}
            // innerRadius={innerRadius}
          />

          {/** 图例 */}
          <Legend {...legend}/>

          <Geom
            style={{ lineWidth, stroke: '#fff' }}
            // tooltip={tooltip ? tooltipFormat : undefined}
            type={type === 'theta' ? 'intervalStack' : 'interval'}
            position={type === 'theta' ? 'percent' : 'name*percent'}
            // color={
            //   [
            //     'name',
            //     percent || percent === 0 ? formatColor : defaultColors,
            //   ]
            // }
            color="type"
            tooltip={[
              'type*percent',
              (item, percent) => {
                percent = `${(percent * 100).toFixed(2)}%`;
                return {
                  name: item,
                  value: percent,
                };
              },
            ]}
            select={selected}
          >
            {showLabel && (
              <Label content='percent' {...label}/>
            )}
          </Geom>
          <View data={dv1} scale={type === 'theta' ? cols : undefined}>
            <Coord
              type="theta"
              radius={radius}
              innerRadius={innerRadius}
            />
            {/*<Coord type="theta" radius={0.75} innerRadius={0.5 / 0.75} />*/}
            <Geom
              style={{ lineWidth, stroke: '#fff' }}
              // tooltip={tooltip ? tooltipFormat : undefined}
              // type={type === 'theta' ? 'intervalStack' : 'interval'}
              // position={type === 'theta' ? 'percent' : 'type*percent'}
              type={'intervalStack'}
              position={'percent'}
              color={[
                'name',
                [
                  '#f5222d',
                  '#7FC9FE',
                  '#fa541c',
                  '#a0d911',
                  '#fa8c16',
                  '#fadb14',
                  '#52c41a',
                  '#13c2c2',
                  '#1890ff',
                  '#2f54eb',
                  '#722ed1',
                  '#eb2f96',
                ],
              ]}
              tooltip={[
                'name*percent',
                (item, percent) => {
                  percent = `${(percent * 100).toFixed(2)}%`;
                  return {
                    name: item,
                    value: percent,
                  };
                },
              ]}
              select={selected}
            >
              {showLabel && (
                <Label content='percent' {...label}/>
              )}
            </Geom>
          </View>
        </Chart>
        {/*<FitText>*/}
        {/*  <div*/}
        {/*    className={`${prefixCls}__content`}*/}
        {/*    style={{*/}
        {/*      marginTop: (legend && legend.visible)*/}
        {/*        ? -innerWidth * 0.1*/}
        {/*        : 10,*/}
        {/*      width: innerWidth,*/}
        {/*      height: +innerWidth,*/}
        {/*      padding: innerWidth * 0.1*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <div>*/}
        {/*      {title && (*/}
        {/*        <h4>{title}</h4>*/}
        {/*      )}*/}
        {/*      {(total || autoTotal) && (*/}
        {/*        <p>{totalNumber}</p>*/}
        {/*      )}*/}
        {/*      /!*{subTitle && <h5>{subTitle}</h5>}*!/*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</FitText>*/}
      </div>

      {hasLegend && (
        <ul className={`${prefixCls}__legend`}>
          {legendData.map((item, i) => {
            return (
              <li key={item.type} onClick={() => handleLegendClick(item, i)}>
                <div className="title">
                <span
                  className="dot"
                  style={{
                    backgroundColor: !item.checked ? '#aaa' : item.color,
                  }}
                />
                  <span title={item.type}>{item.type}</span>
                </div>
                <div className="value">
                  <span className="value">{valueFormat ? valueFormat(item.value) : item.value}</span>
                </div>
                <div className="percent">
                <span className="percent">
                  {`${(Number.isNaN(item.percent) ? 0 : item.percent * 100).toFixed(2)}%`}
                </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
};

DounRingPieChart.defaultProps = {
  type: 'theta',
  animate: true,
  forceFit: true,
  hasLegend: false,
  showLabel: false,
  height: 400,
  radius: 1,
  innerRadius: 0,
  lineWidth: 1,
  legend: {
    visible: false
  },
  data: [],
  padding: 'auto',
  autoTotal: false
};

export default DounRingPieChart;
