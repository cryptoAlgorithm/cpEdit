const compileRunCmd = {
    cpp: {
        darwin: {
            compile: [
                { cmd: 'g++', args: ['-x', 'c++', 'code', '-o', 'out', '-Wall', '-Wshadow',
                    '-O2', '-lm', '-m64', '-s', '-w', '-std=gnu++17', '-fmax-errors=512'] },
            ],
            run: {cmd: '$dir/out', args: []}
        },
        win32: {
            compile: []
        },
        other: {

        }
    },
    python3: {
        other: {
            compile: [],
            run: {cmd: 'python3', args: ['code']}
        }
    },
    js: {
        other: {
            compile: [],
            run: {cmd: 'node', args: ['code']}
        }
    }
}

export default compileRunCmd;

