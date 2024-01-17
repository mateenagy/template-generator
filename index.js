#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const generateFile = (answers, name, fileName, extension, content) => {
	fs.writeFile(path.join(process.cwd(), answers.template.output, name, `${fileName}.${extension}`), content, (err, data) => {
		if (err) {
			console.error(err);

			return;
		}

		console.log(chalk.green(chalk.bold(`${fileName}.${extension}`) + ' created'));
	})
}

const CHOICES = [
	{
		name: 'Page',
		value: {
			postfix: 'Page',
			name: 'page.vue',
			stringReplacer: '__NAME__',
			output: 'src/pages'
		}
	},
	{
		name: 'Component',
		value: {
			postfix: 'Component',
			name: 'page.vue',
			stringReplacer: '__NAME__',
			output: 'src/components'
		}
	},
	{
		name: 'Store',
		value: {
			postfix: 'Store',
			name: 'store.ts',
			stringReplacer: '__NAME__',
			output: 'src/store'
		}
	},
	{
		name: 'Request',
		value: {
			postfix: 'Request',
			name: 'request.ts',
			stringReplacer: '__NAME__',
			output: 'src/services/requests'
		}
	}
]

inquirer
	.prompt([
		{
			name: 'template',
			type: 'list',
			message: 'What project template would you like to generate?',
			choices: CHOICES,
		},
		{
			name: 'interface',
			type: 'list',
			message: 'Generate interface?',
			when: (answers) => answers.template.name !== 'page.vue',
			choices: [
				{
					name: 'Yes',
					value: true,
				},
				{
					name: 'No',
					value: false,
				},
			],
		},
		{
			name: 'scss',
			type: 'list',
			message: 'Generate SCSS?',
			when: (answers) => answers.template.name === 'page.vue',
			choices: [
				{
					name: 'Yes',
					value: true,
				},
				{
					name: 'No',
					value: false,
				},
			],
		},
		{
			name: 'name',
			type: 'input',
			message: 'Name:',
		},
	])
	.then((answers) => {
		// Read template file
		fs.readFile(path.join(__dirname, 'templates', answers.template.name), (err, data) => {
			if (err) {
				console.error(err);

				return
			}

			// Get extension
			const extension = answers.template.name.split(/\.(?=[^.]+$)/)[1];

			// Get file content
			let file = data.toString('utf8');
			// Replace names
			const replaceRegex = new RegExp(answers.template.stringReplacer, 'gm');
			file = file.replace(replaceRegex, answers.name);
			// Set filename
			const fileName = `${answers.name}${answers.template.postfix}`;
			// Set target path
			const targetPath = path.join(process.cwd(), answers.template.output, fileName)
			// If path don't exist create
			if (!fs.existsSync(targetPath)) {
				fs.mkdir(targetPath, (err) => {
					if (err) {
						console.error(err);
					}

					if (answers.interface) {
						generateFile(answers, fileName, `${fileName}.interface`, extension, '');
					}
		
					if (answers.scss) {
						generateFile(answers, fileName, `${fileName}`, 'scss', '');
						file = file.replace(/src=""/gm, `src="./${fileName}.scss"`);
					}
		
					generateFile(answers, fileName, `${fileName}`, extension, file);
				})
			}
		})
	})
	.catch((error) => {
		console.log(error);
		if (error.isTtyError) {
			// Prompt couldn't be rendered in the current environment
		} else {
			// Something else went wrong
		}
	});
