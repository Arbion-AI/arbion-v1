import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  ExternalLink,
  Info,
  Activity,
  ChevronDown,
  Plus,
  Calculator,
  Star,
  DeleteIcon,
} from "lucide-react";
import { ConfigAgentDialog } from "@/components/agents/swingXAgents/dialogs/configDialog";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipTrigger,
} from "@/components/ui/hybrid-tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import moment from "moment";
import {
  HyperLiquidOpenOrder,
  HyperLiquidPosition,
  TradingPair,
} from "@/types/swingx";
import { useAppSelector } from "@/store/hooks";
import {
  getOpenOrders,
  getSwingXStandardBalances,
  getSwingXStandardUserBasicInfo,
  runAnalysis,
  updateSwingXStandardAggressiveness,
} from "@/lib/swingxApis/swingxStandard.api";
import { getBinancePairs } from "@/lib/swingxApis/helper.api";
import { AboutAgent } from "../dialogs/aboutAgent";
import { EnabledAgentDialog } from "../dialogs/enabledAgentDialog";
import { ToggleTpSl } from "../dialogs/toggleTpSl";
import { SlidingNumber } from "@/components/ui/motion-primitives/slider-number";
import { AggressivenessLevelDialog } from "../dialogs/aggresivenessLevelDialog";
import { RevokeAgentDialog } from "../dialogs/revokeAgentDialog";

interface TokenPair extends TradingPair {
  coin?: string;
  size?: number;
  entryPrice?: number;
  unrealizedPnl?: number;
  positionValue?: number;
  leverage?: number;
  side?: string;
  entry_time?: string;
}

