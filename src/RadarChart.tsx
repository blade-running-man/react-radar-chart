import React, { Component, Fragment } from "react";
import * as PropTypes from 'prop-types';

type Dataset = {
  backgroundColor?: string,
  borderColor?: string,
  borderWidth?: number,
  data: Array<number>,
  label?: string,
  pointRadius?: number,
  pointBorderWidth?: number,
  pointBackgroundColor?: string,
  pointBorderColor?: string,
}
type Data = {
  captionMargin: number,
  chartSize: number,
  datasets: Array<Dataset>,
  labels: Array<string>,
  numberOfScales: number,
}
interface ChartRadarProps {
  data: Data;
};

export default class ChartRadar extends Component<ChartRadarProps, any> {

  public static defaultProps = {
    data: {
      captionMargin: 10,
      chartSize: 300,
      datasets: [],
      labels: [],
      numberOfScales: 4,
    },
  };

  public static propTypes = {
    data: PropTypes.shape({
      captionMargin: PropTypes.number,
      chartSize: PropTypes.number,
      datasets: PropTypes.arrayOf(PropTypes.shape({
        backgroundColor: PropTypes.string,
        borderColor: PropTypes.string,
        borderWidth: PropTypes.number,
        data: PropTypes.arrayOf(PropTypes.number),
        label: PropTypes.string,
        pointRadius: PropTypes.number,
        pointBorderWidth: PropTypes.number,
        pointBackgroundColor: PropTypes.string,
        pointBorderColor: PropTypes.string,
      })),
      labels: (props: ChartRadarProps, propName: string, componentName: string) => {
        if (props.labels.length < 3) {
          throw new Error(
            `${propName} prop must be an array of at least 3 elements in ${componentName}.`
          );
        }
        return null
      },
    })

}

  setViewBox = () => {
    const { data: {chartSize, captionMargin} } = this.props;
    return `-${captionMargin} 0 ${chartSize + captionMargin * 2} ${chartSize}`;
  };

  polarToX = (angle: number, distance: number) => Math.cos(angle - Math.PI / 2) * distance;
  polarToY = (angle: number, distance: number) => Math.sin(angle - Math.PI / 2) * distance;

  pathDefinition = (points:any) => {

    let d = 'M' + points[0][0].toFixed(4) + ',' + points[0][1].toFixed(4);
    for (let i = 1; i < points.length; i++) {
      d += 'L' + points[i][0].toFixed(4) + ',' + points[i][1].toFixed(4);
    }
    return d + 'z';
  };

  shape = (columns:any) => (chartData: any, i: any) => {
    const { data: { chartSize }} = this.props;
    return (
      <path
        key={`shape-${i}`}
        d={this.pathDefinition(
          columns.map((col:any) => {
            const value = chartData.data[col.key];
            return [
              this.polarToX(col.angle, (value * chartSize) / 2),
              this.polarToY(col.angle, (value * chartSize) / 2)
            ];
          })
        )}
        stroke={chartData.borderColor}
        stroke-linejoin="round"
        stroke-width={chartData.borderWidth}
        fill={chartData.backgroundColor}
      />
    );
  };

  getCoordinatesUnity = () => {
    const { data: { chartSize, labels } } = this.props;

    const captionsData = labels.map((key: any, i:any, all:any) => {
      return {
        key: i,
        caption: labels[i],
        angle: (Math.PI * 2 * i) / all.length
      };
    })

    return captionsData.reduce((accumulator, currVal) => {
      return `${accumulator}${this.polarToX(currVal.angle, chartSize / 2)},${this.polarToY(currVal.angle, chartSize / 2)} `;
    }, '')
  }

  renderShapes = () => {
    const { data: { datasets } } = this.props;
    const captions = datasets[0].data;
    const columns = captions.map((key:any, i:any, all:any) => {
      return {
        key: i,
        angle: (Math.PI * 2 * i) / all.length,
        backgroundColor: i.backgroundColor,
        borderColor: i.borderColor,
      };
    });
    return datasets.map(this.shape(columns))
  }

  renderPoligon = () => {
    const { data: { chartSize } } = this.props;
    const coordinates = this.getCoordinatesUnity()
    const middleOfChart = (chartSize / 2).toFixed(4);
    return (
      <polygon fill="red" stroke="black" transform={`translate(${middleOfChart},${middleOfChart})`} points={coordinates} />
    )
  }

  points = (points:any) => {
    return points
      .map((point:any) => point[0].toFixed(4) + ',' + point[1].toFixed(4))
      .join(' ');
  };

  axis = () => (col:any, i:any) => {
    const { data: { chartSize } } = this.props;
    return (
      <polyline
      key={`poly-axis-${i}`}
      points={this.points([
        [0, 0],
        [this.polarToX(col.angle, chartSize / 2), this.polarToY(col.angle, chartSize / 2)]
      ])}
      stroke="#555"
      strokeWidth="1"
    />
    )
  };

  renderAxis = () => {
    const { data: { datasets } } = this.props;
    const captions = Object.keys(datasets[0].data);
    const columns = captions.map((key, i, all) => {
      return {
        key: i,
        angle: (Math.PI * 2 * i) / all.length
      };
    });
    return columns.map(this.axis());
  }

  caption = () => (col:any) => {
    const { data: {chartSize} } = this.props;
    return (
      <text
        key={`caption-of-${col.key}`}
        x={this.polarToX(col.angle, (chartSize / 2) * 0.95).toFixed(4)}
        y={this.polarToY(col.angle, (chartSize / 2) * 0.95).toFixed(4)}
        dy={10 / 2}
        fill="#444"
        fontWeight="400"
      >
        {col.key}
      </text>
    )
  }

  renderCaption = () => {
    const { data: { labels } } = this.props;
    const columns = labels.map((key, i, all) => {
      return {
        key,
        angle: (Math.PI * 2 * i) / all.length
      };
    });
    return columns.map(this.caption());
  }

  render() {
    const { data: { chartSize } } = this.props;
    const middleOfChart = (chartSize / 2).toFixed(4);
    return (
      <div>
        <svg 
          version="1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={this.setViewBox()} 
          width={chartSize}
          height={chartSize}>
          {this.renderPoligon()}
          <g transform={`translate(${middleOfChart},${middleOfChart})`}>
            {this.renderShapes()}
            {this.renderAxis()}
            {this.renderCaption()}
          </g>
        </svg>
      </div>
    );
  }
}