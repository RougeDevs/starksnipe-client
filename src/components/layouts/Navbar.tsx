import { Box, Button, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaGasPump } from "react-icons/fa";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
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
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import StarBorder from "../animatedComponents/StarBorder";
import { getParsedTokenData } from "@/utils/helper";
import { EkuboTokenData } from "@/utils/types";
const Navbar = ({ allTokens }: any) => {
  const [open, setOpen] = useState(false);
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
  const gaslessTokenAddress = useAtomValue(gasToken);
  const setGaslessToken = useSetAtom(gasToken);
  const setgaseMode = useSetAtom(gasLessMode);
  const [userTokens, setuserTokens] = useState<any>();
  const [gaslessdropdownSelected, setgaslessdropdownSelected] =
    useState<boolean>(false);
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
  const dropdownRef=useRef<any>(null)

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setgaslessdropdownSelected(false);
        setwalletDropdownSelected(false);
      }
    };
  
    document.addEventListener("pointerdown", handleClickOutside);
  
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (account) {
      const fetchData = async () => {
        const res = await getParsedTokenData(
          "MAINNET",
          account.address,
          allTokens as EkuboTokenData[]
        );
        if (res) {
          setuserTokens(res?.userTokenData?.tokens);
        }
      };
      fetchData();
    }
  }, [account]);
  return (
    <Box
      display="flex"
      width="100%"
      justifyContent="space-between"
      position="fixed"
      bg="black"
      zIndex="100"
      padding={{ base: "0.5rem 1rem", md: "0.5rem 2rem" }}
      alignItems="center"
      ref={dropdownRef}
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
          <ShinyText text="SniQ" />
        </Box>
        <Box display="flex" alignItems="center" gap="1.5rem">
          <Text
            color={router.pathname === "/" ? "rgb(33, 219, 166)" : "#9CA3AF"}
            _hover={{ color: "rgb(33, 219, 166)" }}
            fontSize={"20px"}
            fontWeight={router.pathname === "/" ? 700 : 400}
            display={"flex"}
            hideBelow="md"
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </Text>
          <Text
            color={
              router.pathname === "/swap" ? "rgb(33, 219, 166)" : "#9CA3AF"
            }
            _hover={{ color: "rgb(33, 219, 166)" }}
            fontWeight={router.pathname === "/swap" ? 700 : 400}
            fontSize="20px"
            display="flex"
            hideBelow="md"
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
            bg="#1E2025"
            hideBelow="md"
            border="1px solid transparent"
            _hover={{ border: "1px solid #244f38" }}
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
            border="1px solid rgb(69 156 110/1)"
            borderRadius="6px"
            color="#34D399"
            display="flex"
            gap="0.4rem"
            _hover={{ bg: "#377554", color: "white" }}
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              setwalletDropdownSelected(!walletDropdownSelected);
              setgaslessdropdownSelected(false)
            }}
          >
            <STRKLogo width={16} height={16} />
            {`${account.address.substring(0, 5)}...${account?.address.substring(
              account.address.length - 7,
              account.address.length
            )}`}
          </Box>
          <DrawerRoot
            size="sm"
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
          >
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Box
                hideFrom="lg"
                border="1px solid #374151"
                padding="12px"
                borderRadius="8px"
              >
                <GiHamburgerMenu />
              </Box>
            </DrawerTrigger>
            <DrawerContent padding="1rem">
              <DrawerHeader>
                <DrawerTitle>
                  <ShinyText text="SniQ" />
                </DrawerTitle>
              </DrawerHeader>
              <DrawerBody
                display="flex"
                width="100%"
                mt="2rem"
                justifyContent="center"
                // alignItems="center"
              >
                <Box display="flex" flexDir="column" gap="1rem" width="100%">
                  <Box
                    border="1px solid grey"
                    borderRadius="8px"
                    padding="8px 16px"
                    width="100%"
                    cursor="pointer"
                    textAlign="center"
                    onClick={() => {
                      router.push("/");
                      setOpen(false);
                    }}
                  >
                    Home
                  </Box>
                  <Box
                    border="1px solid grey"
                    borderRadius="8px"
                    padding="8px 16px"
                    cursor="pointer"
                    width="100%"
                    textAlign="center"
                    onClick={() => {
                      router.push("/swap");
                      setOpen(false);
                    }}
                  >
                    Swap
                  </Box>
                  <Box
                    cursor="pointer"
                    width="100%"
                    textAlign="center"
                    padding="8px 16px"
                    display="flex"
                    justifyContent="center"
                    border="1px solid grey"
                    _hover={{ bg: "grey" }}
                    // bg="grey"
                    borderRadius="8px"
                    onClick={() => {
                      setgaslessdropdownSelected(!gaslessdropdownSelected);
                      setwalletDropdownSelected(false);
                      setOpen(false);
                    }}
                  >
                    <FaGasPump />
                  </Box>
                </Box>
              </DrawerBody>
              <DrawerFooter>
                <DrawerActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerActionTrigger>
              </DrawerFooter>
              <DrawerCloseTrigger />
            </DrawerContent>
          </DrawerRoot>
        </Box>
      ) : (
        <Box display="flex" gap="1rem" alignItems="center">
          <Box
            cursor="pointer"
            padding="8px 16px"
            display="flex"
            gap="0.5rem"
            // border="1px solid grey"
            bg="#1E2025"
            hideBelow="md"
            border="1px solid transparent"
            _hover={{ border: "1px solid #244f38" }}
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
          <StarBorder
            as="button"
            className="custom-class"
            color="cyan"
            speed="6s"
            onClick={() => {
              connectWallet();
            }}
          >
            Connect Wallet
          </StarBorder>
          <DrawerRoot
            size="sm"
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
          >
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Box
                hideFrom="lg"
                border="1px solid #374151"
                padding="12px"
                borderRadius="8px"
              >
                <GiHamburgerMenu />
              </Box>
            </DrawerTrigger>
            <DrawerContent padding="1rem">
              <DrawerHeader>
                <DrawerTitle>
                  <ShinyText text="SniQ" />
                </DrawerTitle>
              </DrawerHeader>
              <DrawerBody
                display="flex"
                width="100%"
                mt="2rem"
                justifyContent="center"
                // alignItems="center"
              >
                <Box display="flex" flexDir="column" gap="1rem" width="100%">
                  <Box
                    border="1px solid grey"
                    borderRadius="8px"
                    padding="8px 16px"
                    width="100%"
                    cursor="pointer"
                    textAlign="center"
                    onClick={() => {
                      router.push("/");
                      setOpen(false);
                    }}
                  >
                    Home
                  </Box>
                  <Box
                    border="1px solid grey"
                    borderRadius="8px"
                    padding="8px 16px"
                    cursor="pointer"
                    width="100%"
                    textAlign="center"
                    onClick={() => {
                      router.push("/swap");
                      setOpen(false);
                    }}
                  >
                    Swap
                  </Box>
                  <Box
                    cursor="pointer"
                    width="100%"
                    textAlign="center"
                    padding="8px 16px"
                    display="flex"
                    justifyContent="center"
                    border="1px solid grey"
                    _hover={{ bg: "grey" }}
                    // bg="grey"
                    borderRadius="8px"
                    onClick={() => {
                      setgaslessdropdownSelected(!gaslessdropdownSelected);
                      setwalletDropdownSelected(false);
                      setOpen(false);
                    }}
                  >
                    <FaGasPump />
                  </Box>
                </Box>
              </DrawerBody>
              <DrawerFooter>
                <DrawerActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerActionTrigger>
              </DrawerFooter>
              <DrawerCloseTrigger />
            </DrawerContent>
          </DrawerRoot>
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
            <Text fontSize="18px" fontWeight="500">
              SniQ Gas Station
            </Text>
          </Box>
          <Box mt="1rem">
            <Switch
              checked={gasMode}
              onCheckedChange={(e) => {
                setgaseMode(e?.checked);
              }}
              colorPalette="green"
            >
              Go Gasless
            </Switch>
          </Box>
          <Box mt="1rem">
            {swapTokens.map((token, index: number) => {
              // Find the corresponding token balance from userTokens
              const matchedToken = userTokens?.find(
                (userToken: any) =>
                  processAddress(userToken.l2_token_address) ===
                  processAddress(token.tokenAddress)
              );

              return (
                <Box
                  display="flex"
                  mb="0.5rem"
                  opacity={gasMode ? "100%" : "50%"}
                  _hover={
                    processAddress(gaslessTokenAddress) ===
                    processAddress(token.tokenAddress)
                      ? { bg: "#377554" }
                      : { bg: "rgb(30 32 37)" }
                  }
                  borderRadius="8px"
                  justifyContent="space-between"
                  key={index}
                  padding="1rem"
                  cursor={gasMode ? "pointer" : "disabled"}
                  bg={
                    processAddress(gaslessTokenAddress) ===
                    processAddress(token.tokenAddress)
                      ? "#26513a"
                      : ""
                  }
                  border={
                    processAddress(gaslessTokenAddress) ===
                    processAddress(token.tokenAddress)
                      ? "1px solid rgb(69 156 110/1)"
                      : "1px solid rgb(30 32 37)"
                  }
                  onClick={() => {
                    if (gasMode) {
                      setGaslessToken(token.tokenAddress);
                      setgaslessdropdownSelected(false);
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap="0.5rem">
                    <Image src={token.logo_url} alt="" height={24} width={24} />
                    <Text>{token.symbol}</Text>
                  </Box>
                  <Box>
                    <Text>
                      {!account?"": matchedToken
                        ? (
                            parseFloat(matchedToken.balance) /
                            10 ** matchedToken.decimals
                          ).toFixed(4)
                        : "0.0000"}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
