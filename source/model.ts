import { AssistantMessage, InterpreterMessage, SystemMessage, UserMessage } from '@acryps/interpreter';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index';

export class OpenAIModel {
	openAi: OpenAI;

	constructor(
		public model: string,
		public configuration?: any
	) {
		this.openAi = new OpenAI(configuration ?? {});
	}

	async execute(messages: InterpreterMessage[]) {
		const response = await this.openAi.chat.completions.create({
			model: this.model,
			messages: messages.map(message => OpenAIModel.serialize(message))
		});

		// The API returns an array of choices, take the first one
		return response.choices[0]?.message?.content ?? '';
	}

	static serialize(message: InterpreterMessage) {
		return {
			role: this.messageRole(message),
			content: message.message
		} as ChatCompletionMessageParam;
	}

	static messageRole(message: InterpreterMessage) {
		if (message instanceof SystemMessage) {
			return 'system';
		}

		if (message instanceof UserMessage) {
			return 'user';
		}

		if (message instanceof AssistantMessage) {
			return 'assistant';
		}

		throw new Error(`Unsupported message type '${message}'`);
	}
}
