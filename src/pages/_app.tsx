import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Provider as JotaiProvider } from "jotai";
import { MY_STORE } from "@/store";
export default function App({ Component, pageProps }: AppProps) {

  // const provider = infuraProvider({ apiKey: apikey.split('/')[4]});

  return (
    <>
      <JotaiProvider store={MY_STORE}>
          <Provider>
            <Component {...pageProps} />
          </Provider>
      </JotaiProvider>
    </>
  );
}
