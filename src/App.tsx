import { Layout } from './layout/Layout.tsx';

export interface AStarVisualizerProps {
  defaultDarkMode?: boolean;
}

function App({ defaultDarkMode }: AStarVisualizerProps) {
  return <Layout defaultDarkMode={defaultDarkMode} />;
}

export default App;