export function DesktopCard({
  model_version,
  name,
  description,
}: {
  model_version: string;
  name: string;
  description: React.ReactNode;
  frequency?: string;
}) {
  const [sliderValue, setSliderValue] = useState(0);

  const [showWarning, setShowWarning] = useState(false);
  const [pendingSliderValue, setPendingSliderValue] = useState<number | null>(
    null
  );
  const [newPositionMargin, setNewPositionMargin] = useState<string>("2");
  const [newPositionValue, setNewPositionValue] = useState<string>("10");
  const [isEnabled, setIsEnabled] = useState(false);
  const [hasAgent, setHasAgent] = useState<boolean>(false);
  const [execution_times, setExecutionTimes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"coins" | "settings" | "orders">(
    "coins"
  );
  const [marginToUse, setMarginToUse] = useState<number>(0.1);
  const loggedInUser = useAppSelector((state) => state.user.user);
  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);
  const [openOrders, setOpenOrders] = useState<HyperLiquidOpenOrder[]>([]);
  const [unrealizedPnl, setUnrealizedPnl] = useState<number>(0);

  const { data: dexUserBasicInfo } = useQuery({
    queryKey: ["dexUserBasicInfo", model_version],
    queryFn: async () => {
      const res = await getSwingXStandardUserBasicInfo();

      if (res[0]?.has_dex_keys) {
        setHasAgent(true);
      }

      if (res[0]?.trading_pairs?.length > 0) {
        setMarginToUse(res[0]?.margin_to_use || 0.1);
        setSliderValue(
          parseInt(Number((res[0]?.margin_to_use || 0.1) * 100).toFixed(0))
        );
        setIsEnabled(
          res[0]?.trading_pairs[0]?.asset_autotrading_active || false
        );
        setExecutionTimes(res[0]?.execution_times || []);
        setTokenPairs(res[0]?.trading_pairs || []);
      }

      return res;
    },
    enabled: !!(loggedInUser && loggedInUser.credentials),
  });

  const { data: dexBalances, isLoading: hyperLiquidBalancesLoading } = useQuery(
    {
      queryKey: ["hyperLiquidBalances", model_version],
      queryFn: async () => {
        const res = await getSwingXStandardBalances();
        return res;
      },
      enabled: !!(loggedInUser && loggedInUser.credentials),
    }
  );

  const { data: openOrdersPositions } = useQuery({
    queryKey: ["openOrdersPositions"],
    queryFn: async () => {
      const res = await getOpenOrders("hyperliquid", model_version);

      return res;
    },
    enabled: !!dexBalances,
  });

  useEffect(() => {
    if (openOrdersPositions) {
      const tokens = tokenPairs.map((pair) => {
        return {
          ...pair,
          ...openOrdersPositions.positions.find(
            (position) => position.coin === pair.asset
          ),
        };
      });

      const sortedTokens = tokens.sort(
        (a: TokenPair, b: TokenPair) =>
          (b.positionValue || 0) - (a.positionValue || 0)
      );

      setTokenPairs(sortedTokens);
      setOpenOrders(openOrdersPositions.open_orders);
      setUnrealizedPnl(
        openOrdersPositions.positions.reduce(
          (acc, order) => acc + (order.unrealizedPnl || 0),
          0
        )
      );
    }
  }, [openOrdersPositions]);

  // useEffect(() => {
  //   if (openOrders) {
  //     updateOrderTPSLMutation.mutate();
  //   }
  // }, [openOrders]);

  useEffect(() => {
    if (dexBalances && dexUserBasicInfo) {
      const newPositionMargin =
        (Number(dexBalances?.usdt_balance?.free || 0) * marginToUse) /
        dexUserBasicInfo[0]?.trading_pairs?.length;
      setNewPositionMargin(
        newPositionMargin < 2 ? "2" : newPositionMargin.toFixed(2)
      );
      const newPositionValue =
        ((Number(dexBalances?.usdt_balance?.free || 0) * marginToUse) /
          dexUserBasicInfo[0]?.trading_pairs?.length) *
        5;
      setNewPositionValue(
        newPositionValue < 10 ? "10" : newPositionValue.toFixed(2)
      );
    }
  }, [dexBalances, dexUserBasicInfo]);

  const queryClient = useQueryClient();

  const { mutate: updateAggressiveness } = useMutation({
    mutationFn: async () =>
      await updateSwingXStandardAggressiveness(
        "hyperliquid",
        sliderValue / 100,
        model_version
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dexUserBasicInfo"] });
    },
    onError: () => {
      toast.error("Failed to update aggressiveness");
      console.log("error");
    },
  });

  const { mutate: runAnalysisMutation, isPending: runAnalysisLoading } =
    useMutation({
      mutationFn: async () => await runAnalysis(),
      onSuccess: () => {
        toast.success("Analysis run successfully");
        queryClient.invalidateQueries({ queryKey: ["dexUserBasicInfo"] });
      },
      onError: () => {
        toast.error("Failed to run analysis");
        console.log("error");
      },
    });

  const handleAggressivenessUpdate = (newValue: number) => {
    if (newValue > marginToUse * 100 && newValue > 15) {
      setShowWarning(true);
      setPendingSliderValue(newValue);
    } else {
      setSliderValue(newValue);
      updateAggressiveness();
    }
  };

  const confirmHighAggressiveness = () => {
    if (pendingSliderValue !== null) {
      setSliderValue(pendingSliderValue);
      updateAggressiveness();
      setShowWarning(false);
      setPendingSliderValue(null);
    }
  };

  const { data: pairsIcons } = useQuery({
    queryKey: ["binancePairs"],
    queryFn: () => {
      const res = getBinancePairs();
      return res;
    },
    enabled: !!(
      dexUserBasicInfo &&
      dexUserBasicInfo.length > 0 &&
      dexUserBasicInfo?.[0].has_dex_keys
    ),
  });

  const [countdown, setCountdown] = useState<string>("");
  useEffect(() => {
    if (!isEnabled) return;

    const calculateNextExecution = () => {
      // Get current UTC time directly
      const now = new Date();
      const utcNow = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds()
        )
      );

      // Convert execution times to Date objects in UTC
      const executionDates = execution_times.map((time) => {
        const [hourStr, rest] = time.split(":");
        const hour = parseInt(hourStr);
        const minute = parseInt(rest.split(" ")[0]); // Always 28 minutes as per format "15:28 UTC

        const date = new Date(
          Date.UTC(
            utcNow.getUTCFullYear(),
            utcNow.getUTCMonth(),
            utcNow.getUTCDate(),
            hour,
            minute,
            0
          )
        );

        if (date < utcNow) {
          // If this time has already passed today, schedule for tomorrow
          date.setUTCDate(date.getUTCDate() + 1);
        }
        return date;
      });

      // Sort dates and find the next execution time
      const sortedDates = executionDates.sort(
        (a, b) => a.getTime() - b.getTime()
      );
      const nextExecution = sortedDates.find((date) => date > utcNow);

      if (!nextExecution) {
        return calculateDiff(sortedDates[0], utcNow);
      }

      return calculateDiff(nextExecution, utcNow);
    };

    const calculateDiff = (target: Date, current: Date) => {
      if (!target || !current) return "0s";

      const diff = target.getTime() - current.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      return parts.join(" ");
    };

    // Update every second
    const timer = setInterval(() => {
      setCountdown(calculateNextExecution());
    }, 1000);

    // Initial calculation
    setCountdown(calculateNextExecution());

    return () => clearInterval(timer);
  }, [isEnabled, execution_times]);
  const riskCalculator = (
    <Link
      to="/agents/swing-x/drawdown-calculator"
      state={{
        existingStartingCapital: Number(dexBalances?.usdt_balance?.free! || 0),
        existingMarginAllocation: marginToUse * 100,
        existingTradingPairs: tokenPairs
          ? tokenPairs.map((pair) => ({
              ...pair,
              leverage: 5,
            }))
          : [],
        coinList: pairsIcons,
      }}
    >
      <Button className="flex items-center gap-1 border-zinc-800/50 text-primary bg-primary/10">
        <Calculator className="w-4 h-4 text-colorAI" /> Risk Calculator
      </Button>
    </Link>
  );

  const coinsInConsensus = (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">
            Coins in Consensus
          </span>
          <HybridTooltip>
            <HybridTooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </HybridTooltipTrigger>
            <HybridTooltipContent>
              During analysis run, set the min no of coins the Agent must find
              an opportunity for in the same-direction before placing an order.
              Order will include only the coins in consensus.
            </HybridTooltipContent>
          </HybridTooltip>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm">1</span>
      </div>
    </div>
  );
  const gatewayCoin = (
    <div className="w-full">
      <div className="flex items-center  justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Gateway Coin</span>
          <HybridTooltip>
            <HybridTooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </HybridTooltipTrigger>
            <HybridTooltipContent>
              During analysis run, set the coin for which the Agent must have a
              trade opportunity for before placing an order.
            </HybridTooltipContent>
          </HybridTooltip>
        </div>
      </div>

      <div className="flex items-center gap-2 cursor-pointer">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={`data:image/svg+xml;base64,${btoa(
              pairsIcons?.icons["eth"] || ""
            )}`}
          />
          <AvatarFallback>ETH</AvatarFallback>
        </Avatar>
        ETH
      </div>
    </div>
  );
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-3">
          {/* Top row with title and main actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="text-colorAI" />
              <CardTitle className="text-xl">
                {name}
                <sub className="text-muted-foreground ml-1 font-normal text-xs">
                  v2.4
                </sub>
              </CardTitle>
              <AboutAgent
                trigger={
                  <Badge className="bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer">
                    Standard
                  </Badge>
                }
                description={
                  <>
                    {description}
                    <div className="mt-2">
                      New trade opportunities and existing open positions are
                      analyzed by the agent every two hours. If you manually
                      close a position from within Hyperliquid that was opened
                      by the agent, this will not stop the agent's processing of
                      other positions. The agent will continue to monitor all
                      coins for trading opportunities, regardless of which
                      positions were manually closed by you. If you edit a
                      position opened by the agent to give it a TP or a SL, the
                      agent will still continue to manage that position and may
                      close it prior to your TP or SL being triggered, based on
                      it's analysis of the position at the time.
                    </div>
                  </>
                }
              />
            </div>

            <div className="flex items-center gap-3">
              {dexUserBasicInfo?.[0]?.has_dex_keys && (
                <div className="w-full bg-secondary/50 p-2 whitespace-nowrap rounded-lg border border-zinc-800/50">
                  <a
                    href="https://app.hyperliquid.xyz/portfolio"
                    target="_blank"
                    className="flex items-center gap-2 text-xs justify-center text-colorAI font-medium"
                  >
                    View Hyperliquid Profile
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {riskCalculator}
              <div className="w-full bg-secondary/50 p-2 rounded-lg border border-zinc-800/50">
                <a
                  href="https://docs.google.com/spreadsheets/d/1UEYVsACDG79sGdE3gyg6UoaeVPGUeqdC9Q3BokX3Wxg/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-colorAI flex items-center"
                >
                  View Backtest <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>

              {tokenPairs[0] && (
                <EnabledAgentDialog
                  dexName="hyperliquid"
                  modelVersion={model_version}
                  isEnabled={tokenPairs[0].asset_autotrading_active}
                  isTpSlEnabled={dexUserBasicInfo?.[0]?.tp_sl_active}
                />
              )}
            </div>
          </div>
          {/* Recommended capital */}
          <div className="flex items-center gap-1 mt-2 text-sm">
            <span className="text-muted-foreground">
              Suggested Starting Capital:
            </span>
            <span className="font-medium">1000 USDC</span>
            <HybridTooltip>
              <HybridTooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </HybridTooltipTrigger>
              <HybridTooltipContent>
                Recommended minimum capital to start trading with this agent
              </HybridTooltipContent>
            </HybridTooltip>
          </div>

          {/* Middle row with equity and stats */}
          {!hasAgent ? (
            <div className="flex flex-col gap-2 justify-center mt-4">
              <ConfigAgentDialog
                isChangeConfig={false}
                hasKeys={false}
                dexName={"hyperliquid"}
                model_version={model_version}
              />
            </div>
          ) : (
            <>
              <div className="whitespace-nowrap flex flex-wrap gap-3">
                <div className="flex items-center p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      Total Equity
                      <HybridTooltip>
                        <HybridTooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </HybridTooltipTrigger>
                        <HybridTooltipContent>
                          Total current equity of your HyperLiquid account
                        </HybridTooltipContent>
                      </HybridTooltip>
                    </div>
                    <div className="text-xl font-semibold flex items-center gap-1">
                      {hyperLiquidBalancesLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        Number(dexBalances?.usdt_balance?.free || 0).toFixed(2)
                      )}
                      <span className="text-sm">USDC</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Unrealized PNL:{" "}
                      <span
                        className={cn(
                          "font-mono",
                          unrealizedPnl === 0
                            ? "text-primary"
                            : unrealizedPnl > 0
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        <HybridTooltip>
                          <HybridTooltipTrigger>
                            <span>${unrealizedPnl.toFixed(2)}</span>
                          </HybridTooltipTrigger>
                          <HybridTooltipContent>
                            Total unrealized PNL of your HyperLiquid account
                          </HybridTooltipContent>
                        </HybridTooltip>
                      </span>
                    </div>
                  </div>
                </div>

                {tokenPairs[0]?.asset_autotrading_active && (
                  <div className="flex items-center p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                    <div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        Next Run
                        <HybridTooltip>
                          <HybridTooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </HybridTooltipTrigger>
                          <HybridTooltipContent>
                            Analysis Scheduled Run Cycle: 2hr
                          </HybridTooltipContent>
                        </HybridTooltip>
                        <div className="font-medium">{countdown}</div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (dexUserBasicInfo?.[0]?.current_credits! > 0) {
                            runAnalysisMutation();
                          } else {
                            toast.error("Not enough credits");
                          }
                        }}
                        disabled={runAnalysisLoading}
                      >
                        Run Now{" "}
                        {runAnalysisLoading && (
                          <Loader2 className="h-3 w-3 animate-spin ml-1" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex items-center p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      Gateway Coin
                      <HybridTooltip>
                        <HybridTooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </HybridTooltipTrigger>
                        <HybridTooltipContent>
                          During analysis run, set the coin for which the Agent
                          must have a trade opportunity for before placing an
                          order
                        </HybridTooltipContent>
                      </HybridTooltip>
                    </div>
                    <div
                      className={cn(
                        "text-xl font-semibold flex items-center gap-1"
                      )}
                    >
                      <div className="flex items-center gap-1  cursor-pointer">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={`data:image/svg+xml;base64,${btoa(
                              pairsIcons?.icons["eth"] || ""
                            )}`}
                          />
                          <AvatarFallback>ETH</AvatarFallback>
                        </Avatar>
                        ETH
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      Coins in Consensus
                      <HybridTooltip>
                        <HybridTooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </HybridTooltipTrigger>
                        <HybridTooltipContent>
                          During analysis run, set the min number of coins for
                          which the Agent must find a same-direction trade
                          opportunity (Long or Short), before it can place an
                          order.
                        </HybridTooltipContent>
                      </HybridTooltip>
                    </div>
                    <div
                      className={cn(
                        "text-xl font-semibold flex items-center gap-1"
                      )}
                    >
                      <div className="flex items-center gap-1">
                        <span>1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex border-b mt-4 border-zinc-800/50">
                <Button
                  variant="ghost"
                  className={`pb-2 rounded-none ${
                    activeTab === "coins" ? "border-b-2 border-colorAI" : ""
                  }`}
                  onClick={() => setActiveTab("coins")}
                >
                  Coins ({tokenPairs.length})
                </Button>
                <Button
                  variant="ghost"
                  className={` pb-2 rounded-none ${
                    activeTab === "orders" ? "border-b-2 border-colorAI" : ""
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  Orders ({openOrders.length})
                </Button>
                <Button
                  variant="ghost"
                  className={`pb-2 rounded-none ${
                    activeTab === "settings" ? "border-b-2 border-colorAI" : ""
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Tab Navigation */}
      </CardHeader>

      {hasAgent && (
        <CardContent className="pt-0">
          {/* Overview tab */}
          {activeTab === "coins" && (
            <div className="space-y-3 mt-3">
              <div className="max-h-[270px] overflow-y-auto rounded-lg border border-zinc-800/50 bg-secondary/50">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coin</TableHead>
                      <TableHead className="text-center">Side</TableHead>
                      <TableHead className="text-center">Size</TableHead>
                      <TableHead className="text-center">
                        Position Value
                      </TableHead>
                      <TableHead className="text-center">Entry Price</TableHead>
                      <TableHead className="text-center">P/L</TableHead>
                      <TableHead className="text-center">Leverage</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokenPairs.length > 0 ? (
                      tokenPairs.map((pair, index) => {
                        const position = openOrdersPositions?.positions.find(
                          (position: HyperLiquidPosition) =>
                            position.coin === pair.asset
                        );
                        return (
                          <TableRow
                            key={index}
                            className={cn(
                              "cursor-pointer",
                              position?.unrealizedPnl &&
                                (position?.unrealizedPnl > 0
                                  ? "bg-green-500/10 text-green-500 border-green-500/30"
                                  : "bg-red-500/10  border-red-500/30"),
                              "text-center"
                            )}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar>
                                  <AvatarImage
                                    src={`data:image/svg+xml;base64,${btoa(
                                      pairsIcons?.icons[
                                        pair.asset.toLowerCase()
                                      ] || ""
                                    )}`}
                                  />
                                  <AvatarFallback>
                                    {pair.asset.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{pair.asset}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {position ? (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[8px] font-medium",
                                    position?.side === "long"
                                      ? "bg-green-500/20 text-green-500 border-green-500/30"
                                      : "bg-red-500/20 text-red-500 border-red-500/30"
                                  )}
                                >
                                  {position?.side}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "font-mono",
                                position?.size &&
                                  (position?.size > 0
                                    ? "text-green-500"
                                    : "text-red-500")
                              )}
                            >
                              {position?.size || "-"} {position?.coin}
                            </TableCell>
                            <TableCell className="font-mono">
                              ${position?.positionValue?.toFixed(2) || "0"}
                            </TableCell>
                            <TableCell className="font-mono">
                              ${position?.entryPrice?.toFixed(2) || "0"}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "font-mono",
                                position?.unrealizedPnl &&
                                  (position?.unrealizedPnl > 0
                                    ? "text-green-500"
                                    : "text-red-500")
                              )}
                            >
                              ${position?.unrealizedPnl?.toFixed(2) || "0"}
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                toast.success("Available in SwingX Pro")
                              }
                              className="cursor-pointer flex items-center justify-center my-2 gap-1"
                            >
                              <span>5x</span>
                              <Button
                                disabled
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                              ></Button>
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                toast.success("Available in SwingX Pro")
                              }
                            >
                              <div className="flex items-center gap-1 justify-center ">
                                <Button disabled size="icon" variant="ghost">
                                  <DeleteIcon
                                    size={16}
                                    className="text-red-500"
                                  />
                                </Button>{" "}
                                <HybridTooltip>
                                  <HybridTooltipTrigger>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="flex flex-col items-center gap-1"
                                    >
                                      <Star
                                        className="w-4 h-4"
                                        fill={
                                          pair.asset === "ETH"
                                            ? "yellow"
                                            : "none"
                                        }
                                        stroke={
                                          pair.asset === "ETH"
                                            ? "yellow"
                                            : "gray"
                                        }
                                      />
                                    </Button>
                                  </HybridTooltipTrigger>
                                  <HybridTooltipContent>
                                    During analysis run, set the coin for which
                                    the Agent must have a trade opportunity for
                                    before placing an order.
                                  </HybridTooltipContent>
                                </HybridTooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No coins selected
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div
                onClick={() => {
                  toast.success("Available in SwingX Pro");
                }}
              >
                <Button
                  className="w-full bg-secondary/50 py-6 rounded-lg border border-zinc-800/50"
                  variant="outline"
                  disabled
                >
                  Add Coin
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Link
                to="/agents/swing-x/drawdown-calculator"
                state={{
                  existingStartingCapital: Number(
                    dexBalances?.usdt_balance?.free! || 0
                  ),
                  existingMarginAllocation: marginToUse * 100,
                  existingTradingPairs: tokenPairs
                    ? tokenPairs.map((pair) => ({
                        ...pair,
                        leverage: 5,
                      }))
                    : [],
                  coinList: pairsIcons,
                }}
              >
                <Button
                  variant={"secondary"}
                  className="mt-2 w-full flex items-center justify-center gap-2 -lg border border-zinc-800/50"
                >
                  <Calculator className="w-4 h-4 text-colorAI" /> Calculate your
                  risk per coin
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
          {activeTab === "orders" && (
            <div className="space-y-3 mt-3">
              {/* Trading pairs display with icons */}
              <div className="max-h-[270px] overflow-y-auto rounded-lg border border-zinc-800/50 bg-secondary/50">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Time</TableHead>
                      <TableHead className="text-center">Coin</TableHead>
                      <TableHead className="text-center">Direction</TableHead>
                      <TableHead className="text-center">Size</TableHead>
                      <TableHead className="text-center">Order Value</TableHead>
                      <TableHead className="text-center">Price</TableHead>
                      <TableHead className="text-center">Reduce Only</TableHead>
                      <TableHead className="text-center">TP/SL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openOrders.length > 0 ? (
                      openOrders.map((order, index) => (
                        <TableRow key={index} className="text-center">
                          <TableCell className="font-medium whitespace-nowrap text-muted-foreground">
                            {moment(order.timestamp).format(
                              "MM/DD/YYYY - HH:mm:ss"
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.coin}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[9px] font-medium",
                                order.side === "long"
                                  ? "bg-green-500/20 text-green-500 border-green-500/30"
                                  : "bg-red-500/20 text-red-500 border-red-500/30"
                              )}
                            >
                              {order.side}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">
                            {formatNumber(order.size)}
                          </TableCell>
                          <TableCell className="font-mono">
                            ${formatNumber(+order.size * +order.price)}
                          </TableCell>
                          <TableCell
                            className="font-mono flex items-center justify-center gap-1"
                            onClick={() =>
                              toast.success("Available in SwingX Pro")
                            }
                          >
                            ${order.price}
                            <Button
                              disabled
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                            ></Button>
                          </TableCell>
                          <TableCell>
                            {order.reduce_only ? (
                              <Badge
                                variant="outline"
                                className="bg-blue-500/20 text-blue-500 border-blue-500/30"
                              >
                                Yes
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {order.type === "tp" ? (
                              <Badge
                                variant="outline"
                                className="bg-purple-500/20 text-purple-500 border-purple-500/30"
                              >
                                TP
                              </Badge>
                            ) : order.type === "sl" ? (
                              <Badge
                                variant="outline"
                                className="bg-red-500/20 text-red-500 border-red-500/30"
                              >
                                SL
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No open orders
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-3">
              <div className="w-full flex gap-3">
                <div className="space-y-4  w-full">
                  {/* TP/SL Toggle */}
                  <div className="flex items-center justify-between px-3 py-6 rounded-lg bg-secondary/50 border border-zinc-800/50">
                    <div className="flex items-center gap-1">
                      <span>Take Profit / Stop Loss</span>
                      <HybridTooltip>
                        <HybridTooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </HybridTooltipTrigger>
                        <HybridTooltipContent>
                          Enable or disable TP/SL for SwingX
                        </HybridTooltipContent>
                      </HybridTooltip>
                    </div>
                    <ToggleTpSl
                      isEnabled={dexUserBasicInfo?.[0]?.tp_sl_active}
                      model_version={model_version}
                    />
                  </div>
                  {/* Warning dialog */}
                  {showWarning && (
                    <Alert variant="destructive">
                      <AlertTitle>Risk Warning</AlertTitle>
                      <AlertDescription>
                        Increasing margin allocation increases your potential
                        for gains and losses.
                      </AlertDescription>
                      <div className="flex gap-2 mt-2">
                        {riskCalculator}
                        <Button
                          variant="destructive"
                          onClick={confirmHighAggressiveness}
                        >
                          Accept Risk
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowWarning(false);
                            setSliderValue(
                              +Number(marginToUse * 100).toFixed(0)
                            );
                            setPendingSliderValue(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Alert>
                  )}
                  {/* Margin allocation slider */}
                  <div className="space-y-2 p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span>Margin Allocation</span>
                        <HybridTooltip>
                          <HybridTooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </HybridTooltipTrigger>
                          <HybridTooltipContent>
                            This controls the % of your total equity used for
                            opening new positions.
                          </HybridTooltipContent>
                        </HybridTooltip>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm">1%</span>
                      <Slider
                        min={1}
                        max={30}
                        value={[sliderValue || Number(marginToUse * 100)]}
                        onValueChange={(value) => setSliderValue(value[0])}
                        onPointerUp={() =>
                          handleAggressivenessUpdate(sliderValue)
                        }
                        className="flex-1"
                      />
                      <span className="text-sm">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-full space-y-2 p-3 h-[90px] rounded-lg bg-secondary/50 border border-zinc-800/50">
                      {coinsInConsensus}
                    </div>
                    <div className="w-full space-y-2 p-3 h-[90px] rounded-lg bg-secondary/50 border border-zinc-800/50">
                      {gatewayCoin}
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <div className="w-full grid grid-cols-2 gap-3 p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Margin Allocation
                      </div>
                      <div className="font-medium">
                        {Number(marginToUse * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <span>Margin Allocated</span>
                        <HybridTooltip>
                          <HybridTooltipTrigger>
                            <Info className="h-3 w-3" />
                          </HybridTooltipTrigger>
                          <HybridTooltipContent>
                            Total equity allocated for trading
                          </HybridTooltipContent>
                        </HybridTooltip>
                      </div>
                      <div className="flex items-center gap-1 font-medium ">
                        <SlidingNumber
                          value={Number(
                            (
                              marginToUse *
                              (+dexBalances?.usdt_balance?.free! || 0)
                            ).toFixed(2)
                          )}
                        />{" "}
                        <span className="text-sm">USDC</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        No. of Coins
                      </div>
                      <div className="font-medium">{tokenPairs.length}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <span>New Position Margin</span>
                        <HybridTooltip>
                          <HybridTooltipTrigger>
                            <Info className="h-3 w-3" />
                          </HybridTooltipTrigger>
                          <HybridTooltipContent>
                            Amount of USDC risked per position
                          </HybridTooltipContent>
                        </HybridTooltip>
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <SlidingNumber value={+newPositionMargin} />
                        <span className="text-sm">USDC</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Leverage
                      </div>
                      <div className="font-medium">5x</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <span>New Position Value</span>
                        <HybridTooltip>
                          <HybridTooltipTrigger>
                            <Info className="h-3 w-3" />
                          </HybridTooltipTrigger>
                          <HybridTooltipContent>
                            Total value of your trade with leverage
                          </HybridTooltipContent>
                        </HybridTooltip>
                      </div>
                      <div className="flex items-center gap-1 font-medium ">
                        <SlidingNumber value={+newPositionValue} />
                        <span className="text-sm">USDC</span>
                      </div>
                    </div>
                  </div>
                  {/* Strategy/Risk selection */}
                  <div className="p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        Risk Profile
                      </span>
                      <AggressivenessLevelDialog
                        trigger={
                          <span className="text-[10px] whitespace-nowrap border-2 rounded-md px-3 py-2 text-red-500 font-extrabold flex items-center gap-2 shadow-lg hover:bg-red-500/20 hover:scale-105 cursor-pointer transition-all ">
                            READ ME <Info className="animate-pulse h-4 w-4" />
                          </span>
                        }
                      />
                      <div
                        onClick={() => {
                          toast.success("Available in SwingX Pro");
                        }}
                      >
                        <Button
                          variant="outline"
                          disabled
                          className="w-32 flex items-center justify-between text-yellow-500"
                        >
                          Moderate <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                {/* Performance link in analytics tab too */}
                <div className="w-full bg-secondary/50 p-2 rounded-lg border border-zinc-800/50">
                  <a
                    href="https://app.hyperliquid.xyz/portfolio"
                    target="_blank"
                    className="flex items-center gap-2 justify-center text-colorAI font-medium"
                  >
                    View Performance
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                {/* Config buttons */}

                <ConfigAgentDialog
                  isChangeConfig={true}
                  hasKeys={true}
                  dexName={"hyperliquid"}
                  model_version={model_version}
                />
                <RevokeAgentDialog
                  dexName={"hyperliquid"}
                  model_version={model_version}
                />
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// 0xdb58860aa15bd48f932fee67b44579b05878c9e0f91af03abe520bc9e716b2fb
