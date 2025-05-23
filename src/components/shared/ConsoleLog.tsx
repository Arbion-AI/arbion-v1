import React, { useRef } from 'react';
import { useWebSocketContext } from '../../contexts/WebSocketContext';

const ConsoleLog: React.FC = () => {
  const { logMessages } = useWebSocketContext();
  const logEndRef = useRef<HTMLDivElement>(null);

  const getLogClassColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-primary';
    }
  };

  return (
    <div className="console-container h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-sm text-text-secondary">Showing {logMessages.length} log entries</span>
        </div>
        <div className="flex items-center">
          <button className="btn btn-glass text-xs py-1 px-2">
            Clear Logs
          </button>
        </div>
      </div>
      
      <div className="bg-background-dark rounded-lg p-3 flex-1 overflow-y-auto font-mono text-xs">
        <div className="h-full">
          {logMessages.map((log, index) => (
            <div key={index} className={`console-log ${getLogClassColor(log.type)} mb-1`}>
              <span className="opacity-70">[{log.timestamp}]</span> {log.message}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ConsoleLog;