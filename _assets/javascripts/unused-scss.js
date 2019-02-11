// Find unused SCSS variables
// to use: 
// In the command line, navigate to the /javascripts directory and run:
// node unused-scss.js

const path = require('path');
const fs = require('fs');

const testVar = /^\$/;
const exclude = ('variables,all,main').split(',').map(s => `${s}.scss`);
const dir = path.join(__dirname, '../', 'stylesheets');

const varFiles = [
  path.join(dir, 'variables', 'uswds.scss'),
  path.join(dir, 'variables', 'all.scss')
];
const vars = getVars(varFiles);
const files = getFiles(dir);

console.log(findUnused(files, vars));

function findUnused(files, vars) { 
  const unused = [];
  vars.forEach((v) => { 
    if (!files.some(filePath => hasVar(filePath, v))) {
      unused.push(v);
    }
  });
  return unused;
}

function hasVar(filePath, v) { 
  return fs.readFileSync(filePath).toString().indexOf(v) > -1;
}

function getVars(varFiles) { 
  let vars = [];
  varFiles.forEach((filePath) => { 
    const lines = fs.readFileSync(filePath).toString().split('\n').filter(line => testVar.test(line)).map(line => line.split(':')[ 0 ]);
    vars = [ ...vars, ...lines ];
  });
  return vars;
}

function getFiles (dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function (file) {
    if (exclude.includes(file)) {
      return;
    }
    const filePath = path.resolve(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = getFiles(filePath, filelist);
    } else {
      filelist.push(filePath);
    }
  });
  return filelist;
};