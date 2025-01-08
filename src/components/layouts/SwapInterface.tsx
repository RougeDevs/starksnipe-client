import DropdownUp from "@/assets/DropdownIcon";
import { buyToken, sellToken } from "@/store/token.atom";
import {
  Box,
  Button,
  Input,
  NumberInputLabel,
  NumberInputRoot,
  NumberInputRootProvider,
  Spinner,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import crossIcon from "../../assets/crossIcon.svg";
import invertIcon from "../../assets/buySellIcon.svg";
import { AccountInterface, CallData, Contract } from "starknet";
import InfoIcon from "@/assets/InfoIcon";
import { getBalance } from "@/Blockchain/scripts/swapinteraction";
import numberFormatter from "@/functions/numberFormatter";
import { fetchPrices, PriceRequest } from "@avnu/avnu-sdk";
import { useRouter } from "next/router";
import { getTokenData, parseTokenData } from "@/utils/memeCoinData";
import { useAccount } from "@starknet-react/core";
const SwapInterface = ({argentTMA }: {account:AccountInterface,argentTMA:any}) => {
  const [tokenSelectorDropdown, settokenSelectorDropdown] = useState<boolean>(false);
  const [buyDropdownSelected, setbuyDropdownSelected] = useState<boolean>(false);
  const [sellDropdownSelected, setsellDropdownSelected] = useState<boolean>(false);
  const [showPriceDetails, setshowPriceDetails] = useState<boolean>(false);
  const [slippageDetailsCheck, setslippageDetailsCheck] = useState<boolean>(false);
  const [transactionStarted, settransactionStarted] = useState<boolean>(false)
  const setSellToken = useSetAtom(sellToken);
  const setBuyToken = useSetAtom(buyToken);
  const [buyTokenBalance, setbuyTokenBalance] = useState<number>(0)
  const [sellTokenBalance, setsellTokenBalance] = useState<number>(0)
  const [currentBuyAmount, setcurrentBuyAmount] = useState<number>(0);
  const [currentSellAmount, setcurrentSellAmount] = useState<number>(0);
  const router=useRouter()
  const [firstReceivedToken, setfirstReceivedToken] = useState("")
  const { address, connector, account } = useAccount();
  const [currentSelectedSellToken, setcurrentSelectedSellToken] = useState({
    name: "ETH",
    address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    logo: "https://token-icons.s3.amazonaws.com/eth.png",
    symbol: "ETH",
  });
  const [selectedSlippage, setSelectedSlippage] = useState({
    level: "Medium",
    value: "32%",
  });

  const slippageOptions = [
    { level: "Zero", value: "0%" },
    { level: "Low", value: "10%" },
    { level: "Medium", value: "32%" },
    { level: "High", value: "50%" },
  ];
  const [currentSelectedBuyToken, setcurrentSelectedBuyToken] = useState({
    name: "Select a token",
    address: "",
    logo: "",
    symbol: "Select a token",
  });
  const [allTokens, setallTokens] = useState([
    {
      name: "ETH",
      address: "",
      logo: "https://token-icons.s3.amazonaws.com/eth.png",
      symbol: "ETH",
    },
    {
      name: "ETH",
      address: "",
      logo: "https://token-icons.s3.amazonaws.com/eth.png",
      symbol: "ETH",
    },
    {
      name: "ETH",
      address: "",
      logo: "https://token-icons.s3.amazonaws.com/eth.png",
      symbol: "ETH",
    },
    {
      name: "ETH",
      address: "",
      logo: "https://token-icons.s3.amazonaws.com/eth.png",
      symbol: "ETH",
    },
    {
      name: "ETH",
      address: "",
      logo: "https://token-icons.s3.amazonaws.com/eth.png",
      symbol: "ETH",
    },
    {
      name: "ETH",
      address: "",
      logo: "https://token-icons.s3.amazonaws.com/eth.png",
      symbol: "ETH",
    },
    {
      name: "ETH",
      address: "",
      logo: "https://token-icons.s3.amazonaws.com/eth.png",
      symbol: "ETH",
    },
    {
      name: "ETH",
      address: "https://token-icons.s3.amazonaws.com/eth.png",
      logo: "https://token-icons.s3.amazonaws.com/eth.png",
      symbol: "ETH",
    },
    {
      name: "ETH",
      address: "",
      logo: "https://token-icons.s3.amazonaws.com/eth.png",
      symbol: "ETH",
    },
  ]);
  const handleTransaction = async () => {
    try {
      if (account) {
        const result = await account.execute([
          {
          contractAddress:
              "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            entrypoint: "approve",
            calldata: [
              "0x5e8506f1754a634f3cf9391cfef47ff25293848c7677f2f9eec4f395798f7c3",
              BigInt(100000000000000).toString(),
              "0",
            ],
          },
          {
            contractAddress:
              "0x5e8506f1754a634f3cf9391cfef47ff25293848c7677f2f9eec4f395798f7c3",
            entrypoint: "deposit",
            calldata: [
              "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
              BigInt(100000000000000).toString(),
              0,
              account.address,
            ],
          },
        ]);
        settransactionStarted(false)
        // alert(result);
      }
    } catch (error) {
      settransactionStarted(false)
      console.log(error, "err in call");
    }
  };
  const handleSelect = (option: any) => {
    setSelectedSlippage(option);
    setslippageDetailsCheck(false);
  };

  const handleConnectButton = async () => {
    await argentTMA.requestConnection({
          callbackData: 'custom_callback',
          // approvalRequests: [
          //   {
          //     tokenAddress: '0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7',
          //     amount: BigInt(1000000000000000000).toString(),
          //     spender: 'spender_address',
          //   }
          // ],
        });
  };

  // useEffect(()=>{
  //   try {
  //     const fetchData=async()=>{
  //       const res=await getTokenData('0x03b405a98c9e795d427fe82cdeeeed803f221b52471e3a757574a2b4180793ee')
  //       if(res){
  //         console.log(res,'res')
  //         const res2=await parseTokenData('0x03b405a98c9e795d427fe82cdeeeed803f221b52471e3a757574a2b4180793ee',res as any)
  //         console.log(res2,'value checks')
  //       }
  //     }
  //     fetchData()
  //   } catch (error) {
  //     console.log(error,'err')
  //   }
  // },[])

  useEffect(() => {
    if (typeof window !== 'undefined' && router.query.token) {
        const token = router.query.token;
        if (token) {
            localStorage.setItem('token', token as string);
        }
    }
}, [router.query]);

useEffect(() => {
  try {
      if (typeof window !== 'undefined') {
          const persistedToken = localStorage.getItem('token');
          if (persistedToken) {
              setfirstReceivedToken(persistedToken);
              console.log('Persisted token retrieved:', persistedToken);
          } else {
              // alert('No token found in localStorage.');
          }
      }
  } catch (error) {
      alert('Error accessing localStorage:');
  }
}, []); // Run once on mount

  useEffect(()=>{
    if(currentSelectedSellToken.symbol !== "Select a token"){
      const fetchBalance=async()=>{
        const res=await getBalance(account?.address as any,currentSelectedSellToken.address)
        if(res){
          setsellTokenBalance(res)
        }
      }
      if(account && currentSelectedSellToken.address){
        fetchBalance()
      }
    }
  },[currentSelectedSellToken,account])

  useEffect(()=>{
    if(currentSelectedBuyToken.symbol !== "Select a token"){
      const fetchBalance=async()=>{
        const res=await getBalance(account?.address as any,currentSelectedBuyToken.address)
        if(res){
          setbuyTokenBalance(res)
        }
      }
      if(account && currentSelectedBuyToken.address){
        fetchBalance()
      }
    }
  },[currentSelectedBuyToken,account])

  return (
    <Box
      mt="1rem"
      padding="1rem"
      width="100%"
      display="flex"
      justifyContent="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        padding="1rem"
        borderRadius="6px"
        width={{ sm: "80%", md: "30%" }}
      >
        <Text color="#D1D5DB">Swap</Text>
        <Box
          display="flex"
          flexDir="column"
          justifyContent="center"
          width="100%"
          mt="0.5rem"
          gap="0.3rem"
        >
          <Box
            display="flex"
            flexDir="column"
            gap="0.5rem"
            border="1px solid #374151"
            bg="rgba(31, 41, 55, 0.5)"
            borderRadius="12px"
            padding="1rem"
          >
            <Box>
              <Text>Sell</Text>
            </Box>
            <Box
              display="flex"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Input
                  border="0px"
                  width="100%"
                  pl="0.4rem"
                  placeholder="0"
                  _focus={{
                    outline: "0",
                    border: "0px",
                    boxShadow: "none",
                  }}
                  value={currentSellAmount ? currentSellAmount : ""}
                  onChange={(e) => {
                    setcurrentSellAmount(Number(e.target.value));
                  }}
                  type="number"
                  css={{
                    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                      {
                        "-webkit-appearance": "none",
                        margin: 0,
                      },
                  }}
                />
              </Box>
              <Box
                bg="#374151"
                cursor="pointer"
                padding="8px"
                display="flex"
                borderRadius="8px"
                width={currentSelectedSellToken.logo ? "100px" : "140px"}
                gap="0.4rem"
                alignItems="center"
                onClick={() => {
                  setsellDropdownSelected(true);
                  setbuyDropdownSelected(false);
                }}
              >
                {currentSelectedSellToken.logo && (
                  <Image
                    src={currentSelectedSellToken.logo}
                    alt="trial"
                    height={20}
                    width={20}
                  />
                )}
                <Text>{currentSelectedSellToken.symbol}</Text>
                <Box>
                  <DropdownUp />
                </Box>
              </Box>
            </Box>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Text color="#9CA3AF">$0.00</Text>
              <Box display="flex" gap="0.4rem">
                <Text color="#9CA3AF">balance: {numberFormatter(sellTokenBalance)}</Text>
                <Box cursor="pointer" color="#4F46E5" onClick={()=>{
                  setcurrentSellAmount(sellTokenBalance)
                }}>
                  MAX
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="center"
          >
            <Button
              width="50px"
              position="absolute"
              bg="#374151"
              borderRadius="8px"
              _hover={{ bg: "#374151" }}
              onClick={() => {
                // Swap buy and sell token states
                setcurrentSelectedSellToken(currentSelectedBuyToken);
                setcurrentSelectedBuyToken(currentSelectedSellToken);
                setcurrentBuyAmount(currentSellAmount);
                setcurrentSellAmount(currentBuyAmount);
              }}
            >
              <Image
                src={invertIcon}
                alt=""
                width={15}
                height={15}
                style={{ filter: "invert(1)" }}
              />
            </Button>
          </Box>
          <Box
            display="flex"
            flexDir="column"
            gap="0.5rem"
            border="1px solid #374151"
            bg="rgba(31, 41, 55, 0.5)"
            borderRadius="12px"
            padding="1rem"
          >
            <Box>
              <Text>Buy</Text>
            </Box>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Box>
                <Input
                  border="0px"
                  width="100%"
                  cursor="pointer"
                  pl="0.4rem"
                  _focus={{
                    outline: "0",
                    border: "0px",
                    boxShadow: "none",
                  }}
                  value={currentBuyAmount ? currentBuyAmount : ""}
                  onChange={(e) => {
                    setcurrentBuyAmount(Number(e.target.value));
                  }}
                  placeholder="0"
                  type="number"
                  css={{
                    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                      {
                        "-webkit-appearance": "none",
                        margin: 0,
                      },
                  }}
                />
              </Box>
              <Box
                bg="#374151"
                cursor="pointer"
                padding="8px"
                display="flex"
                borderRadius="8px"
                width={currentSelectedBuyToken.logo === "" ? "140px" : "100px"}
                gap="0.4rem"
                alignItems="center"
                onClick={() => {
                  setsellDropdownSelected(false);
                  setbuyDropdownSelected(true);
                }}
              >
                {currentSelectedBuyToken?.logo && (
                  <Image
                    src={currentSelectedBuyToken.logo}
                    alt="trial"
                    height={20}
                    width={20}
                  />
                )}
                <Text whiteSpace="nowrap">
                  {currentSelectedBuyToken.symbol}
                </Text>
                <Box>
                  <DropdownUp />
                </Box>
              </Box>
            </Box>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Text color="#9CA3AF">$0.00</Text>
              <Box display="flex" gap="0.4rem">
                <Text color="#9CA3AF">balance: {numberFormatter(buyTokenBalance)}</Text>
              </Box>
            </Box>
          </Box>
          {currentSelectedBuyToken.symbol !== "Select a token" &&
            currentSelectedSellToken.symbol !== "Select a token" && (
              <Box display="flex" flexDirection="column">
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  mt="1rem"
                  padding="0px 8px"
                >
                  <Text color="#9CA3AF">
                    1 {currentSelectedSellToken.symbol} = 0.999{" "}
                    {currentSelectedSellToken.symbol} ($0.50)
                  </Text>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap="0.4rem"
                    cursor="pointer"
                    onClick={() => {
                      setshowPriceDetails(!showPriceDetails);
                    }}
                  >
                    <Text
                      display={{ smToMd: "none", base: "none", md: "block" }}
                      color="#9CA3AF"
                    >
                      Price Details
                    </Text>
                    <DropdownUp />
                  </Box>
                </Box>
                {showPriceDetails && (
                  <Box display="flex" flexDirection="column" gap="0.5rem">
                    <Box
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                      mt="1rem"
                      padding="0px 8px"
                    >
                      <Box display="flex" gap="0.4rem" alignItems="center">
                        <Text color="#9CA3AF">Min Received</Text>
                        <InfoIcon/>
                      </Box>
                      <Box display="flex" alignItems="center" gap="0.4rem">
                        <Text color="#9CA3AF">
                          3 {currentSelectedSellToken.symbol}
                        </Text>
                      </Box>
                    </Box>
                    <Box
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                      padding="0px 8px"
                    >
                      <Box display="flex" gap="0.4rem" alignItems="center">
                        <Text color="#9CA3AF">Fees</Text>
                        <InfoIcon/>
                      </Box>
                      <Box display="flex" alignItems="center" gap="0.4rem">
                        <Text color="#9CA3AF">0.1%</Text>
                      </Box>
                    </Box>
                    {/* <Box
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                      padding="0px 8px"
                    >
                      <Box display="flex" gap="0.4rem" alignItems="center">
                        <Text color="#9CA3AF">Price Impact</Text>
                        <InfoIcon/>
                      </Box>
                      <Box display="flex" alignItems="center" gap="0.4rem">
                        <Text color="#9CA3AF">High</Text>
                      </Box>
                    </Box> */}
                    {/* <Box
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                      padding="0px 0px 0px 8px"
                      alignItems="center"
                    >
                      <Box display="flex" gap="0.4rem" alignItems="center">
                        <Text color="#9CA3AF">Slippage tolerance</Text>
                        <InfoIcon/>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap="0.4rem"
                        padding="8px"
                        border="1px solid grey"
                        borderRadius="8px"
                        cursor="pointer"
                        position="relative"
                        onClick={() =>
                          setslippageDetailsCheck(!slippageDetailsCheck)
                        }
                        color="#9CA3AF"
                      >
                        <Text>{selectedSlippage.level}</Text>
                        <Text>{selectedSlippage.value}</Text>

                        {slippageDetailsCheck && (
                          <Box
                            position="absolute"
                            top="100%"
                            left="0"
                            bg="black"
                            border="1px solid grey"
                            borderRadius="8px"
                            padding="4px"
                            mt="0.5rem"
                            boxShadow="md"
                            zIndex="10"
                            width="120px"
                          >
                            {slippageOptions.map((option, index) => (
                              <Box
                                key={index}
                                padding="8px"
                                cursor="pointer"
                                display="flex"
                                width="100%"
                                justifyContent="space-between"
                                _hover={{ backgroundColor: "gray.200" }}
                                onClick={() => handleSelect(option)}
                              >
                                <Text>{option.level}</Text>
                                <Text>{option.value}</Text>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box> */}
                  </Box>
                )}
              </Box>
            )}
          <Button
            borderRadius="8px"
            mt="1rem"
            padding="1rem"
            color="white"
            background="linear-gradient( to right,  #7E22CE, #2563EB)"
            disabled={
              currentBuyAmount === 0 ||
              currentSellAmount === 0 ||
              currentSelectedBuyToken.symbol === "Select a token" ||
              currentSelectedSellToken.symbol === "Select a token" || transactionStarted
            }
            onClick={() => {
              settransactionStarted(true)
              if(!transactionStarted){
                if(account){
                  handleTransaction();
                }else{
                  handleConnectButton()
                }
              }
            }}
          >
              {transactionStarted &&<Spinner
    color="red.500"
    css={{ "--spinner-track-color": "colors.gray.200" }}
  />}
            {currentSelectedBuyToken.symbol === "Select a token" ||
            currentSelectedSellToken.symbol === "Select a token"
              ? "Select a token"
              : transactionStarted?"Swapping": account? "Swap":"Connect Wallet"}
          </Button>
        </Box>
        {sellDropdownSelected && (
          <Box
            width={{base:'70vw',md:"50vw"}}
            // overflow="auto"
            height="500px"
            mt="10rem"
            display="flex"
            padding="1rem"
            borderRadius="8px"
            flexDirection="column"
            gap="1rem"
            position="fixed"
            top="25%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex="21"
            bg="#101010"
            border="1px solid #1d1d1d"
          >
            <Box
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>Select a token</Text>
              <Box
                cursor="pointer"
                onClick={() => {
                  setsellDropdownSelected(false);
                }}
              >
                <Image
                  src={crossIcon}
                  alt=""
                  width={12}
                  height={12}
                  style={{ filter: "invert(1)" }}
                />
              </Box>
            </Box>
            <Box width="100%" bg="grey" borderRadius="8px">
              <Input
                _selected={{ border: "1px solid blue" }}
                bg="#101010"
                pl="0.4rem"
                placeholder="Enter token name"
              />
            </Box>
            <Box overflow="auto">
              <Text mt="0.5rem" mb="1rem">
                Popular Tokens
              </Text>
              {allTokens.map((token: any, index: number) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="column"
                  mb="0.5rem"
                >
                  <Box
                    display="flex"
                    gap="0.8rem"
                    _hover={{ bg: "grey" }}
                    padding="0.5rem"
                    borderRadius="8px"
                    cursor="pointer"
                    alignItems="center"
                    onClick={() => {
                      setsellDropdownSelected(false);
                      setSellToken(token);
                      setcurrentSelectedSellToken(token);
                    }}
                  >
                    <Box>
                      <Image
                        src={token.logo}
                        alt="trial"
                        height={35}
                        width={35}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="18px">{token.name}</Text>
                      <Text fontSize="14px" color="grey">
                        {token.symbol}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {buyDropdownSelected && (
          <Box
          width={{base:'70vw',md:"50vw",lg:"30vw"}}
            // overflow="auto"
            height="500px"
            mt="10rem"
            display="flex"
            padding="1rem"
            borderRadius="8px"
            flexDirection="column"
            gap="1rem"
            position="fixed"
            top="25%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex="21"
            bg="#101010"
            border="1px solid #1d1d1d"
          >
            <Box
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>Select a token</Text>
              <Box
                cursor="pointer"
                onClick={() => {
                  setbuyDropdownSelected(false);
                }}
              >
                <Image
                  src={crossIcon}
                  alt=""
                  width={12}
                  height={12}
                  style={{ filter: "invert(1)" }}
                />
              </Box>
            </Box>
            <Box width="100%" bg="grey" borderRadius="8px">
              <Input
                _selected={{ border: "1px solid blue" }}
                bg="#101010"
                pl="0.4rem"
                placeholder="Enter token name"
              />
            </Box>
            <Box overflow="auto">
              <Text mt="0.5rem" mb="1rem">
                Popular Tokens
              </Text>
              {allTokens.map((token: any, index: number) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="column"
                  mb="0.5rem"
                >
                  <Box
                    display="flex"
                    gap="0.8rem"
                    _hover={{ bg: "grey" }}
                    padding="0.5rem"
                    borderRadius="8px"
                    cursor="pointer"
                    onClick={() => {
                      setbuyDropdownSelected(false);
                      setBuyToken(token);
                      setcurrentSelectedBuyToken(token);
                    }}
                  >
                    <Box>
                      <Image
                        src={token.logo}
                        alt="trial"
                        height={35}
                        width={35}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="18px">{token.name}</Text>
                      <Text fontSize="14px" color="grey">
                        {token.symbol}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {/* <Text>{firstReceivedToken}</Text> */}
      </Box>
    </Box>
  );
};

export default SwapInterface;
