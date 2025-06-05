import { toast } from "sonner";
import { DesktopCard } from "./desktopCard";
import { MobileCard } from "./mobileCard";
import { useMediaQuery } from "@/lib/useMediaQuery";

export function SwingXStandardCard() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {isMobile ? (
        <MobileCard
          model_version="dex_v1"
          name="SwingX"
          description={
            <div>
              <strong>SwingX</strong> is a fully autonomous AI trading agent
              that intelligently tracks market trends and executes
              high-probability trades across a{" "}
              <span
                className="text-colorAI underline cursor-pointer"
                onClick={() => {
                  toast("Supported Coins", {
                    description: (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[
                          "AAVE",
                          "AVAX",
                          "BCH",
                          "BNB",
                          "BTC",
                          "DOGE",
                          "ETH",
                          "HBAR",
                          "LDO",
                          "LINK",
                          "LTC",
                          "MKR",
                          "SOL",
                          "SUI",
                          "XLM",
                          "XRP",
                        ].map((coin) => (
                          <div
                            key={coin}
                            className="flex items-center gap-1 p-1.5 bg-slate-800/30 rounded-md hover:bg-slate-700/50 transition-colors"
                          >
                            <span className="font-medium">{coin}</span>
                          </div>
                        ))}
                      </div>
                    ),
                    closeButton: true,
                    duration: 15000,
                  });
                }}
              >
                diversified portfolio
              </span>
              . Designed to capture both upward and downward movements, SwingX
              adapts in real-time to shifting momentum—maximizing gains in any
              market cycle.
            </div>
          }
        />
      ) : (
        <DesktopCard
          model_version="dex_v1"
          name="SwingX"
          description={
            <div>
              <strong>SwingX</strong> is a fully autonomous AI trading agent
              that intelligently tracks market trends and executes
              high-probability trades across a{" "}
              <span
                className="text-colorAI underline cursor-pointer"
                onClick={() => {
                  toast("Supported Coins", {
                    description: (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[
                          "AAVE",
                          "AVAX",
                          "BCH",
                          "BNB",
                          "BTC",
                          "DOGE",
                          "ETH",
                          "HBAR",
                          "LDO",
                          "LINK",
                          "LTC",
                          "MKR",
                          "SOL",
                          "SUI",
                          "XLM",
                          "XRP",
                        ].map((coin) => (
                          <div
                            key={coin}
                            className="flex items-center gap-1 p-1.5 bg-slate-800/30 rounded-md hover:bg-slate-700/50 transition-colors"
                          >
                            <span className="font-medium">{coin}</span>
                          </div>
                        ))}
                      </div>
                    ),
                    closeButton: true,
                    duration: 15000,
                  });
                }}
              >
                diversified portfolio
              </span>
              . Designed to capture both upward and downward movements, SwingX
              adapts in real-time to shifting momentum—maximizing gains in any
              market cycle.
            </div>
          }
        />
      )}
    </>
  );
}
