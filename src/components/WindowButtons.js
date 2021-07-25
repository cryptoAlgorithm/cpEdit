import React from 'react';
import styled from '@emotion/styled';

import lightClose from '../img/winActBtn/light/Close.png';
import lightMaximize from '../img/winActBtn/light/Maximize.png';
import lightMinimize from '../img/winActBtn/light/Minimize.png';
import lightRestore from '../img/winActBtn/light/Restore.png';
import darkClose from '../img/winActBtn/dark/Close.png';
import darkMaximize from '../img/winActBtn/dark/Maximize.png';
import darkMinimize from '../img/winActBtn/dark/Minimize.png';
import darkRestore from '../img/winActBtn/dark/Restore.png';
import { useTheme } from '@material-ui/core';

const { ipcRenderer } = require('electron');

const StyledButton = styled.button`
    width: 48px;
    height: 48px;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    -webkit-app-region: no-drag;
    transition: background-color .2s ease-in-out;
    ${props => `
    &:hover {
        background-color: ${props.red ? '#bd5454' : '#ffffff14'}
    }
    &:active {
        background-color: ${props.red ? '#7e1414' : '#ffffff26'}
    }
    `}
`

export default function WindowButtons({max}) {
    const theme = useTheme();
    const dark = theme.palette.mode === 'dark';

    return <>
        <StyledButton onClick={() => ipcRenderer.send('win::command', 'mini')}>
            <img src={dark ? lightMinimize : darkMinimize} alt='Minimize' draggable={false} />
        </StyledButton>
        <StyledButton onClick={() => ipcRenderer.send('win::command', 'toggleMax')}>
            <img src={dark ? (max ? lightRestore:  lightMaximize) : (max ? darkRestore : darkMaximize)} alt='Maximize' draggable={false} />
        </StyledButton>
        <StyledButton red onClick={() => ipcRenderer.send('win::command', 'close')}>
            <img src={dark ? lightClose : darkClose} alt='Close' draggable={false} />
        </StyledButton>
    </>
}
