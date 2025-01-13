import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Provider as JotaiProvider } from "jotai";
import { mainnet, sepolia } from "@starknet-react/chains";
import { MY_STORE } from "@/store";
import {
  argent,
  braavos,
  infuraProvider,
  publicProvider,
  StarknetConfig,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { InjectedConnector } from "starknetkit/injected";
export const MYCONNECTORS = [
  new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
  new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
  new ArgentMobileConnector(),
  // new WebWalletConnector({ url: 'https://web.argent.xyz' }),
];

export default function App({ Component, pageProps }: AppProps) {

  // const provider = infuraProvider({ apiKey: apikey.split('/')[4]});
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
          <Provider>
          <StarknetConfig
                chains={[mainnet, sepolia]}
                provider={publicProvider()}
                connectors={connectors}
                explorer={voyager}
              >
                <Component {...pageProps} />
              </StarknetConfig>
          </Provider>
      </JotaiProvider>
    </>
  );
}
