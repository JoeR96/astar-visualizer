import { Fragment } from 'react';
import './App.css';
import { Layout } from './Layout/Layout';

function App() {
  return (
    <Fragment>
      <h1 className="main-heading">A* Visualizer</h1>  // Corrected and added a class for styling
      <Layout />
    </Fragment>
  );
}

export default App;
