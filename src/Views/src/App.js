import React, { useState } from 'react';
import PrivateRoutes from './private.routes'
import { getPreferenceColor, setPreferenceColor } from './services/auth';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
  lightBlue
} from "@material-ui/core/colors";

function App() {
  if (!getPreferenceColor()) {
    setPreferenceColor('light')
  }
  const [darkState, setDarkState] = useState(getPreferenceColor() == 'dark');
  const palletType = darkState ? "dark" : "light";
  const mainPrimaryColor = darkState ? lightBlue[500] : '#3f51b5';
  const mainSecondaryColor = darkState ? '#f50057' : '#f50057';
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor
      },
      secondary: {
        main: mainSecondaryColor
      }
    }
  });

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <PrivateRoutes />
      </ThemeProvider>
    </div>
  );
}

export default App;
