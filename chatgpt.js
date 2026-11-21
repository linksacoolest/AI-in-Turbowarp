(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This ChatGPT extension must run unsandboxed');
  }

  // Paste your OpenAI API key between the single quotes below:
  const API_KEY = 'YOUR KEY HERE';

  class ChatGPTExtension {
    getInfo() {
      return {
        id: 'customchatgpt',
        name: 'ChatGPT',
        color1: '#10a37f',
        blocks: [
          {
            opcode: 'generateText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Generate text with prompt: [PROMPT]',
            arguments: {
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, how are you?'
              }
            }
          }
        ]
      };
    }

    async generateText(args) {
      const promptText = Scratch.Cast.toString(args.PROMPT);

      if (!API_KEY || API_KEY === 'YOUR KEY HERE') {
        return 'Error: Please paste your OpenAI API key into the code.';
      }

      const endpoint = 'https://' + 'api.' + 'openai.com' + '/v1/chat/completions';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'user', content: promptText }
            ]
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          return 'API Error: ' + (errorData.error?.message || response.statusText);
        }

        const data = await response.json();
        return data.choices.at(0).message.content.trim();
      } catch (error) {
        return 'Network Error: ' + error.message;
      }
    }
  }

  Scratch.extensions.register(new ChatGPTExtension());
})(Scratch);
