import { UseFormReturn } from "react-hook-form";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ExternalLinkIcon } from "lucide-react";

export const ConfigHyperLiquidForm = ({
  form,
}: {
  form: UseFormReturn<any>;
}) => {
  const bgText = (text: string) => (
    <code className="bg-gray-800 text-xs rounded-md px-1">{text}</code>
  );
  const HyperLiquidBtn = ({ text }: { text: string }) => (
    <div className="w-fit px-2 py-1 rounded-md bg-[#50d2c1] text-[#04060c] font-light text-xs hover:bg-[#50d2c1]">
      {text}
    </div>
  );

  return (
    <Form {...form}>
      <form className="space-y-6 p-4">
        <div className="w-full space-y-4 flex flex-col ">
          <p className="text-sm text-muted-foreground">
            How to learn how to obtain your Hyperliquid API keys 👇
          </p>
          <div className="text-left ">
            <div className="flex items-center gap-1">
              1. Go to{" "}
              <a
                href=" https://app.hyperliquid.xyz/join/XPAAL"
                target="_blank"
                className="text-colorAI underline flex items-center gap-1"
              >
                Hyperliquid <ExternalLinkIcon className="w-4 h-4" />
              </a>
              , click {bgText("Portfolio")}
            </div>

            <div className="flex items-center gap-1">
              2. Click on <HyperLiquidBtn text="Connect" />
              {" → "}
              <HyperLiquidBtn text="Establish connection" />
            </div>
            <div className="mt-1 flex items-center gap-1">
              2. Click on <HyperLiquidBtn text="Deposit" /> and deposit USDC
              from Arbitrum.
            </div>
            <div className="flex items-center gap-1">
              3. Click on {bgText("More")} →{" "}
              <a
                href="https://app.hyperliquid.xyz/API"
                target="_blank"
                rel="noopener noreferrer"
                className="text-colorAI underline flex items-center gap-1"
              >
                {bgText("API")}
              </a>
            </div>
            <div>
              4. Enter {bgText("wallet name")} → Click on {bgText("Generate")} →{" "}
              {bgText("Authorize API Wallet")}
            </div>
            <div>
              5. A Dialog will open, click on {bgText("Max")} for{" "}
              {bgText("Days Valid")}, copy the private key and paste it in the
              field below 👇
            </div>
            <div className="space-y-4 bg-gray-800 rounded-lg p-4 my-2">
              <FormField
                control={form.control}
                name="api_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hyperliquid API Key</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Hyperliquid API Key"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wallet_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Main Wallet Address(e.g. MetaMask wallet you connected to
                      Hyperliquid)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your original wallet address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-1">
                6. Click on <HyperLiquidBtn text="Authorize" />
              </div>
            </div>
          </div>
          <div className="min-h-[200px] border border-colorAI rounded-lg">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/m8706rsjbeY"
              title="Connect to Hyperliquid"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </form>
    </Form>
  );
};
