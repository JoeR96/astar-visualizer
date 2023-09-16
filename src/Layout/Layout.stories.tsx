import { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';
import { Grid } from '../Grid/Grid';

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
  <Layout>
    <Grid rows={args.rows} cols={args.cols} />
  </Layout>
);

CenteredGrid.args = {
  rows: 5,
  cols: 5,
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
