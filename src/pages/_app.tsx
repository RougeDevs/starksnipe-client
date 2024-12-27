import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Provider as JotaiProvider } from "jotai";
import { MY_STORE } from "@/store";
import {
  StarknetConfig,
  alchemyProvider,
  argent,
  braavos,
  infuraProvider,
  publicProvider,
  useInjectedConnectors,
} from "@starknet-react/core";
import { mainnet, sepolia } from "@starknet-react/chains";
export default function App({ Component, pageProps }: AppProps) {

  // const provider = infuraProvider({ apiKey: apikey.split('/')[4]});
  const provider = publicProvider()

  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random",
  });

  return (
    <>
      <JotaiProvider store={MY_STORE}>
        <StarknetConfig
          chains={[mainnet, sepolia]}
          provider={provider}
          connectors={connectors}
        >
          <Provider>
            <Component {...pageProps} />
          </Provider>
        </StarknetConfig>
      </JotaiProvider>
    </>
  );
}
