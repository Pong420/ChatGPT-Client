import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi
} from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

export const openai = new OpenAIApi(configuration);

export { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum };
// export const MessageRole = ChatCompletionRequestMessageRoleEnum;
// export type MessageRole = typeof MessageRole;

// export type ChatGPTMessage = ChatCompletionRequestMessage;
