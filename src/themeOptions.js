import { createTheme } from '@material-ui/core';

export default function themeOptions(mode) {
    if (mode !== 'dark' && mode !== 'light') mode = 'dark';

    const options = {
        shape: {
            borderRadius: 7,
        },
        palette: {
            mode: mode,
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#fbc02d',
            },
        },
        typography: {
            fontFamily: [
                'Noto Sans',
                'Roboto',
                '-apple-system',
                'BlinkMacSystemFont',
                'system-ui',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: (mode === 'dark' ?
                    `/* ====== Custom scrollbar ======= */
::-webkit-scrollbar {
    background-color: #fff;
    width: 14px
}

/* Background of the scrollbar except button or resizer */
::-webkit-scrollbar-track {
    background-color: #313131;
}

::-webkit-scrollbar-corner {
    background-color: #313131;
}

/* scrollbar itself */
::-webkit-scrollbar-thumb {
    background-color: #6B6B6B;
    border-radius: 14px;
    border: 3px solid #313131;
    transition: all 500ms ease-out;
    min-height: 50px;
}
::-webkit-scrollbar-thumb:hover {
    background-color: rgb(149, 149, 149)!important;
}
/* ============ */` : ''),
            },
        }
    }
    const t = createTheme(options);
    t.shape.borderRadius = 7; // Fix some random bug
    return t;
}