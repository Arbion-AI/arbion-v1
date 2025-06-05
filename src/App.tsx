import {
  MessageSquare,
  Beaker,
  Activity,
  Database,
  Lock,
  Zap,
  Coins,
  FlaskRound as Flask,
} from "lucide-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import AgentBuilder from "./pages/AgentBuilder";
import AIChat from "./pages/AIChat";
import Agents from "./pages/Agents";
import Models from "./pages/Models";
import Staking from "./pages/Staking";
import Settings from "./pages/Settings";
import Labs from "./pages/Labs";
import { AgentProvider } from "./contexts/AgentContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { WalletProvider } from "./contexts/WalletContext";
import { TokenProvider } from "./contexts/TokenContext";

function App() {
  const navItems = [
    { name: "AI", path: "/", icon: <MessageSquare size={20} /> },
    { name: "Agent Builder", path: "/builder", icon: <Beaker size={20} /> },
    { name: "Dashboard", path: "/dashboard", icon: <Activity size={20} /> },
    { name: "Agents", path: "/agents", icon: <Zap size={20} /> },
    { name: "Models", path: "/models", icon: <Database size={20} /> },
    { name: "Staking", path: "/staking", icon: <Coins size={20} /> },
    { name: "Labs", path: "/labs", icon: <Flask size={20} /> },
    { name: "Settings", path: "/settings", icon: <Lock size={20} /> },
  ];

  return (
    <Router>
      <WalletProvider>
        <TokenProvider>
          <WebSocketProvider>
            <AgentProvider>
              <Layout navItems={navItems}>
                <Routes>
                  <Route path="/" element={<AIChat />} />
                  <Route path="/builder" element={<AgentBuilder />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/agents" element={<Agents />} />
                  <Route path="/models" element={<Models />} />
                  <Route path="/staking" element={<Staking />} />
                  <Route path="/labs" element={<Labs />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </AgentProvider>
          </WebSocketProvider>
        </TokenProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;
