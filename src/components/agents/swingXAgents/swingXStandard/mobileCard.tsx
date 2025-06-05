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
import {
  getSwingXStandardBalances,
  getOpenOrders,
  getSwingXStandardUserBasicInfo,
  updateSwingXStandardAggressiveness,
} from "@/lib/swingxApis/swingxStandard.api";
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
import { SlidingNumber } from "@/components/ui/motion-primitives/slider-number";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  HyperLiquidOpenOrder,
  HyperLiquidPosition,
  TradingPair,
} from "@/types/swingx";
import { useAppSelector } from "@/store/hooks";
import { getBinancePairs } from "@/lib/swingxApis/helper.api";
import { AboutAgent } from "../dialogs/aboutAgent";
import { Link } from "react-router-dom";
import { EnabledAgentDialog } from "../dialogs/enabledAgentDialog";
import { ToggleTpSl } from "../dialogs/toggleTpSl";
import { AggressivenessLevelDialog } from "../dialogs/aggresivenessLevelDialog";
import { RevokeAgentDialog } from "../dialogs/revokeAgentDialog";

export interface TokenPair extends TradingPair {
  coin?: string;
  size?: number;
  entryPrice?: number;
  unrealizedPnl?: number;
  positionValue?: number;
  leverage?: number;
  side?: string;
  entry_time?: string;
}

