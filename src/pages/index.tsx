import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { SessionAccountInterface } from "@argent/tma-wallet";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layouts/Navbar";
import { useSetAtom } from "jotai";
import { argentSetupAtom } from "@/store/address.atom";
import SwapInterface from "@/components/layouts/SwapInterface";
import { Box } from "@chakra-ui/react";

export default function Home() {
  const [argentTMA, setArgentTMA] = useState<any>(null);
  const [debugLog, setDebugLog] = useState<string>("Initializing...");
  const setArgentSetup=useSetAtom<any>(argentSetupAtom)

  // useEffect(() => {
  //   // Dynamically import to ensure it runs only in the browser
  //   import("@argent/tma-wallet")
  //     .then(({ ArgentTMA }) => {
  //       const tma = ArgentTMA.init({
  //         environment: "sepolia", // Replace with "mainnet" if needed
  //         appName: "StarkSnipe",
  //         appTelegramUrl: "https://t.me/snipebot",
  //         sessionParams: {
  //           allowedMethods: [
  //             {
  //               contract:
  //                 "0x036133c88c1954413150db74c26243e2af77170a4032934b275708d84ec5452f",
  //               selector: "increment",
  //             },
  //           ],
  //           validityDays: 90,
  //         },
  //       });
  //       setArgentSetup(tma)
  //       setArgentTMA(tma);
  //     })
  //     .catch((err) => {
  //       console.debug('error',err)
  //       setDebugLog(`Error: ${err.message}`);
  //       console.error("Failed to initialize ArgentTMA:", err);
  //     });
  // }, []);

  const handleConnectButton = async () => {
    await argentTMA.requestConnection("custom_callback_data");
  };
  const [account, setAccount] = useState<SessionAccountInterface | undefined>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  useEffect(() => {
    // Call connect() as soon as the app is loaded
    if(argentTMA){
      argentTMA.connect()
        .then((res: { account: any; callbackData?: any; }) => {
          if (!res) {
            // Not connected
            setIsConnected(false);
            return;
          }
          
          const { account, callbackData } = res;
  
          if (account.getSessionStatus() !== "VALID") {
            // Session has expired or scope (allowed methods) has changed
            // A new connection request should be triggered
  
            // The account object is still available to get access to user's address
            // but transactions can't be executed
            const { account } = res;

  
            setAccount(account);
            setIsConnected(false);
            return;
          }
  
          // The session account is returned and can be used to submit transactions
          setAccount(account);
          setIsConnected(true);
          // Custom data passed to the requestConnection() method is available here
          console.log("callback data:", callbackData);
        })
        .catch((err: any) => {
          console.error("Failed to connect", err);
        });
    }
  }, [argentTMA]);
  const router=useRouter()

  const sessionStatus = account?.getSessionStatus();
// "VALID" | "EXPIRED" | "INVALID_SCOPE"

  // const isConnected = argentTMA?.isConnected();

  return (
    <>
      <Head>
        <title>Starksnipe | Memecoin Snipping</title>
      </Head>
      <Box >
        <Navbar account={account} argentTma={argentTMA}/>
        <SwapInterface/>
        <p>{account?.address}</p>
      </Box>
    </>
  );
}
