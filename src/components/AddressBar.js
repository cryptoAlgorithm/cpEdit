import React from 'react';
import { Box, CircularProgress, IconButton, TextField } from "@material-ui/core";
import { MoreVertRounded, RefreshRounded } from "@material-ui/icons";


export default function AddressBar({wvRef, loaded}) {
    return <Box display='flex' alignItems='center' p={.5}>
        { !loaded && <CircularProgress size={34} thickness={5} sx={{p: '4px'}} /> }
        { loaded && <IconButton size='small' onClick={() => wvRef.current.reload()}><RefreshRounded /></IconButton> }
        <TextField variant='outlined' hiddenLabel size='small' sx={{mx: .5, flexGrow: 1}} placeholder='Enter an URL' />
        <IconButton size='small'><MoreVertRounded /></IconButton>
    </Box>
}
