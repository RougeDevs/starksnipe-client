import { Box, Button, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Image from "next/image";
import { FaGasPump } from "react-icons/fa";
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
import { useRouter } from "next/router";
import { gasLessMode, gasToken } from "@/store/settings.atom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import DropdownUp from "@/assets/DropdownIcon";
import { Switch } from "../ui/switch";
import { swapTokens } from "@/constants";
import { processAddress } from "@/Blockchain/utils/utils";
import ShinyText from "../animatedComponents/ShinnyText";
const Navbar = () => {
  const router = useRouter();
  const { starknetkitConnectModal: starknetkitConnectModal1 } =
    useStarknetkitConnectModal({
      modalMode: "canAsk",
      modalTheme: "dark",
      connectors: MYCONNECTORS,
    });
  const { address, connector, account } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const gasMode = useAtomValue(gasLessMode);
  const gaslessTokenAddress=useAtomValue(gasToken)
  const setGaslessToken=useSetAtom(gasToken)
  const setgaseMode = useSetAtom(gasLessMode);
  const [gaslessdropdownSelected, setgaslessdropdownSelected] = useState<boolean>(false);
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
      position="fixed"
      bg="black"
      zIndex="100"
      padding="0.5rem 2rem"
      alignItems="center"
    >
      <Box display="flex" alignItems="center" gap="3rem">
        <Box
          color="#8aa2ff"
          fontWeight="bold"
          fontSize="24px"
          display="flex"
          alignItems="center"
          cursor="pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          <Image src={logo} alt="trial" height={60} width={60} />
          <ShinyText text="SniQ"/>
        </Box>
        <Box display="flex" alignItems="center" gap="1.5rem">
          <Text
            color={router.pathname === "/" ? "rgb(33, 219, 166)" : "#9CA3AF"}
            _hover={{color:'white'}}
            fontSize={'20px'}
            fontWeight={router.pathname==='/'?700:400}
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </Text>
          <Text
            color={router.pathname === "/swap" ? "rgb(33, 219, 166)" : "#9CA3AF"}
            _hover={{color:'white'}}
            fontWeight={router.pathname==='/swap'?700:400}
            fontSize="20px"
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              router.push("/swap");
            }}
          >
            Swap
          </Text>
        </Box>
      </Box>
      {account ? (
        <Box display="flex" gap="1rem" alignItems="center">
          <Box
            cursor="pointer"
            padding="8px 16px"
            display="flex"
            gap="0.5rem"
            border="1px solid grey"
            _hover={{bg:'grey'}}
            // bg="grey"
            borderRadius="8px"
            onClick={() => {
              setgaslessdropdownSelected(!gaslessdropdownSelected);
              setwalletDropdownSelected(false);
            }}
          >
            <FaGasPump />
            <DropdownUp />
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
          <Box
            cursor="pointer"
            padding="8px 16px"
            display="flex"
            gap="0.5rem"
            border="1px solid grey"
            _hover={{bg:'rgb(63, 224, 178)'}}
            // bg="grey"
            borderRadius="8px"
            onClick={() => {
              setgaslessdropdownSelected(!gaslessdropdownSelected);
              setwalletDropdownSelected(false);
            }}
          >
            <FaGasPump />
            <DropdownUp />
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
          top="4rem"
          right="2%"
          border="1px solid #374151"
          bg="black"
          paddingRight="1.2rem"
          paddingLeft="1.2rem"
          borderRadius="8px"
          zIndex="100"
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
      {gaslessdropdownSelected && (
        <Box
          position="fixed"
          top="4rem"
          right="2rem"
          border="1px solid #374151"
          bg="black"
          width="16rem"
          paddingRight="1.2rem"
          paddingLeft="1.2rem"
          borderRadius="8px"
          boxShadow="0 0 10px rgba(0,0,0,0.1)"
          pb="2rem"
        >
          <Box mt="1rem">
            <Text>SniQ Paymaster</Text>
          </Box>
          <Box mt="1rem">
            <Switch
              checked={gasMode}
              onCheckedChange={(e) => {
                setgaseMode(e?.checked);
              }}
            >
              Go Gasless
            </Switch>
          </Box>
          <Box mt="1rem">
            {swapTokens.map((token, index: number) => (
              <Box
                display="flex"
                mb="0.5rem"
                opacity={gasMode?"100%":"50%"}
                _hover={{bg:'grey'}}
                borderRadius="8px"
                justifyContent="space-between"
                key={index}
                padding="1rem"
                cursor={gasMode? "pointer":"disabled"}
                border={processAddress(gaslessTokenAddress)===processAddress(token.tokenAddress)?"1px solid blue": "1px solid grey"}
                onClick={()=>{
                  if(gasMode){
                    setGaslessToken(token.tokenAddress)
                    setgaslessdropdownSelected(false)
                  }
                }}
              >
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Image src={token.logo_url} alt="" height={24} width={24} />
                  <Text>{token.symbol}</Text>
                </Box>
                <Box></Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
