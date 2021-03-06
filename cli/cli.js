// External dependencies
const fs = require('fs');
const { join, sep } = require('path');
const figlet = require('figlet');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

// Dependencies
const core = require('./core');
const questions = require('./questions');
const { pascalify, kebabcase } = require('./../helpers/tools');
const componentsFile = require('./../components.json'); // Load libraries DI
const { version, description } = require('./../package.json');

const initPath = join(`${__dirname}${sep}..${sep}templates`);

// Check if "templates" directory exist
if (!fs.existsSync(initPath)) {
  console.log(chalk.red('Templates directory is not exist !'));
  process.exit(1);
}

// Figlet
console.log(
  chalk.green(
    figlet.textSync('vue library', {
      font: 'big',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })
  )
);

console.log(chalk.green(`version : ${version}`));
console.log(chalk.green(description));
console.log('');
console.log('');

// Questions & treatments
inquirer.prompt(questions).then(async data => {
  let spinner;
  const indexVar = Object.keys(componentsFile).map(keys => {
    return keys;
  });

  data.componentName = kebabcase(data.componentName);
  data.list = indexVar;
  data.componentNamePascal = pascalify(data.componentName);
  data.version = version;

  // ** Add component **
  if (data.action === 'add') {
    // Push component into list
    data.list.push(data.componentName);

    // Editing registry
    console.log('✒️  Registry component in', chalk.yellow('components.json'));
    spinner = ora('Editing Registry...').start();
    await core.registryHandler(data);
    spinner.succeed(chalk.green('Component registred'));

    // Generating files
    console.log('🚀  Generating files');
    spinner = ora('Generating files...').start();
    await core.generateTemplate(data, initPath);
    spinner.succeed(chalk.green('Files generated'));
  }
  // ** Delete component **
  else if (data.action === 'delete') {
    if (!data.deleteConfirmation) {
      console.log(chalk.green('Deleting component aborted'));
      process.exit(0);
    }

    // Remove component into list
    const index = data.list.indexOf(data.componentName);
    if (~index) data.list.splice(index, 1);

    // Editing registry
    console.log(
      `✒️  Remove ${chalk.yellow(data.componentName)} component's registry in`,
      chalk.yellow('components.json')
    );
    spinner = ora('Editing Registry...').start();
    await core.registryHandler(data);
    spinner.succeed(chalk.green("Component's registry removed"));

    // Removing files & editing index.js for main library
    console.log('✒️  Remove files');
    spinner = ora('Files removing...').start();
    await core.removeFiles(data);
    await core.generateTemplate(data, join(initPath, 'src'), 'src');
    spinner.succeed(chalk.green('Files deleted'));
  }
});
