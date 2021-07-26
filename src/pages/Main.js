import React from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box, Button, Paper,
    Tab,
    Tabs,
    Typography
} from '@material-ui/core';
import Editor, {loader} from '@monaco-editor/react';
import AddressBar from '../components/AddressBar';

import lang from '../defaultLangData/lang';
import compileRunCmd from '../defaultLangData/compileRunCmds';
import { ExpandMoreRounded } from '@material-ui/icons';
import TopAppBar from '../components/TopAppBar';
import TestcaseDialog from '../components/TestcaseDialog';

// Fix editor loading
const path = require('path');

loader.config({
    paths: {
        vs: path.join(__dirname, 'monaco', 'vs')
    },
});

// Native stuff
const { mkdtemp, writeFile, rm } = require('fs');
const { spawn } = require('child_process');
const os = require('os');
const { platform } = require('process');

let lastChange = null;

export default function Main() {
    const [selLang, setSelLang] = React.useState(lang[0]),
        [code, setCode] = React.useState(''),
        [rightTab, setRightTab] = React.useState(0),
        [webViewLoad, setWebViewLoad] = React.useState(false),
        [progOut, setProgOut] = React.useState(''),
        [compOut, setCompOut] = React.useState(''),
        [runState, setRunState] = React.useState(0),
        [exitCode, setExitCode] = React.useState(null),
        [testcases, setTestcases] = React.useState([]),
        [editTestcaseOpen, setEditTestcaseOpen] = React.useState(false),
        wvRef = React.useRef(),
        safeLang = selLang ?? lang[0],
        procRef = React.useRef([]);

    const appendToState = (v, state, addSpace = true) => state(ov => ov + v + (addSpace ? '\n' : ''));

    const execTestcase = (directory, cpCmd, t, i, tot) => {
        const run = spawn(cpCmd.run.cmd.replace('$dir', directory), cpCmd.run.args, {
            cwd: directory
        });
        procRef.current.push(run);

        if (t) {
            run.stdin.write(t.in);
            run.stdin.end();
        }

        run.stdout.on('data', (data) => appendToState(data, setProgOut, false));
        run.stderr.on('data', (data) => appendToState(data, setProgOut, false));

        run.on('close', (c) => {
            if (i === tot - 1) {
                appendToState('\n#### End of output ####', setProgOut, false);

                setExitCode(c);
                setRunState(1);
            }

            // Delete tmp dir
            rm(directory, { recursive: true, force: true }, e => {
                if (e) console.error('Failed to delete tmp directory:', directory);
            });
        });
    }
    const runCompiled = (cpCmd, directory) => {
        console.log(procRef.current)

        if (procRef.current.length !== 0) return;

        setProgOut('');
        setExitCode(null);
        setRunState(4);

        if (testcases.length === 0) {
            appendToState('No testcases, running without stdin\n', setProgOut);

            execTestcase(directory, cpCmd, null, 0, 1);
        }

        testcases.forEach((t, i) => {
            appendToState(`#### Testcase #${i} ####\n`, setProgOut);

            execTestcase(directory, cpCmd, t, i, testcases.length);
        });
    }
    const run = () => {
        mkdtemp(path.join(os.tmpdir(), 'cpEdit-'), (err, directory) => {
            if (err) throw err;
            console.log(directory);

            writeFile(path.join(directory, 'code'), code, err => {
                if (err) throw err;
                console.log('The file has been saved!');

                const cpCmd = compileRunCmd[safeLang.compileCode][platform] ?? compileRunCmd[safeLang.compileCode].other;

                if (cpCmd.compile.length === 0) {
                    setCompOut('Compilation skipped');
                    runCompiled(cpCmd, directory);
                    return;
                }

                setCompOut('');
                setRunState(2);

                for (let i = 0; i < cpCmd.compile.length; i++) {
                    const c = cpCmd.compile[i];

                    const compile = spawn(c.cmd, c.args, {
                        cwd: directory
                    });
                    procRef.current.push(compile);
                    appendToState(`Spawning "${c.cmd}" with args [${c.args.join(', ')}]`, setCompOut);

                    compile.stdout.on('data', data => appendToState(`stderr: ${data}`, setCompOut));
                    compile.stderr.on('data', data => appendToState(data, setCompOut));

                    compile.on('close', (code) => {
                        appendToState(`"${c.cmd}" exited with exit code ${code}`, setCompOut);

                        if (code !== 0) { // Compile failed
                            appendToState(`"${c.cmd}" exited with non zero exit code, compile failure`, setCompOut);
                            setRunState(3);
                            procRef.current = [];
                            return;
                        }

                        if (i === cpCmd.compile.length - 1) {
                            procRef.current = [];
                            runCompiled(cpCmd, directory);
                        }
                    });
                    compile.stdin.write(code);
                    compile.stdin.end();
                }
            });
        });
    }
    const stop = () => {
        procRef.current.forEach(p => p.kill());
        setRunState(0);
        procRef.current = [];
    }

    const webViewRef = React.useCallback(elem => {
        wvRef.current = elem;
        if (elem) {
            elem.addEventListener('did-start-loading', () => setWebViewLoad(false));
            elem.addEventListener('did-stop-loading', () => setWebViewLoad(true));
        }
    }, []);
    React.useEffect(() => setCode(safeLang.template), [selLang]);
    React.useEffect(() => {
        if (lastChange) clearTimeout(lastChange);
        lastChange = setTimeout(run, 2000);
    }, [code]);

    return <>
        <TopAppBar selLang={selLang} setSelLang={setSelLang} runState={runState} run={run} stop={stop} />

        <Box display='flex'>
            <Editor language={safeLang.code} value={code} onChange={v => setCode(v)} theme='vs-dark'
                    width='50vw' height='calc(100vh - 48px)' options={{
                automaticLayout: true
            }} />
            <Box width='50vw' maxHeight='calc(100vh - 48px)' display='flex' flexDirection='column' borderLeft={1} borderColor='divider'>
                <Box borderBottom={1} borderColor='divider'>
                    <Tabs value={rightTab} onChange={(e, v) => setRightTab(v)} aria-label="basic tabs example">
                        <Tab label='Result/Testcases' />
                        <Tab label='Submission' />
                    </Tabs>
                </Box>
                { /* Don't unmount tab content to prevent reloading of WebView */ }
                <Box flexGrow={1} display={rightTab === 0 ? 'flex' : 'none'} flexDirection='column' overflow='auto' p={1}>
                    <Button variant='contained' onClick={() => setEditTestcaseOpen(true)}>Edit Testcases</Button>

                    <Paper sx={{flexGrow: 1, mt: 1, p: 1}} elevation={6}>
                        <Accordion disabled={compOut.length === 0} TransitionProps={{ unmountOnExit: true }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreRounded />}>
                                <Typography>{compOut.length === 0 ? 'No compiler output' : 'Compiler output'}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Paper variant='outlined' sx={{p: .75}}>
                                    <pre className='selectable' style={{margin: 0}}>{compOut.length === 0 ? 'No output' : compOut}</pre>
                                </Paper>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion disabled={progOut.length === 0} TransitionProps={{ unmountOnExit: true }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreRounded />}>
                                <Typography>{progOut.length === 0 ? 'No program output' : 'Program output'}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Paper variant='outlined' sx={{p: .75}}>
                                    <pre className='selectable' style={{margin: 0}}>{progOut.length === 0 ? 'No output' : progOut}</pre>
                                </Paper>
                            </AccordionDetails>
                        </Accordion>

                        {
                            exitCode !== null &&
                            <Typography variant='body2' color='text.secondary' mt={1}>Program exited with exit code {exitCode}</Typography>
                        }
                    </Paper>
                </Box>
                <Box position='relative' flexGrow={1} display={rightTab === 1 ? 'block' : 'none'}>
                    <AddressBar wvRef={wvRef} loaded={webViewLoad} />
                    <webview src='https://dunjudge.me/' style={{height: '100%', maxHeight: 'calc(100vh - 145px)'}} ref={webViewRef} />
                </Box>
            </Box>
        </Box>

        <TestcaseDialog open={editTestcaseOpen} setOpen={setEditTestcaseOpen} testcases={testcases} setTestcases={setTestcases} />
    </>
}
