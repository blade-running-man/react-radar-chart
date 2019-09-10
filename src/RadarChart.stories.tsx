import { storiesOf } from '@storybook/react';
import * as React from 'react';
import RadarChart from "./RadarChart";


storiesOf('RadarChart', module)
  .add('Base chart', () => (
    <RadarChart />
  ));