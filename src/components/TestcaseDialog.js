import React from 'react';
import {
    Accordion, AccordionDetails,
    AccordionSummary, Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, TextField, Typography
} from '@material-ui/core';
import { AddRounded, DeleteForeverRounded, ExpandMoreRounded } from '@material-ui/icons';

import useForceUpdate from '../hooks/useForceRerender';

export default function TestcaseDialog({open, setOpen, testcases, setTestcases}) {
    const [input, setInput] = React.useState(''),
        [output, setOutput] = React.useState('');

    const forceUpdate = useForceUpdate();

    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Edit Testcases</DialogTitle>
        <DialogContent sx={{pb: 0}}>
            {
                testcases.map((t, i) => <Accordion TransitionProps={{unmountOnExit: true}} key={t.in + t.out} elevation={0}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreRounded />}>
                        <Typography>Testcase #{i}</Typography>
                        <Box flexGrow={1} />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>Input:</Typography>
                        <pre style={{marginTop: 0}} className='selectable'>{t.in}</pre>
                        <Typography>Expected output:</Typography>
                        <pre style={{marginTop: 0}} className='selectable'>{t.out}</pre>
                        <Button variant='outlined' color='error' startIcon={<DeleteForeverRounded />} onClick={() => {
                            setTestcases(v => {
                                v.splice(i, 1);
                                return v
                            });
                            forceUpdate();
                        }}>Delete Testcase</Button>
                    </AccordionDetails>
                </Accordion>)
            }
            <TextField fullWidth multiline maxRows={4} label='Testcase Input' onChange={e => setInput(e.currentTarget.value)}
                       value={input} variant='filled' sx={{my: .75}} size='small' />
            <TextField fullWidth multiline maxRows={4} label='Expected Output' onChange={e => setOutput(e.currentTarget.value)}
                       value={output} variant='filled' sx={{mb: .5}} size='small' />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)}>Done</Button>
            <Button onClick={() => {
                setTestcases(v => [...v, {in: input, out: output}]);
                setInput('');
                setOutput('');
            }} variant='contained' endIcon={<AddRounded />}>Add</Button>
        </DialogActions>
    </Dialog>
}
