import React, { Component, Fragment } from "react";



interface ChartRadarProps {
  chartSize: number,
  captionMargin: number,
  numberOfScales: number,
  headers: Array<string>
  data: Array<any>
};

export default class ChartRadar extends Component<ChartRadarProps, any> {

  public static defaultProps = {
    chartSize: 300,
    captionMargin: 10,
    numberOfScales: 4,
    headers: [],
    data: [],
  };

  setViewBox = () => {
    const { chartSize, captionMargin } = this.props;
    return `-${captionMargin} 0 ${chartSize + captionMargin * 2} ${chartSize}`;
  };

  pathDefinition = (points:any) => {
    console.log(points)
    console.log('points.length', points.length)

    let d = 'M' + points[0][0].toFixed(4) + ',' + points[0][1].toFixed(4);
    for (let i = 1; i < points.length; i++) {
      d += 'L' + points[i][0].toFixed(4) + ',' + points[i][1].toFixed(4);
    }
    return d + 'z';
  };

  shape = (columns:any) => (chartData: any, i: any) => {
    const { chartSize } = this.props;
    const data = chartData;
    const polarToX = (angle: number, distance: number) => Math.cos(angle - Math.PI / 2) * distance;
    const polarToY = (angle: number, distance: number) => Math.sin(angle - Math.PI / 2) * distance;
    return (
      <path
        key={`shape-${i}`}
        d={this.pathDefinition(
          columns.map((col:any) => {
            const value = data[col.key];
            return [
              polarToX(col.angle, (value * chartSize) / 2),
              polarToY(col.angle, (value * chartSize) / 2)
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
    const { chartSize, headers } = this.props;

    const polarToX = (angle: number, distance: number) => Math.cos(angle - Math.PI / 2) * distance;
    const polarToY = (angle: number, distance: number) => Math.sin(angle - Math.PI / 2) * distance;

    const captionsData = headers.map((key: any, i:any, all:any) => {
      return {
        key: i,
        caption: headers[i],
        angle: (Math.PI * 2 * i) / all.length
      };
    })

    return captionsData.reduce((accumulator, currVal) => {
      return `${accumulator}${polarToX(currVal.angle, chartSize / 2)},${polarToY(currVal.angle, chartSize / 2)} `;
    }, '')
  }

  renderShapes = () => {
    const { data } = this.props;
    const captions = Object.keys(data[0]);
    const columns = captions.map((key, i, all) => {
      return {
        key,
        angle: (Math.PI * 2 * i) / all.length
      };
    });
    return data.map(this.shape(columns))
  }

  renderPoligon = () => {
    const { chartSize } = this.props;
    const coordinates = this.getCoordinatesUnity()
    const middleOfChart = (chartSize / 2).toFixed(4);
    return (
      <Fragment>
        <polygon fill="red" stroke="black" transform={`translate(${middleOfChart},${middleOfChart})`} points={coordinates} />
      </Fragment>
    )
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
        </g>
      </svg>
    );
  }
}