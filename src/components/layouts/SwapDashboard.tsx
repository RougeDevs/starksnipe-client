import DropdownUp from "@/assets/DropdownIcon";
import { buyToken, sellToken } from "@/store/token.atom";
import {
  Box,
  Button,
  Input,
  Skeleton,
  Spinner,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { Router as FibrousRouter } from "fibrous-router-sdk";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import crossIcon from "../../assets/crossIcon.svg";
import invertIcon from "../../assets/buySellIcon.svg";
import { CallData } from "starknet";
import InfoIcon from "@/assets/InfoIcon";
import { getBalance } from "@/Blockchain/scripts/swapinteraction";
import { useAccount, useConnect } from "@starknet-react/core";
import { fetchQuote, getSwapCalls } from "@/utils/swapRouter";
import { getMinAmountOut, getParsedTokenData } from "@/utils/helper";
import {
  fetchAccountCompatibility,
} from "@avnu/gasless-sdk";
import {
  executeSwap,
  fetchBuildExecuteTransaction,
} from "@avnu/avnu-sdk";
import {
  etherToWeiBN,
  parseAmount,
  processAddress,
} from "@/Blockchain/utils/utils";
import { EkuboTokenData } from "@/utils/types";
import { exampleExecuteCalls, getEstimatedGasFees } from "@/utils/avnu";
import formatNumberEs from "@/functions/esnumberFormatter";
import { toast } from "react-toastify";
import { useStarknetkitConnectModal } from "starknetkit";
import { MYCONNECTORS } from "@/pages/_app";
import {
  ErrorMessage,
  findTokenPrice,
  getPriceInUSD,
  isTxAccepted,
} from "@/functions/helpers";
import { gasLessMode, gasToken } from "@/store/settings.atom";
import numberFormatter from "@/functions/numberFormatter";
import { BigNumber } from "@ethersproject/bignumber";
import axios from "axios";
const SwapDashboard = ({
  prices,
  allTokens,
}: {
  prices: any;
  allTokens: any;
}) => {
  const [buyDropdownSelected, setbuyDropdownSelected] =
    useState<boolean>(false);
  const [sellDropdownSelected, setsellDropdownSelected] =
    useState<boolean>(false);
  const [showPriceDetails, setshowPriceDetails] = useState<boolean>(true);
  const [transactionStarted, settransactionStarted] = useState<boolean>(false);
  const setSellToken = useSetAtom(sellToken);
  const setBuyToken = useSetAtom(buyToken);
  const [buyTokenBalance, setbuyTokenBalance] = useState<number>(0);
  const [sellTokenBalance, setsellTokenBalance] = useState<number>(0);
  const [currentBuyAmount, setcurrentBuyAmount] = useState<number>(0);
  const [buyvalueChanged, setbuyvalueChanged] = useState<boolean>(false);
  const [sellvalueChanged, setsellvalueChanged] = useState<boolean>(false);
  const [currentSellAmount, setcurrentSellAmount] = useState<number>(0);
  const { address, connector, account } = useAccount();
  const [calls, setcalls] = useState<any>();
  // const [prices, setprices] = useState<any>();
  const [sellTokenPrice, setsellTokenPrice] = useState<number | null>(null);
  const [buyTokenPrice, setbuyTokenPrice] = useState<number | null>(null);
  const [currentSelectedSellToken, setcurrentSelectedSellToken] = useState({
    name: "STRK",
    l2_token_address:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    logo_url:
      "https://imagedelivery.net/0xPAQaDtnQhBs8IzYRIlNg/1b126320-367c-48ed-cf5a-ba7580e49600/logo",
    decimals: 18,
    symbol: "STRK",
  });
  const fibrous = new FibrousRouter();
  const [minReceived, setminReceived] = useState<any>(0);
  const [refereshData, setrefereshData] = useState<boolean>(false);
  const [refreshBuyData, setrefreshBuyData] = useState<boolean>(false);
  const [refereshSellData, setrefereshSellData] = useState<boolean>(false);
  const [userTokens, setuserTokens] = useState<any>();
  const [exchangeRate, setexchangeRate] = useState<number | null>(null);
  const [defaultFees, setdefaultFees] = useState<number>(0);
  const [transactionSuccessfull, settransactionSuccessfull] =
    useState<boolean>(false);

  const { starknetkitConnectModal: starknetkitConnectModal1 } =
    useStarknetkitConnectModal({
      modalMode: "canAsk",
      modalTheme: "dark",
      connectors: MYCONNECTORS,
    });
  const { connect, connectors } = useConnect();
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
  const [currentSelectedBuyToken, setcurrentSelectedBuyToken] = useState({
    name: "Select a token",
    l2_token_address: "",
    logo_url: "",
    decimals: 18,
    symbol: "Select a token",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = allTokens.filter((token: any) => {
    // Exclude tokens with `hidden` set to true unless they match the search term
    if (token.hidden) {
      return (
        searchTerm &&
        (token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    // Include tokens that match the search term or show all if searchTerm is empty
    return (
      !token.hidden &&
      (searchTerm === "" ||
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const filteredUsertokens = userTokens?.filter((token: any) => {
    // Exclude tokens with `hidden` set to true unless they match the search term
    if (token.hidden) {
      return (
        searchTerm &&
        (token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    // Include tokens that match the search term or show all if searchTerm is empty
    return (
      !token.hidden &&
      (searchTerm === "" ||
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const gasMode = useAtomValue(gasLessMode);
  const gasTokenAddress = useAtomValue(gasToken);

  const handleTransaction = async () => {
    try {
      if (account) {
        const res = await fetchAccountCompatibility(account.address);
        if (res?.isCompatible) {
          if (gasMode) {
            const result = await exampleExecuteCalls(
              "MAINNET",
              account,
              processAddress(gasTokenAddress),
              calls
            );
            if (result) {
              const resTx = await isTxAccepted(result.transactionHash);
              if (resTx) {
                toast.success("Successfully swapped tokens", {
                  position: "bottom-right",
                });
                settransactionSuccessfull(true);
              }
            }
          } else {
            const result = await account.execute(calls);
            if (result) {
              const resTx = await isTxAccepted(result.transaction_hash);
              if (resTx) {
                toast.success("Successfully swapped tokens", {
                  position: "bottom-right",
                });
                settransactionSuccessfull(true);
              }
            }
          }
        } else {
          const result = await account.execute(calls);
          if (result) {
            const resTx = await isTxAccepted(result.transaction_hash);
            if (resTx) {
              toast.success("Successfully swapped tokens", {
                position: "bottom-right",
              });
              settransactionSuccessfull(true);
            }
          }
        }
        settransactionStarted(false);
        // alert(result);
      }
    } catch (error) {
      toast.error(ErrorMessage(error), {
        position: "bottom-right",
      });
      settransactionStarted(false);
    }
  };

  useEffect(() => {
    if (prices) {
      if (currentSelectedSellToken.symbol !== "Select a token") {
        const tokenPrice = findTokenPrice(
          processAddress(currentSelectedSellToken.l2_token_address),
          prices
        );
        setsellTokenPrice(tokenPrice);
      }
      if (currentSelectedBuyToken.symbol !== "Select a token") {
        const tokenPrice = findTokenPrice(
          processAddress(currentSelectedBuyToken.l2_token_address),
          prices
        );
        setbuyTokenPrice(tokenPrice);
      }
    }
  }, [prices, currentSelectedBuyToken, currentSelectedSellToken]);

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

  useEffect(() => {
    if (
      currentSelectedBuyToken.symbol !== "Select a token" &&
      currentSellAmount > 0
    ) {
      setrefreshBuyData(true);
    }
  }, [currentSelectedBuyToken, currentSelectedSellToken, sellvalueChanged]);

  useEffect(() => {
    let intervalId: any;
    // Create a reference to store the current controller
    const controller = new AbortController();
  
    const fetchValue = async () => {
      try {
        const protocolFees = currentSellAmount / 1000;
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/get-quotes?sell_token=${
            currentSelectedSellToken.l2_token_address
          }&buy_token=${
            currentSelectedBuyToken.l2_token_address
          }&sell_amount=${BigInt(
            etherToWeiBN(
              currentSellAmount -
                (protocolFees + (gasMode ? 5 * defaultFees : 0)),
              currentSelectedSellToken.decimals
            )
          )}`,
          {
            signal: controller.signal // Pass the abort signal to axios
          }
        );
  
        // Only process the response if the request wasn't aborted
        if (!controller.signal.aborted) {
          if (res) {
            setcurrentBuyAmount(
              parseAmount(
                res?.data?.data.buy_amount,
                currentSelectedBuyToken.decimals
              )
            );
            const res2 = getMinAmountOut(
              BigInt(res?.data?.data.buy_amount),
              BigInt(1)
            );
            setminReceived(
              parseAmount(String(res2), currentSelectedBuyToken.decimals)
            );
            if (address) {
              if (res?.data?.data.aggregator == 0) {
                let arr = [];
                const approveCall = await fibrous.buildApproveStarknet(
                  BigNumber.from(
                    BigInt(
                      etherToWeiBN(
                        currentSellAmount - (gasMode ? 5 * defaultFees : 0),
                        currentSelectedSellToken.decimals
                      )
                    )
                  ),
                  currentSelectedSellToken.l2_token_address
                );
                const swapCall = await fibrous.buildTransaction(
                  BigNumber.from(
                    BigInt(
                      etherToWeiBN(
                        currentSellAmount - (gasMode ? 5 * defaultFees : 0),
                        currentSelectedSellToken.decimals
                      )
                    )
                  ),
                  currentSelectedSellToken.l2_token_address,
                  currentSelectedBuyToken.l2_token_address,
                  1,
                  address,
                  "starknet"
                );
                if (swapCall) {
                  arr.push(approveCall);
                  arr.push(swapCall);
                  arr.push(
                    {
                      contractAddress: currentSelectedSellToken.l2_token_address,
                      entrypoint: "approve",
                      calldata: [
                        "0x2174be7f62d51900677f6da9058b753cd05e79df40ee287ae1cb3ca6eb6012d",
                        etherToWeiBN(
                          protocolFees,
                          currentSelectedSellToken.decimals
                        ).toString(),
                        "0",
                      ],
                    },
                    {
                      contractAddress:
                        "0x2174be7f62d51900677f6da9058b753cd05e79df40ee287ae1cb3ca6eb6012d",
                      entrypoint: "collectFees",
                      calldata: CallData.compile([
                        currentSelectedSellToken.l2_token_address,
                        etherToWeiBN(
                          currentSellAmount,
                          currentSelectedSellToken.decimals
                        ).toString(),
                        "0",
                      ]),
                    }
                  );
                  setcalls(arr);
                }
              } else {
                const res3 = await fetchBuildExecuteTransaction(
                  res?.data?.data.quote_id,
                  address,
                  1,
                  true
                );
                if (res3) {
                  let arr: any[] = [];
                  arr.push(...(res3?.calls || []));
                  arr.push(
                    {
                      contractAddress: currentSelectedSellToken.l2_token_address,
                      entrypoint: "approve",
                      calldata: [
                        "0x2174be7f62d51900677f6da9058b753cd05e79df40ee287ae1cb3ca6eb6012d",
                        etherToWeiBN(
                          protocolFees,
                          currentSelectedSellToken.decimals
                        ).toString(),
                        "0",
                      ],
                    },
                    {
                      contractAddress:
                        "0x2174be7f62d51900677f6da9058b753cd05e79df40ee287ae1cb3ca6eb6012d",
                      entrypoint: "collectFees",
                      calldata: CallData.compile([
                        currentSelectedSellToken.l2_token_address,
                        etherToWeiBN(
                          currentSellAmount,
                          currentSelectedSellToken.decimals
                        ).toString(),
                        "0",
                      ]),
                    }
                  );
                  setcalls(arr);
                }
              }
            }
          }
          setrefereshData(false);
          setrefereshSellData(false);
          setrefreshBuyData(false);
        }
      } catch (error) {
        // Only log errors that aren't from cancellation
        if (!axios.isCancel(error)) {
          console.log(error, "err");
        }
      }
    };
  
    if (
      currentSelectedBuyToken.symbol !== "Select a token" &&
      currentSelectedSellToken.symbol !== "Select a token"
    ) {
      if (currentSellAmount > 0) {
        fetchValue(); // Initial fetch
      } else {
        setcurrentBuyAmount(0);
      }
    }
  
    // Cleanup function to abort any in-flight requests when the effect re-runs
    return () => {
      controller.abort();
    };
  }, [currentSelectedBuyToken, currentSelectedSellToken, currentSellAmount, address]);

  useEffect(() => {
    try {
      const fetchDefaultfees = async () => {
        const protocolFees = sellTokenBalance / 1000;
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/get-quotes?sell_token=${
            currentSelectedSellToken.l2_token_address
          }&buy_token=${
            currentSelectedBuyToken.l2_token_address
          }&sell_amount=${BigInt(
            etherToWeiBN(
              sellTokenBalance-protocolFees,
              currentSelectedSellToken.decimals
            )
          )}`
        );
        if (res) {
          if (address) {
            if (res?.data?.data.aggregator == 0) {
              let arr = [];
              const approveCall = await fibrous.buildApproveStarknet(
                BigNumber.from(
                  BigInt(
                    etherToWeiBN(
                      sellTokenBalance - protocolFees,
                      currentSelectedSellToken.decimals
                    )
                  )
                ),
                currentSelectedSellToken.l2_token_address
              );
              const swapCall = await fibrous.buildTransaction(
                BigNumber.from(
                  BigInt(
                    etherToWeiBN(
                      sellTokenBalance - protocolFees,
                      currentSelectedSellToken.decimals
                    )
                  )
                ),
                currentSelectedSellToken.l2_token_address,
                currentSelectedBuyToken.l2_token_address,
                1,
                address,
                "starknet"
              );
              if (swapCall) {
                arr.push(approveCall);
                arr.push(swapCall);
                const estimated_gas_fee = await getEstimatedGasFees(
                  "MAINNET",
                  processAddress(account?.address as string),
                  processAddress(currentSelectedSellToken.l2_token_address),
                  arr
                );
                setdefaultFees(
                  parseAmount(
                    String(estimated_gas_fee?.estimatedFees),
                    currentSelectedSellToken.decimals
                  )
                );
              }
            } else {
              const res3 = await fetchBuildExecuteTransaction(
                res?.data?.data.quote_id,
                address,
                1,
                true
              );
              if (res3) {
                let arr2: any[] = [];
                arr2.push(...(res3?.calls || []));
                const estimated_gas_fee = await getEstimatedGasFees(
                  "MAINNET",
                  processAddress(account?.address as string),
                  processAddress(currentSelectedSellToken.l2_token_address),
                  arr2
                );
                setdefaultFees(
                  parseAmount(
                    String(estimated_gas_fee?.estimatedFees),
                    currentSelectedSellToken.decimals
                  )
                );
              }
            }
          }
          }
      };
      if (account) {
        if (
          currentSelectedBuyToken.symbol !== "Select a token" &&
          currentSelectedSellToken.symbol !== "Select a token" &&
          sellTokenBalance
        ) {
          fetchDefaultfees();
        }
      }
    } catch (error) {
      console.log(error, "err in fetching fees for deafult");
    }
  }, [
    currentSelectedSellToken,
    currentSelectedBuyToken,
    sellTokenBalance,
    account,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    if (
      currentSelectedBuyToken.symbol !== "Select a token" &&
      currentSelectedSellToken.symbol !== "Select a token"
    ) {
      const fetchExchangeRate = async () => {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/get-quotes?sell_token=${
            currentSelectedSellToken.l2_token_address
          }&buy_token=${
            currentSelectedBuyToken.l2_token_address
          }&sell_amount=${BigInt(
            etherToWeiBN(
              1,
              currentSelectedSellToken.decimals
            )
          )}`,
          {
            signal: controller.signal // Pass the abort signal to axios
          }
        );
        if (!controller.signal.aborted) {
          if (res) {
            setexchangeRate(
              parseAmount(
                String(res?.data?.data.buy_amount),
                currentSelectedBuyToken.decimals
              )
            );
          }
        }
      };
      fetchExchangeRate();
    }
    return () => {
      controller.abort();
    };
  }, [currentSelectedBuyToken, currentSelectedSellToken]);

  useEffect(() => {
    if (currentSelectedSellToken.symbol !== "Select a token") {
      const fetchBalance = async () => {
        const res = await getBalance(
          account?.address as any,
          currentSelectedSellToken.l2_token_address
        );
        setsellTokenBalance(res as number);
      };
      if (account && currentSelectedSellToken.l2_token_address) {
        fetchBalance();
      }
    }
    if (currentSelectedBuyToken.symbol !== "Select a token") {
      const fetchBalance = async () => {
        const res = await getBalance(
          account?.address as any,
          currentSelectedBuyToken.l2_token_address
        );
        setbuyTokenBalance(res as number);
      };
      if (account && currentSelectedBuyToken.l2_token_address) {
        fetchBalance();
      }
    }
  }, [
    currentSelectedSellToken,
    account,
    transactionSuccessfull,
    currentSelectedBuyToken,
  ]);

  return (
    <Box
      padding="1rem"
      pt="7rem"
      width="100%"
      display="flex"
      justifyContent="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        padding="1rem"
        borderRadius="6px"
        width="30rem"
      >
        {/* <SplashCursor/> */}
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
            bg="#0D0D10"
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
                {refereshSellData ? (
                  <Skeleton width="10rem" height="2rem" borderRadius="6px" />
                ) : (
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
                      setsellvalueChanged(!sellvalueChanged);
                      setcurrentSellAmount(Number(e.target.value));
                    }}
                    type="number"
                  />
                )}
              </Box>
              <Box
                bg="#1E2025"
                cursor="pointer"
                padding="8px"
                display="flex"
                borderRadius="8px"
                // width={currentSelectedSellToken.logo_url ? "100px" : "140px"}
                gap="0.4rem"
                alignItems="center"
                onClick={() => {
                  setsellDropdownSelected(true);
                  setbuyDropdownSelected(false);
                }}
              >
                {currentSelectedSellToken.logo_url ? (
                  <Box height="20px" width="20px">
                    <Image
                      src={currentSelectedSellToken.logo_url}
                      alt="trial"
                      height={20}
                      width={20}
                    />
                  </Box>
                ) : (
                  <Box
                    borderRadius="full"
                    boxSize="35px"
                    bg="gray.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="white" fontSize="2xl" fontWeight="bold">
                      ?
                    </Text>
                  </Box>
                )}
                <Text>{currentSelectedSellToken.symbol}</Text>
                <Box>
                  <DropdownUp />
                </Box>
              </Box>
            </Box>
            <Box display="flex" width="100%" justifyContent="space-between">
              {
                <Text color="#9CA3AF">
                  $
                  {sellTokenPrice
                    ? formatNumberEs(sellTokenPrice * currentSellAmount)
                    : 0}
                </Text>
              }
              <Box display="flex" gap="0.4rem">
                <Text color="#9CA3AF">
                  balance: {formatNumberEs(sellTokenBalance)}
                </Text>
                <Box
                  cursor="pointer"
                  color="#3c31ff"
                  onClick={() => {
                    setsellvalueChanged(!sellvalueChanged);
                    setcurrentSellAmount(sellTokenBalance);
                  }}
                >
                  MAX
                </Box>
              </Box>
            </Box>
          </Box>
          <Box alignItems="center" display="flex" justifyContent="center">
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
                setsellTokenBalance(buyTokenBalance);
                setbuyTokenBalance(sellTokenBalance);
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
            bg="#0D0D10"
            borderRadius="12px"
            padding="1rem"
          >
            <Box>
              <Text>Buy</Text>
            </Box>
            <Box display="flex" width="100%" justifyContent="space-between">
              <Box>
                {refreshBuyData ? (
                  <Skeleton width="10rem" height="2rem" borderRadius="6px" />
                ) : (
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
                      setbuyvalueChanged(!buyvalueChanged);
                      setcurrentBuyAmount(Number(e.target.value));
                    }}
                    placeholder="0"
                    type="number"
                  />
                )}
              </Box>
              <Box
                bg="#1E2025"
                cursor="pointer"
                padding="8px"
                display="flex"
                borderRadius="8px"
                // width={currentSelectedBuyToken.logo_url === "" ? "140px" : "100px"}
                gap="0.4rem"
                alignItems="center"
                onClick={() => {
                  setsellDropdownSelected(false);
                  setbuyDropdownSelected(true);
                }}
              >
                {currentSelectedBuyToken?.logo_url ? (
                  <Box height="20px" width="20px">
                    <Image
                      src={currentSelectedBuyToken.logo_url}
                      alt="trial"
                      height={20}
                      width={20}
                    />
                  </Box>
                ) : (
                  <Box
                    borderRadius="full"
                    boxSize="35px"
                    bg="gray.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="white" fontSize="2xl" fontWeight="bold">
                      ?
                    </Text>
                  </Box>
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
              <Text color="#9CA3AF">
                $
                {buyTokenPrice
                  ? formatNumberEs(buyTokenPrice * currentBuyAmount)
                  : 0}
              </Text>
              <Box display="flex" gap="0.4rem">
                <Text color="#9CA3AF">
                  balance: {formatNumberEs(buyTokenBalance)}
                </Text>
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
                  <Text color="#459C6E">
                    1 {currentSelectedSellToken.symbol} ={" "}
                    {numberFormatter(exchangeRate as number)}{" "}
                    {currentSelectedBuyToken.symbol} ($
                    {numberFormatter(sellTokenPrice as number)})
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
                      display={{
                        smToMd: "none",
                        base: "none",
                        md: "block",
                      }}
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
                        <InfoIcon />
                      </Box>
                      <Box display="flex" alignItems="center" gap="0.4rem">
                        {refereshSellData || refreshBuyData ? (
                          <Skeleton
                            width="2.3rem"
                            height=".85rem"
                            borderRadius="6px"
                          />
                        ) : (
                          <Text color="#9CA3AF">
                            {formatNumberEs(minReceived)}{" "}
                            {currentSelectedBuyToken.symbol}
                          </Text>
                        )}
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
                        <InfoIcon />
                      </Box>
                      <Box display="flex" alignItems="center" gap="0.4rem">
                        <Text color="#9CA3AF">0.1%</Text>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          <Button
            borderRadius="8px"
            mt="1rem"
            padding="1rem"
            color="white"
            background="#26513a"
            _hover={{ bg: "#377554" }}
            border="1px solid rgb(69 156 110/1)"
            disabled={
              currentBuyAmount === 0 ||
              currentSellAmount === 0 ||
              currentSelectedBuyToken.symbol === "Select a token" ||
              currentSelectedSellToken.symbol === "Select a token" ||
              transactionStarted ||
              refereshSellData ||
              refreshBuyData ||
              currentSellAmount > sellTokenBalance
            }
            onClick={() => {
              if (!transactionStarted) {
                if (account) {
                  settransactionStarted(true);
                  settransactionSuccessfull(false);
                  handleTransaction();
                } else {
                  settransactionSuccessfull(false);
                  connectWallet();
                  // handleConnectButton();
                }
              }
            }}
          >
            {(transactionStarted || refereshSellData || refreshBuyData) && (
              <Spinner
                color="gray.500"
                css={{ "--spinner-track-color": "colors.gray.200" }}
              />
            )}
            {currentSelectedBuyToken.symbol === "Select a token" ||
            currentSelectedSellToken.symbol === "Select a token"
              ? "Select a token"
              : transactionStarted
              ? "Swapping"
              : account
              ? currentSellAmount > sellTokenBalance
                ? `Insufficient ${currentSelectedSellToken.symbol} Balance`
                : "Swap"
              : "Connect Wallet"}
          </Button>
        </Box>
        {sellDropdownSelected && (
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="rgba(133, 133, 133, 0.6)" // Adjust opacity as needed
            zIndex="200"
            onClick={() => setsellDropdownSelected(false)} // Close modal on click
          >
            <Box
              width="30rem"
              // overflow="auto"
              height="500px"
              mt="13rem"
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
              onClick={(e) => e.stopPropagation()}
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
                    setSearchTerm("");
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Box>
              <Box overflow="auto" className="custom-scrollbar">
                {filteredUsertokens && filteredUsertokens?.length > 0 && (
                  <Text mt="0.5rem" mb="1rem">
                    Your Tokens
                  </Text>
                )}
                {filteredUsertokens?.map((token: any, index: number) => (
                  <Box
                    key={index}
                    display="flex"
                    flexDirection="column"
                    mb="0.5rem"
                  >
                    <Box
                      display="flex"
                      gap="0.8rem"
                      _hover={{ bg: "gray.800" }}
                      padding="0.5rem"
                      borderRadius="8px"
                      cursor="pointer"
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => {
                        setsellDropdownSelected(false);
                        setSellToken(token);
                        setcurrentSelectedSellToken(token);
                        setSearchTerm("");
                      }}
                    >
                      <Box display="flex" gap="0.8rem" alignItems="center">
                        <Box>
                          {token.logo_url ? (
                            <Image
                              src={token.logo_url}
                              alt="trial"
                              height={35}
                              width={35}
                            />
                          ) : (
                            <Box
                              borderRadius="full"
                              boxSize="35px"
                              bg="gray.600"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text
                                color="white"
                                fontSize="2xl"
                                fontWeight="bold"
                              >
                                ?
                              </Text>
                            </Box>
                          )}
                        </Box>
                        <Box>
                          <Text fontSize="18px">{token.name}</Text>
                          <Text fontSize="14px" color="grey">
                            {token.symbol}
                          </Text>
                        </Box>
                      </Box>
                      <Box
                        color="grey"
                        mr="0.5rem"
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                      >
                        {getPriceInUSD(prices, token.l2_token_address) && (
                          <Text color="white">
                            $
                            {numberFormatter(
                              getPriceInUSD(prices, token.l2_token_address)
                                ? getPriceInUSD(
                                    prices,
                                    token.l2_token_address
                                  ) *
                                    parseAmount(
                                      String(token.balance),
                                      token.decimals
                                    )
                                : 0
                            )}
                          </Text>
                        )}
                        <Text>
                          {numberFormatter(
                            parseAmount(String(token.balance), token.decimals)
                          )}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                ))}
                <Text mt="0.5rem" mb="1rem">
                  Popular Tokens
                </Text>
                {filteredTokens
                  .filter(
                    (token: any) =>
                      !userTokens?.some(
                        (userToken: any) =>
                          userToken?.l2_token_address ===
                          processAddress(token?.l2_token_address)
                      )
                  )
                  .map((token: any, index: number) => (
                    <Box
                      key={index}
                      display="flex"
                      flexDirection="column"
                      mb="0.5rem"
                    >
                      <Box
                        display="flex"
                        gap="0.8rem"
                        _hover={{ bg: "gray.800" }}
                        padding="0.5rem"
                        borderRadius="8px"
                        cursor="pointer"
                        alignItems="center"
                        onClick={() => {
                          setsellDropdownSelected(false);
                          setSellToken(token);
                          setcurrentSelectedSellToken(token);
                          setSearchTerm("");
                        }}
                      >
                        <Box>
                          {token.logo_url ? (
                            <Image
                              src={token.logo_url}
                              alt="trial"
                              height={35}
                              width={35}
                            />
                          ) : (
                            <Box
                              borderRadius="full"
                              boxSize="35px"
                              bg="gray.600"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text
                                color="white"
                                fontSize="2xl"
                                fontWeight="bold"
                              >
                                ?
                              </Text>
                            </Box>
                          )}
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
          </Box>
        )}
        {buyDropdownSelected && (
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="rgba(133, 133, 133, 0.6)" // Adjust opacity as needed
            zIndex="200"
            onClick={() => setbuyDropdownSelected(false)} // Close modal on click
          >
            <Box
              width="30rem"
              // overflow="auto"
              height="500px"
              mt="13rem"
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
              onClick={(e) => e.stopPropagation()}
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
                    setSearchTerm("");
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter token name"
                />
              </Box>
              <Box overflow="auto" className="custom-scrollbar">
                {filteredUsertokens && filteredUsertokens?.length > 0 && (
                  <Text mt="0.5rem" mb="1rem">
                    Your Tokens
                  </Text>
                )}
                {filteredUsertokens?.map((token: any, index: number) => (
                  <Box
                    key={index}
                    display="flex"
                    flexDirection="column"
                    mb="0.5rem"
                  >
                    <Box
                      display="flex"
                      gap="0.8rem"
                      _hover={{ bg: "gray.800" }}
                      padding="0.5rem"
                      borderRadius="8px"
                      cursor="pointer"
                      alignItems="center"
                      justifyContent="space-between"
                      onClick={() => {
                        setbuyDropdownSelected(false);
                        setBuyToken(token);
                        setcurrentSelectedBuyToken(token);
                        setSearchTerm("");
                      }}
                    >
                      <Box display="flex" gap="0.8rem" alignItems="center">
                        <Box>
                          {token.logo_url ? (
                            <Image
                              src={token.logo_url}
                              alt="trial"
                              height={35}
                              width={35}
                            />
                          ) : (
                            <Box
                              borderRadius="full"
                              boxSize="35px"
                              bg="gray.600"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text
                                color="white"
                                fontSize="2xl"
                                fontWeight="bold"
                              >
                                ?
                              </Text>
                            </Box>
                          )}
                        </Box>
                        <Box>
                          <Text fontSize="18px">{token.name}</Text>
                          <Text fontSize="14px" color="grey">
                            {token.symbol}
                          </Text>
                        </Box>
                      </Box>
                      <Box
                        color="grey"
                        mr="0.5rem"
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                      >
                        {getPriceInUSD(prices, token.l2_token_address) && (
                          <Text color="white">
                            $
                            {numberFormatter(
                              getPriceInUSD(prices, token.l2_token_address)
                                ? getPriceInUSD(
                                    prices,
                                    token.l2_token_address
                                  ) *
                                    parseAmount(
                                      String(token.balance),
                                      token.decimals
                                    )
                                : 0
                            )}
                          </Text>
                        )}
                        <Text>
                          {numberFormatter(
                            parseAmount(String(token.balance), token.decimals)
                          )}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                ))}
                <Text mt="0.5rem" mb="1rem">
                  Popular Tokens
                </Text>
                {filteredTokens
                  .filter(
                    (token: any) =>
                      !userTokens?.some(
                        (userToken: any) =>
                          userToken?.l2_token_address ===
                          processAddress(token?.l2_token_address)
                      )
                  )
                  .map((token: any, index: number) => (
                    <Box
                      key={index}
                      display="flex"
                      flexDirection="column"
                      mb="0.5rem"
                    >
                      <Box
                        display="flex"
                        gap="0.8rem"
                        _hover={{ bg: "gray.800" }}
                        padding="0.5rem"
                        borderRadius="8px"
                        cursor="pointer"
                        onClick={() => {
                          setbuyDropdownSelected(false);
                          setBuyToken(token);
                          setcurrentSelectedBuyToken(token);
                          setSearchTerm("");
                        }}
                      >
                        <Box>
                          {token.logo_url ? (
                            <Image
                              src={token.logo_url}
                              alt="trial"
                              height={35}
                              width={35}
                            />
                          ) : (
                            <Box
                              borderRadius="full"
                              boxSize="35px"
                              bg="gray.600"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text
                                color="white"
                                fontSize="2xl"
                                fontWeight="bold"
                              >
                                ?
                              </Text>
                            </Box>
                          )}
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
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SwapDashboard;
