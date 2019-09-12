import React, { Component, Fragment } from "react";


type Data = {
  datasets: Array<any>,
  labels: Array<any>
}
interface ChartRadarProps {
  chartSize: number;
  captionMargin: number;
  numberOfScales: number;
  data: Data;
};

export default class ChartRadar extends Component<ChartRadarProps, any> {

  public static defaultProps = {
    chartSize: 300,
    captionMargin: 10,
    numberOfScales: 4,
    data: {
      datasets: [],
      labels: [],
    },
  };

  setViewBox = () => {
    const { chartSize, captionMargin } = this.props;
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
    const { chartSize } = this.props;
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
        stroke={`#edc951`}
        fill={`#edc951`}
        fillOpacity=".5"
      />
    );
  };

  getCoordinatesUnity = () => {
    const { chartSize, data: { labels } } = this.props;

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
        angle: (Math.PI * 2 * i) / all.length
      };
    });
    return datasets.map(this.shape(columns))
  }

  renderPoligon = () => {
    const { chartSize } = this.props;
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
    const { chartSize } = this.props;
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

  render() {
    const { chartSize, data } = this.props;
    const middleOfChart = (chartSize / 2).toFixed(4);
    return (
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
        </g>
      </svg>
    );
  }
}