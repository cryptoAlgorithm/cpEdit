import React from 'react';
import { Button, Tooltip } from "@material-ui/core";
import hotkeys from 'hotkeys-js';

import {
    HourglassBottomRounded,
    PlayArrowRounded,
    ReplayRounded,
    StopRounded,
    WarningRounded
} from '@material-ui/icons';

const d = [
    {
        label: 'Run',
        act: 'Run code',
        icon: <PlayArrowRounded />,
        col: 'success'
    }, {
        label: 'Rerun',
        act: 'Rerun/recompile',
        icon: <ReplayRounded />,
        col: 'success'
    }, {
        label: 'Compiling',
        act: null,
        icon: <HourglassBottomRounded />,
        col: 'warning'
    }, {
        label: 'Error',
        act: 'Recompile',
        icon: <WarningRounded />,
        col: 'error'
    }, {
        label: 'Stop',
        act: 'Stop',
        icon: <StopRounded />,
        col: 'error'
    },
];

export default function RunButton({state, run, kill, os}) {
    const handleRunCmd = () => {
        switch (state) {
            case 0:
                // Run
                run();
                break;
            case 1:
                // Rerun
                kill();
                run();
                break;
            case 2:
                // Compiling
                break;
            case 3:
                // Error
                run();
                break;
            case 4:
                // Stop
                kill();
        }
    }

    React.useEffect(() => hotkeys('command+d', e => {
        handleRunCmd();
        e.preventDefault();
        return false
    }), []);

    return <Tooltip title={d[state].act ? d[state].act + ' (⌘ D)' : ''}>
        <Button variant='contained' startIcon={d[state].icon} color={d[state].col} onClick={handleRunCmd}
                sx={{position: 'absolute', left: '50%', top: 6, transform: 'translateX(-50%)',
                    transition: 'background-color .25s ease-in-out'}}>
            {d[state].label}
        </Button>
    </Tooltip>
}

