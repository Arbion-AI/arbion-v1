import { ResponsiveDialog } from "@/components/ui/responsiveDialog";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState } from "react";
import { Link } from "react-router-dom";

export const AggressivenessLevelDialog = ({
  trigger,
}: {
  trigger: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const dialogContent = (
    <div className="mt-4">
      <Tabs defaultValue="low" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="low">
            <span className="font-semibold">Conservative</span>
          </TabsTrigger>
          <TabsTrigger value="medium">
            <span className="font-semibold">Moderate</span>
          </TabsTrigger>
          <TabsTrigger value="high">
            <span className="font-semibold">Aggressive</span>
          </TabsTrigger>
        </TabsList>

        {/* Conservative Setting */}
        <TabsContent
          value="low"
          className="p-4 border rounded-lg bg-secondary/30"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-green-500">
              1. Conservative
            </h3>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Highly Recommended for Beginners
            </Badge>
          </div>

          <p className="mb-3">
            The most conservative and comprehensive SwingX trading strategy with
            the goal of avoiding choppy/rangy markets, holding onto gains, and
            taking trades only in strong trending markets with high-confidence
            setups backed by strong multi-timeframe confluence. Ideal for SwingX
            beginners and users who prefer steady growth and minimized risk
            exposure, with a more of a hands-off approach.{" "}
            <span className="text-green-500 cursor-pointer">
              SwingX Standard agent uses this setting by default.
            </span>
          </p>

          <div className="flex flex-col  gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-medium ">Human Oversight Score:</span>
              <span>👤</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Requires the least amount of human oversight and management. Ideal
              for investors seeking exceptional returns with a hands-off
              approach.
            </span>
          </div>

          <Alert
            variant="destructive"
            className="bg-red-500/10 text-red-300 border-red-500/30"
          >
            <AlertTitle className="font-bold">WARNING</AlertTitle>
            <AlertDescription className="text-sm">
              Conservative is the least volatile and most conservative agent.
              However, with any level you choose, volatility is strongly
              correlated to the leverage you choose, the number of coins you
              trade with, and account balance you start with. E.g. -- an account
              with a starting balance of $200, with margin allocation of 20%
              trading BTC at max leverage of 40x, means BTC position size of
              $1600, will have significant account value volatility and subject
              to liquidation by Hyperliquid after only small price movements in
              BTC, vs. an account with $10,000 and using the same BTC position
              size. This is compounded by the number of coins you trade with.
              <Link
                to="/agents/swing-x/drawdown-calculator"
                target="_blank"
                className="text-colorAI underline cursor-pointer"
              >
                USE CALCULATOR
              </Link>
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Moderate Setting */}
        <TabsContent
          value="medium"
          className="p-4 border rounded-lg bg-secondary/30"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-yellow-500">
              2. Moderate
            </h3>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              For Risk-tolerant Users
            </Badge>
          </div>

          <p className="mb-3">
            Recommended for risk-tolerant{" "}
            <span className="text-yellow-500 cursor-pointer">
              users with 'Conservative' setting experience
            </span>
            . Balances profit safety with profit potential. Takes trades with
            strong technical confirmation while maintaining moderate risk. Takes
            more trades than 'Conservative', and may trade more often in
            choppy/rangy markets to seek out gains in smaller trend movements.
            Ideal for users seeking a mix of consistent returns and frequent
            growth opportunities, while attempting to catch bigger breakout
            movements earlier.
          </p>

          <div className="flex flex-col  gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-medium ">Human Oversight Score:</span>
              <span>👤👤</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Requires more human oversight and management than 'Conservative'
              setting, in order to manually take profits, or toggle the setting
              back down to 'Conservative' if stuck in rangy/choppy market
              conditions to protect gains.
            </span>
          </div>

          <Alert
            variant="destructive"
            className="bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
          >
            <AlertTitle className="font-bold">WARNING</AlertTitle>
            <AlertDescription className="text-sm">
              After a strong performance (long or short), may slowly give back
              gains while market is in consolidation mode after a strong run,
              due to trade attempts to find new trends. In these market
              conditions, toggle back to 'Conservative' setting to protect
              gains. <br />
              <Link
                to="/agents/swing-x/drawdown-calculator"
                target="_blank"
                className="text-colorAI underline cursor-pointer"
              >
                USE CALCULATOR
              </Link>
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Aggressive Setting */}
        <TabsContent
          value="high"
          className="p-4 border rounded-lg bg-secondary/30"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-red-500">
              3. Aggressive
            </h3>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              For Advanced Users Only
            </Badge>
          </div>

          <p className="mb-3">
            Recommended for{" "}
            <span className="text-red-500 cursor-pointer">
              advanced SwingX users that are risk-seeking
            </span>
            . Maximizes profit potential with faster entries and more frequent
            trades. Pursues high-risk, high-reward opportunities, reacting
            swiftly to technical signals. Best suited for traders comfortable
            with higher volatility and active human trade monitoring and
            portfolio management. This will have the least amount of Chop/Rangy
            market avoidance, taking more trades to try to find gains in small
            trend movements. Recommended to stay hands-on and manually exit
            positions and/or stop agent from trading once your profit goals are
            reached.
          </p>

          <div className="flex flex-col  gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-medium ">Human Oversight Score:</span>
              <span>👤👤👤👤</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Requires most hands-on human oversight and management in order to
              manage PnL by manually selling and/or toggling the setting back
              down to 'Conservative' when market stuck in rangy/choppy
              conditions.
            </span>
          </div>

          <Alert
            variant="destructive"
            className="bg-red-500/10 text-red-300 border-red-500/30"
          >
            <AlertTitle className="font-bold">WARNING</AlertTitle>
            <AlertDescription className="text-sm">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  This setting offers the highest risk/reward of all other
                  setting levels. As such, it will have the most volatility in
                  both up and down directions. Only use this setting if you are
                  an advanced user and have experience trading with SwingX
                  agents in lower level settings.
                </li>
                <li>
                  After a strong performance (long or short), will give back
                  gains while market is in consolidation mode after a strong
                  run, due to trade attempts to find new trends. In these market
                  conditions, toggle back to 'Conservative' setting to protect
                  gains.
                </li>
              </ul>{" "}
              <Link
                to="/agents/swing-x/drawdown-calculator"
                target="_blank"
                className="text-colorAI underline cursor-pointer"
              >
                USE CALCULATOR
              </Link>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <ResponsiveDialog
      opened={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title="Aggressiveness Settings"
      content={dialogContent}
      actions={<Button onClick={() => setOpen(false)}>Close</Button>}
      description={
        <span>
          Please read below. Questions? Please ask in the SwingX channel in our{" "}
          <a
            href="https://t.me/+Qa7mtuMOdmcxNzEx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-colorAI underline"
          >
            TG community
          </a>
        </span>
      }
    />
  );
};
