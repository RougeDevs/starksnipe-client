import { ArgentTMA } from "@argent/tma-wallet";
import { Box, Button } from "@chakra-ui/react";
import React from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWaitForTransaction,
} from "@starknet-react/core";
import { uint256 } from "starknet";
import { useStarknetkitConnectModal } from "starknetkit";
import { MYCONNECTORS } from "@/pages/_app";
import STRKLogo from "@/assets/strkLogo";
const Navbar = ({ argentTma }: any) => {
  const { starknetkitConnectModal: starknetkitConnectModal1 } =
    useStarknetkitConnectModal({
      modalMode: "canAsk",
      modalTheme: "dark",
      connectors: MYCONNECTORS,
    });
  const { address, connector, account } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const connectWallet = async () => {
    try {
      const result = await starknetkitConnectModal1();

      connect({ connector: result.connector });
    } catch (error) {
      console.warn("connectWallet error", error);
      try {
        const result = await starknetkitConnectModal1();
        connect({ connector: result.connector });
      } catch (error) {
        console.error("connectWallet error", error);
        alert("Error connecting wallet");
      }
    }
  };
  return (
    <Box
      display="flex"
      width="100%"
      justifyContent="space-between"
      padding="1rem 2rem"
      alignItems="center"
    >
      <Box color="#34D399">Starksnipe</Box>
      {account ? (
        <Box
          padding="8px"
          border="1px solid #374151"
          borderRadius="6px"
          color="#34D399"
          display="flex"
          gap="0.4rem"
          alignItems="center"
          cursor="pointer"
        >
          <STRKLogo width={16} height={16}/>
          {`${account.address.substring(0, 5)}...${account?.address.substring(
            account.address.length - 7,
            account.address.length
          )}`}
        </Box>
      ) : (
        <Button
          padding="8px 16px"
          bg="#4F46E5"
          color="white"
          borderRadius="8px"
          // disabled={!argentTma}
          onClick={() => {
            connectWallet();
          }}
        >
          Connect Wallet
        </Button>
      )}
      {/* <Button
                      height="30px"
                      onClick={() => {
                        disconnectAsync();
                      }}
                    >
                      Disconnect Wallet
                    </Button> */}
    </Box>
  );
};

export default Navbar;
