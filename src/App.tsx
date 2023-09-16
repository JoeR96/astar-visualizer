import { Fragment, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Grid from './Grid/Grid'

function App() {
  const [count, setCount] = useState(0)

  return (
  
      <Fragment>
        <Grid rows={12}cols={12} ></Grid>
    </Fragment>
  )
}

export default App
