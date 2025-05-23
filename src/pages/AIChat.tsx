import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Settings, Code, Share2, X, ChevronDown, Edit2, Key } from 'lucide-react';
import { getGeminiResponse } from '../lib/gemini';
import { generateAPISnippet } from '../lib/apiGenerator';
import CodeBlock from '../components/shared/CodeBlock';

const AIChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ type: string; content: string }>>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [promptExample, setPromptExample] = useState('For my Binance Account please make sure you buy ETH when stochastic RSI crossed on weekly timeframe');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [showCexApiSection, setShowCexApiSection] = useState(false);
  const [cexSecretKeys, setCexSecretKeys] = useState({
    binance: '',
    coinbase: '',
    bitget: ''
  });
  const [hasActiveApis, setHasActiveApis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (!showWelcome) {
      inputRef.current?.focus();
    }
  }, [messages, showWelcome]);

  useEffect(() => {
    if (isEditingPrompt && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [isEditingPrompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setMessages(prev => [...prev, { type: 'user', content: message }]);
    
    if (showWelcome) {
      setShowWelcome(false);
    }

    setIsLoading(true);

    try {
      const response = await getGeminiResponse(message);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: response
      }]);
      setTokenCount(prev => prev + message.length);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: "I apologize, but I'm having trouble processing your request at the moment. Please try again."
      }]);
    } finally {
      setIsLoading(false);
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleWelcomeClick = () => {
    setShowWelcome(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setShowModelDropdown(false);
  };

  const handleGenerateAPI = () => {
    setShowApiModal(true);
  };

  const handlePromptEdit = () => {
    setIsEditingPrompt(true);
  };

  const handlePromptSave = () => {
    setIsEditingPrompt(false);
  };

  const handleSecretKeyUpdate = (exchange: keyof typeof cexSecretKeys, value: string) => {
    setCexSecretKeys(prev => ({
      ...prev,
      [exchange]: value
    }));
  };

  const handleSaveApiKeys = () => {
    // Save API keys to local storage or your preferred storage method
    localStorage.setItem('cexApiKeys', JSON.stringify(cexSecretKeys));
    
    // Check if any API key is set
    const hasKeys = Object.values(cexSecretKeys).some(key => key.length > 0);
    setHasActiveApis(hasKeys);
    
    // Close the panel
    setShowCexApiSection(false);
  };

  const apiConfig = {
    baseUrl: 'https://api.arbion.org',
    apiKey: 'YOUR_API_KEY',
    model: selectedModel,
    temperature: temperature
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="glass-card flex-1 flex flex-col min-h-0 relative">
          {/* Top Bar */}
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h1 className="text-lg font-medium">Chat Prompt</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCexApiSection(!showCexApiSection)}
                className="btn btn-glass p-2"
              >
                <Key size={20} className={hasActiveApis ? 'text-primary' : ''} />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn btn-glass p-2"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Welcome Message */}
          <div 
            className={`absolute inset-0 z-10 flex items-center justify-center bg-card transition-all duration-500 ${
              showWelcome ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={handleWelcomeClick}
          >
            <div className="text-center p-6 transform transition-transform duration-500 scale-100">
              <div className="flex flex-col items-center">
                <img src="/log.png" alt="Arbion AI" className="w-12 h-12 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Welcome to Arbion AI Studio</h1>
                <p className="text-text-secondary text-sm">Experiment with AI and explore trading strategies</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3 ${
                    msg.type === 'user'
                      ? 'bg-primary text-background ml-4'
                      : 'bg-background-light mr-4'
                  }`}
                >
                  {msg.type === 'assistant' && (
                    <div className="flex items-center mb-2">
                      <img src="/log.png" alt="Arbion AI" className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Arbion AI</span>
                    </div>
                  )}
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 space-y-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What is current btc price?"
                className="flex-1 glass-input bg-background-light text-text placeholder-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
                disabled={isLoading}
                autoComplete="off"
                spellCheck="false"
              />
              <button 
                type="submit" 
                className={`btn btn-primary p-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!message.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                <span className="sr-only">Send message</span>
              </button>
            </form>

            <div className="flex justify-between items-center gap-4">
              <button 
                className="btn btn-glass text-xs flex items-center gap-2 flex-1"
                onClick={handleGenerateAPI}
              >
                <Code size={14} />
                Generate API
              </button>
              <button className="btn btn-glass text-xs flex items-center gap-2 flex-1">
                <Share2 size={14} />
                Share Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CEX API Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 transform transition-transform duration-300 ease-in-out ${
          showCexApiSection ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        <div className="glass-card h-full overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">CEX API Settings</h2>
              <button 
                onClick={() => setShowCexApiSection(false)}
                className="p-1 hover:bg-background-light rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Binance */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Binance</h3>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Secret Key</label>
                  <input
                    type="password"
                    value={cexSecretKeys.binance}
                    onChange={(e) => handleSecretKeyUpdate('binance', e.target.value)}
                    className="glass-input w-full text-sm"
                    placeholder="Enter Binance Secret Key"
                  />
                </div>
              </div>

              {/* Coinbase */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Coinbase</h3>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Secret Key</label>
                  <input
                    type="password"
                    value={cexSecretKeys.coinbase}
                    onChange={(e) => handleSecretKeyUpdate('coinbase', e.target.value)}
                    className="glass-input w-full text-sm"
                    placeholder="Enter Coinbase Secret Key"
                  />
                </div>
              </div>

              {/* Bitget */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Bitget</h3>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Secret Key</label>
                  <input
                    type="password"
                    value={cexSecretKeys.bitget}
                    onChange={(e) => handleSecretKeyUpdate('bitget', e.target.value)}
                    className="glass-input w-full text-sm"
                    placeholder="Enter Bitget Secret Key"
                  />
                </div>
              </div>

              <button 
                className="btn btn-primary w-full"
                onClick={handleSaveApiKeys}
              >
                Save API Keys
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 transform transition-transform duration-300 ease-in-out ${
          showSettings ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        <div className="glass-card h-full overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Run Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-background-light rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <div 
                  className="glass-input flex justify-between items-center cursor-pointer relative"
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                >
                  <span>{selectedModel}</span>
                  <ChevronDown size={16} className={`transform transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Token count</label>
                  <span className="text-sm text-text-secondary">{tokenCount} / 1,000,000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Temperature</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-text-secondary mt-1">
                  <span>Precise</span>
                  <span>{temperature}</span>
                  <span>Creative</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Prompt</label>
                  <button
                    onClick={isEditingPrompt ? handlePromptSave : handlePromptEdit}
                    className="text-primary hover:text-primary-dark"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
                {isEditingPrompt ? (
                  <textarea
                    ref={promptInputRef}
                    value={promptExample}
                    onChange={(e) => setPromptExample(e.target.value)}
                    className="glass-input w-full h-24 text-sm resize-none"
                    onBlur={handlePromptSave}
                  />
                ) : (
                  <div className="glass-input w-full min-h-[6rem] text-sm p-3 cursor-pointer" onClick={handlePromptEdit}>
                    {promptExample}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setShowTools(!showTools)}
                  className="flex justify-between items-center w-full text-sm font-medium"
                >
                  <span>Tools</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${showTools ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {showTools && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Structured output</span>
                        <button className="text-xs text-primary ml-2">
                          <Edit2 size={12} />
                        </button>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" id="structuredOutput" />
                        <label
                          htmlFor="structuredOutput"
                          className="block w-10 h-6 rounded-full bg-background-light cursor-pointer transition-colors duration-200 ease-in-out"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm">Code execution</span>
                      </div>
                      <div className="relative">
                        <input type="checkbox" className="sr-only" id="codeExecution" />
                        <label
                          htmlFor="codeExecution"
                          className="block w-10 h-6 rounded-full bg-background-light cursor-pointer transition-colors duration-200 ease-in-out"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="flex justify-between items-center w-full text-sm font-medium"
                >
                  <span>Advanced settings</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {showAdvancedSettings && (
                  <div className="mt-2 space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Safety settings</label>
                      <button className="text-primary text-sm">Edit</button>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">Add stop sequence</label>
                      <input
                        type="text"
                        placeholder="Add stop..."
                        className="glass-input w-full text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">Output length</label>
                      <input
                        type="number"
                        value="8192"
                        className="glass-input w-full text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="glass w-full max-w-3xl rounded-xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">API Integration</h2>
                <button 
                  onClick={() => setShowApiModal(false)}
                  className="p-2 hover:bg-background-light rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-2">
                  {['curl', 'python', 'node'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`btn ${
                        selectedLanguage === lang ? 'btn-primary' : 'btn-glass'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <CodeBlock
                  code={generateAPISnippet(selectedLanguage, apiConfig)}
                  language={selectedLanguage.toUpperCase()}
                />

                <div className="bg-background-light rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Quick Start Guide</h3>
                  <ol className="list-decimal list-inside text-sm text-text-secondary space-y-2">
                    <li>Sign up for an API key in your account settings</li>
                    <li>Replace YOUR_API_KEY with your actual API key</li>
                    <li>Make requests to our API endpoint</li>
                    <li>Handle the response in your application</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChat;