import React, { createContext, useState, useContext, useEffect } from 'react';

interface LogMessage {
  message: string;
  timestamp: string;
  type: string;
}

interface WebSocketContextProps {
  isConnected: boolean;
  logMessages: LogMessage[];
  sendMessage: (message: object) => void;
}

const getFormattedTimestamp = () => {
  return new Date().toISOString().split('T')[1].slice(0, 8);
};

// Mock log messages for demonstration
const initialLogs: LogMessage[] = [
  { message: 'System initialized', timestamp: getFormattedTimestamp(), type: 'info' },
  { message: 'Connected to Ethereum network', timestamp: getFormattedTimestamp(), type: 'success' },
  { message: 'Agent ETH-BTC Arbitrage started', timestamp: getFormattedTimestamp(), type: 'info' }
];

// Mock WebSocket operations
const WebSocketContext = createContext<WebSocketContextProps>({
  isConnected: false,
  logMessages: [],
  sendMessage: () => {}
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [logMessages, setLogMessages] = useState<LogMessage[]>(initialLogs);
  
  // Simulate WebSocket connection
  useEffect(() => {
    // Simulate connection
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
      addLogMessage('WebSocket connection established', 'success');
    }, 1000);
    
    // Simulate periodic messages
    const messageInterval = setInterval(() => {
      if (isConnected) {
        const messages = [
          'Scanning market opportunities...',
          'Analyzing price data for arbitrage opportunities',
          'Checking gas prices on Ethereum network',
          'Executing trade: Buy 0.15 ETH @ $3,204.35',
          'Transaction confirmed: 0x7a2b...3c4d',
          'Calculated profit: +$12.47 (0.38%)',
          'Updating agent performance metrics'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addLogMessage(randomMessage, 'info');
      }
    }, 5000);
    
    return () => {
      clearTimeout(connectTimeout);
      clearInterval(messageInterval);
    };
  }, [isConnected]);
  
  const addLogMessage = (message: string, type: string = 'info') => {
    const newLog = {
      message,
      timestamp: getFormattedTimestamp(),
      type
    };
    
    setLogMessages(prev => [...prev, newLog]);
  };
  
  const sendMessage = (message: object) => {
    // In a real app, this would send to an actual WebSocket
    console.log('Sending message:', message);
    addLogMessage(`Sent: ${JSON.stringify(message).substring(0, 50)}...`, 'info');
  };
  
  return (
    <WebSocketContext.Provider value={{ isConnected, logMessages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);