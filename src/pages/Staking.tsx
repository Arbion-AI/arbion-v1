import React, { useState } from 'react';
import { Coins, Lock, Timer, ArrowRight, Info, ChevronDown } from 'lucide-react';

const Staking: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  const stakingPools = [
    {
      id: 'pool-1',
      name: '30 Days Lock',
      apr: 12,
      lockPeriod: 30,
      minStake: 100,
      totalStaked: 0,
      yourStake: 0
    },
    {
      id: 'pool-2',
      name: '90 Days Lock',
      apr: 24,
      lockPeriod: 90,
      minStake: 250,
      totalStaked: 0,
      yourStake: 0
    },
    {
      id: 'pool-3',
      name: '180 Days Lock',
      apr: 36,
      lockPeriod: 180,
      minStake: 500,
      totalStaked: 0,
      yourStake: 0
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Staking</h1>
          <p className="text-text-secondary mt-1">Stake $ARAI tokens to earn rewards</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card">
          <div className="flex items-center">
            <div className="bg-primary bg-opacity-20 p-2 rounded-lg mr-3">
              <Coins size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Value Locked</p>
              <h3 className="text-xl font-bold">$0</h3>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center">
            <div className="bg-primary bg-opacity-20 p-2 rounded-lg mr-3">
              <Lock size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total ARAI Staked</p>
              <h3 className="text-xl font-bold">0 ARAI</h3>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center">
            <div className="bg-primary bg-opacity-20 p-2 rounded-lg mr-3">
              <Timer size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Your Rewards</p>
              <h3 className="text-xl font-bold">0 ARAI</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Staking Pools */}
      <div className="glass-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Staking Pools</h2>
          <button 
            className="text-text-secondary hover:text-text flex items-center"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info size={16} className="mr-1" />
            How it works
          </button>
        </div>

        <div className="space-y-4">
          {stakingPools.map((pool) => (
            <div 
              key={pool.id}
              className={`glass-card cursor-pointer transition-all ${
                selectedPool === pool.id ? 'border-primary' : ''
              }`}
              onClick={() => setSelectedPool(pool.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{pool.name}</h3>
                  <p className="text-text-secondary text-sm mt-1">
                    Min. Stake: {pool.minStake} ARAI
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-primary text-xl font-bold">{pool.apr}% APR</p>
                  <p className="text-text-secondary text-sm">
                    {pool.lockPeriod} Days Lock
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Total Staked</span>
                  <span>{pool.totalStaked.toLocaleString()} ARAI</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-text-secondary">Your Stake</span>
                  <span>{pool.yourStake.toLocaleString()} ARAI</span>
                </div>
              </div>

              {selectedPool === pool.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Enter amount to stake"
                      className="glass-input flex-1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <button className="btn btn-primary flex items-center">
                      Stake
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Your Staking Positions */}
      <div className="glass-card">
        <h2 className="text-lg font-medium mb-4">Your Staking Positions</h2>
        <div className="text-center py-8 text-text-secondary">
          <p>You don't have any active staking positions</p>
          <button className="btn btn-primary mt-4">Start Staking</button>
        </div>
      </div>
    </div>
  );
};

export default Staking;