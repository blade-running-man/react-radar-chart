import { storiesOf } from '@storybook/react';
import * as React from 'react';
import RadarChart from "./RadarChart";

const data = {
  headers: ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'],
  values: [
    [0.7, 0.5, 0.9, 0.4, 0.6, 0.8],
    [0.1, 0.7, 0.7, 0.8, 0.7, 0.6]
  ]
}

storiesOf('RadarChart', module)
  .add('Base chart', () => (
    <RadarChart headers={data.headers} data={data.values} />
  ));