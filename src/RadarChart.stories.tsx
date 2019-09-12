import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, array } from '@storybook/addon-knobs';
import RadarChart from "./RadarChart";

const stories = storiesOf('RadarChart', module);

const data = {
  datasets: [
    {
      label: 'Messi',
      data: [0.97, 0.97, 0.97, 0.98, 0.43, 0.82],
      backgroundColor: 'yellow',
      borderColor: 'green',
      borderWidth: 3,
    },
  ],
  labels: ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'],
}

stories.addDecorator(withKnobs);

storiesOf('RadarChart', module)
  .add('Base chart', () => (
    <RadarChart chartSize={500} captionMargin={20} data={data} />
  ));