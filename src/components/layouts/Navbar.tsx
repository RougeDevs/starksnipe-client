import { ArgentTMA } from "@argent/tma-wallet";
import { Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import Image from "next/image";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWaitForTransaction,
} from "@starknet-react/core";
import TelegramIcon from "@/assets/icons/telegramIcon";
import { uint256 } from "starknet";
import { useStarknetkitConnectModal } from "starknetkit";
import { MYCONNECTORS } from "@/pages/_app";
import STRKLogo from "@/assets/strkLogo";
import logo from "../../../public/sniq.png";
import Link from "next/link";
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
  const [walletDropdownSelected, setwalletDropdownSelected] =
    useState<boolean>(false);
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
      padding="0.5rem 2rem"
      alignItems="center"
    >
      <Box
        color="#8aa2ff"
        fontWeight="bold"
        fontSize="24px"
        display="flex"
        alignItems="center"
      >
        <Image src={logo} alt="trial" height={60} width={60} />
        SniQ
      </Box>
      {account ? (
        <Box display="flex" gap="1rem" alignItems="center">
          <Box cursor="pointer">
          <Link href="http://t.me/STRKsnipeBot" target="_blank">
              <TelegramIcon />
            </Link>
          </Box>
          <Box
            padding="8px"
            border="1px solid #374151"
            borderRadius="6px"
            color="#34D399"
            display="flex"
            gap="0.4rem"
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              setwalletDropdownSelected(!walletDropdownSelected);
            }}
          >
            <STRKLogo width={16} height={16} />
            {`${account.address.substring(0, 5)}...${account?.address.substring(
              account.address.length - 7,
              account.address.length
            )}`}
          </Box>
        </Box>
      ) : (
        <Box display="flex" gap="1rem" alignItems="center">
          <Box cursor="pointer">
            <Link href="http://t.me/STRKsnipeBot" target="_blank">
              <TelegramIcon />
            </Link>
          </Box>
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
        </Box>
      )}
      {walletDropdownSelected && (
        <Box
          position="fixed"
          top="7%"
          right="1.5%"
          border="1px solid #374151"
          bg="transparent"
          paddingRight="1.2rem"
          paddingLeft="1.2rem"
          borderRadius="8px"
          boxShadow="0 0 10px rgba(0,0,0,0.1)"
        >
          <Button
            bg="none"
            color="white"
            onClick={() => {
              setwalletDropdownSelected(false);
              disconnectAsync();
            }}
          >
            Disconnect Wallet
          </Button>
        </Box>
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
