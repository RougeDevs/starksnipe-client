import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  
  return (
  <>
      <Component {...pageProps} />
  </>
  )
}
