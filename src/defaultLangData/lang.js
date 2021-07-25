// Code templates
const lang = [
    {label: 'C++', code: 'c', compileCode: 'cpp', template: `// Question: 

#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);
    
    // Your code here
    
    return 0;
}`},
    {label: 'JavaScript', code: 'javascript', compileCode: 'js', template: `// Question:

function qn(i) {
    
}`},
    {label: 'Python3', code: 'python', compileCode: 'python3', template: `# Question: 
import math
from sys import stdin, stdout

def qn(i):
    pass`}
];

export default lang;
