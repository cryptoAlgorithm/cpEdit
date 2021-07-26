/*
Compiler and running commands for built-in languages
Syntax:
[langCode]: {
  [os | 'other']: {
    compile: [
      { cmd: 'program', args: [...programArgs] },
      ...
    ],
    run: { cmd: 'compiledProgram', args: [...args] }
  }
}
Code is provided in stdin when running each compile stage,
and is also present in the working dir as a file 'code'
(during both run and compile stages)
 */

const compileRunCmd = {
    cpp: {
        other: {
            compile: [
                { cmd: 'g++', args: ['-x', 'c++', 'code', '-o', 'out', '-Wall', '-Wshadow',
                        '-O2', '-lm', '-m64', '-s', '-w', '-std=gnu++17', '-fmax-errors=512'] },
            ],
            run: {cmd: '$dir/out', args: []}
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

