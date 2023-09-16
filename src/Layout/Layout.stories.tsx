import { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';
import { Grid } from '../Grid/Grid';
import { Button } from '../Button/Button'; // Importing the Button component
import './layout.css'; // Importing the styles

const meta: Meta<typeof Layout> = {
  title: 'Example/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type LayoutStoryArgs = {
  rows: number;
  cols: number;
};

const CenteredGrid: StoryObj<typeof Layout, LayoutStoryArgs> = (args) => (

  <Layout/>
);

CenteredGrid.args = {
  rows: 8,
  cols: 12,
};

CenteredGrid.argTypes = {
  rows: {
    control: {
      type: 'number',
      min: 1,
      max: 20,
      step: 1,
    },
    description: 'Number of rows in the grid',
  },
  cols: {
    control: {
      type: 'number',
      min: 1,
      max: 20,
      step: 1,
    },
    description: 'Number of columns in the grid',
  },
};

export { CenteredGrid };
