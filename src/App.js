import CssBaseline from '@mui/material/CssBaseline'
import { useDispatch } from 'react-redux'
import { setCurrentRegion } from './features/italymap/map.slice'
import { ThemeProvider } from '@mui/material/styles'
import Layout from './components/layout/Layout'
import { theme } from './theme'
import Graphs from './features/graphs/Graphs'
import Hero from './components/hero/Hero'



const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Hero />
        <Graphs />
      </Layout>
    </ThemeProvider>
  )
}

export default App
