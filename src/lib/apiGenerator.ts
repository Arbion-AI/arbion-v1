import { APIConfig } from '../types/api';

const generateCurlSnippet = (config: APIConfig): string => {
  return `curl -X POST \\
  '${config.baseUrl}/v1/chat/completions' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer ${config.apiKey}' \\
  -d '{
    "model": "${config.model}",
    "messages": [
      {
        "role": "user",
        "content": "Your message here"
      }
    ],
    "temperature": ${config.temperature}
  }'`;
};

const generatePythonSnippet = (config: APIConfig): string => {
  return `import requests

url = '${config.baseUrl}/v1/chat/completions'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${config.apiKey}'
}
data = {
    'model': '${config.model}',
    'messages': [
        {
            'role': 'user',
            'content': 'Your message here'
        }
    ],
    'temperature': ${config.temperature}
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`;
};

const generateNodeSnippet = (config: APIConfig): string => {
  return `const response = await fetch('${config.baseUrl}/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer ${config.apiKey}\`
  },
  body: JSON.stringify({
    model: '${config.model}',
    messages: [
      {
        role: 'user',
        content: 'Your message here'
      }
    ],
    temperature: ${config.temperature}
  })
});

const data = await response.json();
console.log(data);`;
};

export const generateAPISnippet = (language: string, config: APIConfig): string => {
  switch (language.toLowerCase()) {
    case 'curl':
      return generateCurlSnippet(config);
    case 'python':
      return generatePythonSnippet(config);
    case 'node':
      return generateNodeSnippet(config);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};