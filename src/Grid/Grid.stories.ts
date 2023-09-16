import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';

import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Example/Grid',
  component: Grid,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const CellSelected: Story = {
  args: {
    rows: 5,
    cols: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = 2; // example: selecting the cell in the 3rd row
    const col = 3; // and the 4th column
    const cell = await canvas.getByTestId(`cell-${row}-${col}`);
    cell.click();
  },
};

export const CellDeSelected: Story = {
  args: {
    rows: 5,
    cols: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
  },
};
