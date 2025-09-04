import { createWriteStream } from 'fs';
import OpenAI from 'openai';

const writer = createWriteStream('../source/models.ts');
writer.write(`import { OpenAIModel } from "./model";\n\n`);

writer.write(`// automatically generated on ${new Date().toDateString()}\n`);
writer.write(`// works as a reference to quickly use a model, but any model can be used by using the \`OpenAIModel\` base class\n\n`);

const openai = new OpenAI();

for (let model of await openai.models.list().then(response => response.data)) {
	const name = model.id;

	let className = name
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.substring(1))
		.join('')
		.replace(/[^0-9a-zA-Z]/g, '_');

	writer.write(`export class ${className}Model extends OpenAIModel {\n`);
	writer.write(`\tconstructor(\n`);

	writer.write(`\t\tconfiguration?: any\n`);
	writer.write(`\t) {\n`);
	writer.write(`\t\tsuper(`);
	writer.write(`'${name}'`);
	writer.write(`, configuration);\n`);
	writer.write('\t}\n');
	writer.write('}\n\n');
}
