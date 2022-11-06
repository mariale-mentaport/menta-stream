import { EthProvider } from "contexts/EthContext";

import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// livepeer
import {
  LivepeerConfig,
  ThemeConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';

// routing
import Home from 'pages/Home';
import Routes from './routes'
// defaultTheme
import themes from './theme';
const LIVESTREAM_API = process.env.REACT_APP_LIVESTREAM_API;

const client = createReactClient({
  provider: studioProvider({ apiKey: LIVESTREAM_API }),
});
 


function App() {
  return (
    <LivepeerConfig client={client} >
      <EthProvider >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes}>
          <CssBaseline />
            <Routes />
          </ThemeProvider>
      </StyledEngineProvider>
      </EthProvider>
    </LivepeerConfig>

  );
}

export default App;


