import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-background-light hover:bg-background text-text-secondary hover:text-text transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="bg-background-dark rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <pre className="whitespace-pre-wrap">{code}</pre>
      </div>
      <div className="absolute left-2 bottom-2">
        <span className="text-xs text-text-secondary">{language}</span>
      </div>
    </div>
  );
};

export default CodeBlock;