export function MobileCard({
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
  const [execution_times, setExecutionTimes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "coins" | "settings" | "analytics" | "orders"
  >("coins");
  const [marginToUse, setMarginToUse] = useState<number>(0.1);
  const loggedInUser = useAppSelector((state) => state.user.user);

  const [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);
  const [openOrders, setOpenOrders] = useState<HyperLiquidOpenOrder[]>([]);
  const [unrealizedPnl, setUnrealizedPnl] = useState<number>(0);

  const { data: dexUserBasicInfo, isLoading: dexUserBasicInfoLoading } =
    useQuery({
      queryKey: ["dexUserBasicInfoMobile", model_version],
      queryFn: async () => {
        const res = await getSwingXStandardUserBasicInfo();

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
    refetchInterval: 30000,
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
      queryClient.invalidateQueries({
        queryKey: ["dexUserBasicInfoMobile", model_version],
      });
    },
    onError: () => {
      toast.error("Failed to update aggressiveness");
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
  const renderToken = (pair: TokenPair, index: number) => {
    const position = openOrdersPositions?.positions.find(
      (position: HyperLiquidPosition) => position.coin === pair.asset
    );
    return (
      <div className="flex items-center gap-2 justify-between">
        <span className={`flex items-center gap-2`}>
          <span className="text-xs text-muted-foreground">{index + 1}.</span>
          <Avatar className="border w-8 h-8">
            <AvatarImage
              src={`data:image/svg+xml;base64,${btoa(
                pairsIcons?.icons[pair.asset.toLowerCase()] || ""
              )}`}
            />
            <AvatarFallback>{pair.asset.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-1">
              <span className="font-mono">{position?.size}</span>
              <span>{pair.asset}</span>
              {position && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[8px] font-medium px-1",
                    position?.side === "long"
                      ? "bg-green-500/20 text-green-500 border-green-500/30"
                      : "bg-red-500/20 text-red-500 border-red-500/30"
                  )}
                >
                  {position?.side.slice(0, 1).toUpperCase()}{" "}
                  <span>
                    {position?.unrealizedPnl < 0 ? (
                      <span className={`text-red-500`}>
                        {position?.unrealizedPnl > 0 ? "+" : "-"}$
                        {position?.unrealizedPnl
                          .toFixed(1)
                          .slice(
                            1,
                            String(position?.unrealizedPnl.toFixed(1)).length
                          )}
                      </span>
                    ) : (
                      <span
                        className={`$
                            "text-red-500"
                        `}
                      >
                        +$
                        {position?.unrealizedPnl.toFixed(1)}
                      </span>
                    )}
                  </span>
                </Badge>
              )}
            </span>
          </span>
        </span>

        <div
          className="flex items-center gap-1"
          onClick={() => toast.success("Available in SwingX Pro")}
        >
          <div className="flex flex-col items-center gap-1 mr-1">
            <span className="flex items-center gap-1">
              <span>5x</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toast.success("Changing Available in SwingX Pro");
            }}
            className="flex flex-col items-center gap-1 "
          >
            <Star
              className="w-4 h-4"
              fill={pair.asset === "ETH" ? "yellow" : "none"}
              stroke={pair.asset === "ETH" ? "yellow" : "gray"}
            />
          </Button>

          <Button disabled size="icon" variant="ghost">
            <DeleteIcon size={16} className="text-red-500" />
          </Button>
        </div>
      </div>
    );
  };

  const renderOrder = (order: HyperLiquidOpenOrder, index: number) => {
    return (
      <div className="flex items-center gap-2 justify-between">
        <span className={`flex items-center gap-2`}>
          <span className="text-xs text-muted-foreground">{index + 1}.</span>

          <span className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-1">
              <span className="font-mono whitespace-nowrap">
                {formatNumber(order.size)}
              </span>

              <span className="text-xs text-muted-foreground">
                {order.coin}
              </span>
              {order.side && (
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
              )}
            </span>
          </span>
        </span>

        <div
          className="flex items-center gap-1"
          onClick={() => toast.success("Available in SwingX Pro")}
        >
          <div className="flex items-center gap-1 mr-4">
            <span className="text-xs text-muted-foreground">
              {order.type?.toUpperCase()}:
            </span>
            ${order.price}
          </div>
        </div>
      </div>
    );
  };

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

      const parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);

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

  const coinsInConsensus = (
    <div className="w-full flex flex-col gap-2">
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

      <div className="flex items-center gap-2 opacity-50">
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

      <div
        className="flex items-center gap-2 opacity-50 cursor-pointer"
        onClick={() => {
          toast.success("Available in SwingX Pro");
        }}
      >
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
    <Card className="w-full max-w-md flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-2">
            <Activity className="text-colorAI" />
            <CardTitle className="text-xl ">
              {name}
              <sub className="text-muted-foreground ml-1 font-normal text-xs">
                v2.4
              </sub>
            </CardTitle>
            <AboutAgent
              trigger={
                <Badge className="text-xs bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer">
                  Standard
                </Badge>
              }
              description={
                <>
                  {description}
                  <div className="mt-2">
                    New trade opportunities and existing open positions are
                    analyzed by the agent every two hours. If you manually close
                    a position from within Hyperliquid that was opened by the
                    agent, this will not stop the agent's processing of other
                    positions. The agent will continue to monitor all coins for
                    trading opportunities, regardless of which positions were
                    manually closed by you. If you edit a position opened by the
                    agent to give it a TP or a SL, the agent will still continue
                    to manage that position and may close it prior to your TP or
                    SL being triggered, based on it's analysis of the position
                    at the time.
                  </div>
                </>
              }
            />
          </div>
          <Link
            to="/agents/swing-x/drawdown-calculator"
            state={{
              existingStartingCapital: Number(
                dexBalances?.usdt_balance?.free! || 0
              ),
              existingMarginAllocation: marginToUse * 100,
              existingTradingPairs: dexUserBasicInfo?.[0]?.trading_pairs || [],
              coinList: pairsIcons,
            }}
          >
            <Calculator className="w-4 h-4 text-colorAI" />
          </Link>
        </div>

        {/* Recommended capital */}
        <div className="flex flex-col  gap-1 mt-2 text-sm">
          <a
            href="https://docs.google.com/spreadsheets/d/1UEYVsACDG79sGdE3gyg6UoaeVPGUeqdC9Q3BokX3Wxg/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-colorAI"
          >
            View Backtest <ExternalLink className="h-3 w-3 inline" />
          </a>

          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">
              Suggested Starting Capital:
            </span>
            <span className="font-medium">1000 USDC</span>
            <HybridTooltip>
              <HybridTooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </HybridTooltipTrigger>
              <HybridTooltipContent>
                This starting size is recommended because the min position size
                in Hyperliquid is 10 USDC, and SwingX can open as many as 16
                open positions at a time. You may choose to start with any size
                you wish however.
              </HybridTooltipContent>
            </HybridTooltip>
          </div>
        </div>

        {dexUserBasicInfoLoading ? (
          <div className="flex justify-center mt-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              Connecting to Hyperliquid...{" "}
              <Loader2 className="h-4 w-4 animate-spin" />
            </p>
          </div>
        ) : !dexUserBasicInfo ||
          dexUserBasicInfo.length === 0 ||
          !dexUserBasicInfo[0].has_dex_keys ? (
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
            {/* Main stats row */}
            <div className="flex justify-between items-center mt-3 p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
              {/* Left side stats */}
              <div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  Total Equity
                  <HybridTooltip>
                    <HybridTooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </HybridTooltipTrigger>
                    <HybridTooltipContent>
                      Total current equity of your HyperLiquid account. This is
                      your free unutilized USDC + the unrealized PnL of all
                      currently open positions
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
                    ${unrealizedPnl.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Right side controls */}
              <div className="flex flex-col gap-1">
                <EnabledAgentDialog
                  dexName="hyperliquid"
                  modelVersion={model_version}
                  isEnabled={
                    dexUserBasicInfo?.[0]?.trading_pairs[0]
                      .asset_autotrading_active
                  }
                  isTpSlEnabled={dexUserBasicInfo?.[0]?.tp_sl_active}
                />
                <div
                  onClick={() => {
                    toast.success("Available in SwingX Pro");
                  }}
                >
                  <div>
                    {dexUserBasicInfo?.[0]?.trading_pairs[0] && isEnabled && (
                      <Button variant="outline" disabled>
                        run every 2H <ChevronDown className="w-4 h-4" />
                      </Button>
                    )}
                    {isEnabled && countdown && (
                      <div className="mt-[0.5px] ml-1 flex items-center gap-1 text-xs text-muted-foreground">
                        next run: {countdown}{" "}
                        <HybridTooltip>
                          <HybridTooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </HybridTooltipTrigger>
                          <HybridTooltipContent>
                            Analysis Scheduled Run Cycle: 2hr
                          </HybridTooltipContent>
                        </HybridTooltip>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b mt-3 border-zinc-800/50">
              <Button
                variant="ghost"
                size={"sm"}
                className={`pb-2 px-1 rounded-none ${
                  activeTab === "coins" ? "border-b-2 border-colorAI" : ""
                }`}
                onClick={() => setActiveTab("coins")}
              >
                Coins ({tokenPairs.length})
              </Button>
              <Button
                variant="ghost"
                size={"sm"}
                className={` pb-2 px-1 rounded-none ${
                  activeTab === "orders" ? "border-b-2 border-colorAI" : ""
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Orders ({openOrders.length})
              </Button>
              <Button
                variant="ghost"
                size={"sm"}
                className={`pb-2 px-1 rounded-none ${
                  activeTab === "settings" ? "border-b-2 border-colorAI" : ""
                }`}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                size={"sm"}
                className={`pb-2 px-1 rounded-none ${
                  activeTab === "analytics" ? "border-b-2 border-colorAI" : ""
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                Trade Size
              </Button>
            </div>
          </>
        )}
      </CardHeader>

      {!dexUserBasicInfo ||
      dexUserBasicInfo.length === 0 ||
      !dexUserBasicInfo[0].has_dex_keys ||
      dexUserBasicInfoLoading ? null : (
        <CardContent className="pt-0">
          {/* Overview tab */}
          {activeTab === "coins" && (
            <div className="space-y-3 mt-3">
              {/* Trading pairs display with icons */}
              <div className="max-h-[270px] overflow-y-auto rounded-lg border border-zinc-800/50 bg-secondary/50">
                {tokenPairs.map((pair, index) => (
                  <div
                    key={pair.asset}
                    className={`${
                      index % 2 === 0 ? "border rounded-lg bg-zinc-800/50" : ""
                    } p-2`}
                  >
                    {renderToken(pair, index)}
                  </div>
                ))}
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
                  existingTradingPairs:
                    dexUserBasicInfo?.[0]?.trading_pairs.map((pair) => ({
                      ...pair,
                      leverage: 5,
                    })),
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
                {openOrders.map((order, index) => (
                  <div
                    key={order.coin}
                    className={`${
                      index % 2 === 0 ? "border rounded-lg bg-zinc-800/50" : ""
                    } p-2`}
                  >
                    {renderOrder(order, index)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <div className="space-y-4 mt-3">
              {/* TP/SL Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                <div className="flex items-center gap-1">
                  <span className="text-xs">Take Profit / Stop Loss</span>
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
              <div className="flex items-center gap-3">
                <div className="w-full space-y-2 p-3 h-[90px] rounded-lg bg-secondary/50 border border-zinc-800/50">
                  {coinsInConsensus}
                </div>
                <div className="w-full whitespace-nowrap space-y-2 p-3 h-[90px] rounded-lg bg-secondary/50 border border-zinc-800/50">
                  {gatewayCoin}
                </div>
              </div>
              {/* Warning dialog */}
              {showWarning && (
                <Alert variant="destructive">
                  <AlertTitle>Risk Warning</AlertTitle>
                  <AlertDescription>
                    Increasing margin allocation increases your potential for
                    gains and losses.
                  </AlertDescription>
                  <div className="flex flex-col gap-2 mt-2">
                    <Link
                      to="/agents/swing-x/drawdown-calculator"
                      state={{
                        existingStartingCapital: Number(
                          dexBalances?.usdt_balance?.free! || 0
                        ),
                        existingMarginAllocation: marginToUse * 100,
                        existingTradingPairs:
                          dexUserBasicInfo?.[0]?.trading_pairs.map((pair) => ({
                            ...pair,
                            leverage: 5,
                          })),
                        coinList: pairsIcons,
                      }}
                    >
                      <Button className="w-full flex items-center gap-1 border-zinc-800/50 text-primary bg-primary/10">
                        <Calculator className="w-4 h-4 text-colorAI" /> Risk
                        Calculator
                      </Button>
                    </Link>
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
                        setSliderValue(+Number(marginToUse * 100).toFixed(0));
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
                    onPointerUp={() => handleAggressivenessUpdate(sliderValue)}
                    className="flex-1"
                  />
                  <span className="text-sm">30%</span>
                </div>
              </div>

              {/* Strategy/Risk selection */}
              <div className="p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                <div className="flex flex-col ">
                  <div className="flex items-center gap-1 justify-between">
                    <span className="flex items-center gap-1">
                      Risk Profile
                    </span>
                    <AggressivenessLevelDialog
                      trigger={
                        <span className="text-[10px] whitespace-nowrap border-2 rounded-md px-3 py-2 text-red-500 font-extrabold flex items-center gap-2 shadow-lg hover:bg-red-500/20 hover:scale-105 cursor-pointer transition-all ">
                          READ ME <Info className="animate-pulse h-4 w-4" />
                        </span>
                      }
                    />
                  </div>
                  <div
                    onClick={() => {
                      toast.success("Available in SwingX Pro");
                    }}
                  >
                    <Button
                      variant="outline"
                      disabled
                      className="w-full mt-2 flex items-center justify-between text-yellow-500"
                    >
                      Moderate <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Config buttons */}
              <div className="p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
                <div className="flex gap-2">
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
            </div>
          )}

          {/* Analytics tab */}
          {activeTab === "analytics" && (
            <div className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-secondary/50 border border-zinc-800/50">
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
                          marginToUse * (+dexBalances?.usdt_balance?.free! || 0)
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
                  <div className="font-medium">
                    {dexUserBasicInfo[0].trading_pairs.length}
                  </div>
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
                  <div className="text-sm text-muted-foreground">Leverage</div>
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

              {/* Performance link in analytics tab too */}
              <div className="bg-secondary/50 p-3 rounded-lg border border-zinc-800/50">
                <a
                  href="https://app.hyperliquid.xyz/portfolio"
                  target="_blank"
                  className="flex items-center gap-2 justify-center text-colorAI font-medium"
                >
                  View Performance
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
