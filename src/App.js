import React from 'react';

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import themeOptions from './themeOptions';
import Main from './pages/Main';

export default function App() {
    return <ThemeProvider theme={themeOptions('dark')}>
        <CssBaseline />
        <Main />
    </ThemeProvider>
}
