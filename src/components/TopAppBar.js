import React from 'react';
import {
    AppBar,
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core';
import RunButton from './RunButton';
const { platform } = require('process');
import lang from '../defaultLangData/lang';
import WindowButtons from './WindowButtons';
const { ipcRenderer } = require('electron');

export default function TopAppBar({runState, run, stop, selLang, setSelLang}) {
    const [pendingSelLang, setPendingSelLang] = React.useState(null),
        [isMaximized, setIsMaximized] = React.useState(false),
    confDialogOpen = Boolean(pendingSelLang);

    const isMac = platform === 'darwin';
    // const isMac = false;

    React.useEffect(() => {
        ipcRenderer.on('win::maximize', () => {
            setIsMaximized(true);
            console.log('max')
        });
        ipcRenderer.on('win::unmaximize', () => {
            setIsMaximized(false);
            console.log('unmax')
        });
    }, [])

    return <>
        <AppBar position='relative' sx={{WebkitAppRegion: 'drag'}}>
            <Toolbar variant='dense' sx={{pr: '0!important'}}>
                <Typography variant='h6' component='div' ml={isMac && !isMaximized ? 8 : 0}>CPEdit</Typography>
                <RunButton state={runState} run={run} kill={stop} os={platform} />
                <Box flexGrow={1} />
                <Autocomplete size='small' value={selLang} clearIcon={null} options={lang}
                              onChange={(e, v) => setPendingSelLang(v)}
                              renderInput={p =>
                                  <TextField {...p} variant='filled' label='Language'
                                             sx={{width: 125, mr: isMac ? 3 : 1.5, '-webkit-app-region': 'no-drag'}} />} />
                {!isMac && <WindowButtons max={isMaximized} /> }
            </Toolbar>
        </AppBar>

        <Dialog open={confDialogOpen} onClose={() => setPendingSelLang(null)} maxWidth='xs' fullWidth>
            <DialogTitle>Change Code Language?</DialogTitle>
            <DialogContent sx={{pb: 1}}>
                <DialogContentText>All unsaved changes will be lost, and reverted back to the default template</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color='error' onClick={() => {
                    setSelLang(pendingSelLang);
                    setPendingSelLang(null);
                }}>Change Language</Button>
                <Box flexGrow={1} />
                <Button variant='contained' onClick={() => setPendingSelLang(null)}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </>
}
