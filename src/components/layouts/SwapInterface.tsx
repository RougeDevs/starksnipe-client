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
import Image from "next/image";
import React, { useEffect, useState } from "react";
import crossIcon from "../../assets/crossIcon.svg";
import invertIcon from "../../assets/buySellIcon.svg";
import { AccountInterface, CallData, TransactionType } from "starknet";
import InfoIcon from "@/assets/InfoIcon";
import { getBalance } from "@/Blockchain/scripts/swapinteraction";
import { useRouter } from "next/router";
import { useAccount, useConnect } from "@starknet-react/core";
import { fetchQuote, getAllTokens, getSwapCalls } from "@/utils/swapRouter";
import { getMinAmountOut, getParsedTokenData } from "@/utils/helper";
import { fetchAccountCompatibility } from "@avnu/gasless-sdk";
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
  findTokenByAddress,
  findTokenPrice,
  getBalanceUserToken,
  getFlagByCode,
  getPriceInUSD,
} from "@/functions/helpers";
import { swapTokens } from "@/constants";
import { gasLessMode, gasToken } from "@/store/settings.atom";
import { SwapToken } from "@/interfaces/interface";
import numberFormatter from "@/functions/numberFormatter";
const SwapInterface = ({
  prices,
  currencies,
  allTokens,
}: {
  prices: any;
  currencies: any;
  allTokens: any;
}) => {
  const [buyDropdownSelected, setbuyDropdownSelected] =
    useState<boolean>(false);
  const [sellDropdownSelected, setsellDropdownSelected] =
    useState<boolean>(false);
  const [currencyDropdownSelected, setcurrencyDropdownSelected] =
    useState(false);
  const [showPriceDetails, setshowPriceDetails] = useState<boolean>(false);
  const [firstAmountChanged, setfirstAmountChanged] = useState(false);
  const [transactionStarted, settransactionStarted] = useState<boolean>(false);
  const setSellToken = useSetAtom(sellToken);
  const setBuyToken = useSetAtom(buyToken);
  const [buyTokenBalance, setbuyTokenBalance] = useState<number>(0);
  const [sellTokenBalance, setsellTokenBalance] = useState<number>(0);
  const [currentBuyAmount, setcurrentBuyAmount] = useState<number>(0);
  const [buyvalueChanged, setbuyvalueChanged] = useState<boolean>(false);
  const [sellvalueChanged, setsellvalueChanged] = useState<boolean>(false);
  const [convertedSellAmountChanged, setconvertedSellAmountChanged] =
    useState<boolean>(false);
  const [currentSellAmount, setcurrentSellAmount] = useState<number>(0);
  const [currentConvertedSellAmount, setcurrentConvertedSellAmount] =
    useState<number>(0);
  const [currentSelectedCurrencyAmount, setcurrentSelectedCurrencyAmount] =
    useState<number>(1);
  const router = useRouter();
  const [firstReceivedToken, setfirstReceivedToken] = useState("");
  const { address, connector, account } = useAccount();
  const [calls, setcalls] = useState<any>();
  // const [prices, setprices] = useState<any>();
  const [sellTokenPrice, setsellTokenPrice] = useState<number | null>(null);
  const [buyTokenPrice, setbuyTokenPrice] = useState<number | null>(null);
  const [currentSelectedSellToken, setcurrentSelectedSellToken] = useState({
    name: "STRK",
    l2_token_address:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    logo_url: "https://imagedelivery.net/0xPAQaDtnQhBs8IzYRIlNg/1b126320-367c-48ed-cf5a-ba7580e49600/logo",
    decimals: 18,
    symbol: "STRK",
  });
  const [selectedSlippage, setSelectedSlippage] = useState({
    level: "Medium",
    value: "32%",
  });
  const [tabContent, settabContent] = useState("Buy")
  const gasMode=useAtomValue(gasLessMode)
  const gasTokenAddress=useAtomValue(gasToken)
  const [firstPrefilledAmount, setfirstPrefilledAmount] =
    useState<boolean>(false);
  const [minReceived, setminReceived] = useState<any>(0);
  const [refereshData, setrefereshData] = useState<boolean>(false);
  const [refreshBuyData, setrefreshBuyData] = useState<boolean>(false);
  const [refereshSellData, setrefereshSellData] = useState<boolean>(false);
  const [userTokens, setuserTokens] = useState<any>();
  const [exchangeRate, setexchangeRate] = useState<number | null>(null);
  // const [currencies, setcurrencies] = useState<any>();
  const [currentCurrencySelected, setcurrentCurrencySelected] = useState("usd");
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
    // Exclude the currentSelectedSellToken
    if (
      currentSelectedSellToken &&
      (token.name.toLowerCase() === currentSelectedSellToken.name.toLowerCase() ||
        token.symbol.toLowerCase() === currentSelectedSellToken.symbol.toLowerCase())
    ) {
      return false;
    }
  
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
  
  const handleTransaction = async () => {
    try {
      if (account) {
        const res = await fetchAccountCompatibility(account.address);
        if (res?.isCompatible) {
          if(gasMode){
            const result = await exampleExecuteCalls(
              "MAINNET",
              account,
              processAddress(gasTokenAddress),
              calls
            );
            if (result) {
              toast.success("Successfully swapped tokens", {
                position: "bottom-right",
              });
              settransactionSuccessfull(true);
            }
          }else{
            const result = await account.execute(calls);
            if (result) {
              toast.success("Successfully swapped tokens", {
                position: "bottom-right",
              });
              settransactionSuccessfull(true);
            }
          }
        } else {
          const result = await account.execute(calls);
          if (result) {
            toast.success("Successfully swapped tokens", {
              position: "bottom-right",
            });
            settransactionSuccessfull(true);
          }
        }
        settransactionStarted(false);
        // alert(result);
      }
    } catch (error) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
      settransactionStarted(false);
      console.log(error, "err in call");
    }
  };

  useEffect(() => {
    if (allTokens && router.query.address) {
      const valueToken = findTokenByAddress(
        processAddress(router.query.address as string),
        allTokens
      );
      if (valueToken) {
        // setrefreshBuyData(true);
        if(tabContent==='Buy'){
          setcurrentSelectedBuyToken(valueToken);
          setcurrentSelectedSellToken({
            name: "STRK",
            l2_token_address:
              "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            logo_url: "https://imagedelivery.net/0xPAQaDtnQhBs8IzYRIlNg/1b126320-367c-48ed-cf5a-ba7580e49600/logo",
            decimals: 18,
            symbol: "STRK",
          })
        }else{
          setcurrentSelectedBuyToken({
            name: "STRK",
            l2_token_address:
              "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            logo_url: "https://imagedelivery.net/0xPAQaDtnQhBs8IzYRIlNg/1b126320-367c-48ed-cf5a-ba7580e49600/logo",
            decimals: 18,
            symbol: "STRK",
          })
          setcurrentSelectedSellToken(valueToken)
        }
      }
    }
  }, [allTokens, router.query.address,tabContent]);

  useEffect(() => {
    if (router.query.amount) {
      setrefreshBuyData(true);
      setcurrentConvertedSellAmount(Number(router.query.amount));
      setconvertedSellAmountChanged(!convertedSellAmountChanged);
    }
  }, [router.query.amount]);

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
  }, [
    currentSelectedBuyToken,
    currentSelectedSellToken,
    sellvalueChanged,
    convertedSellAmountChanged,
  ]);

  useEffect(() => {
    let intervalId: any;

    const fetchValue = async () => {
      try {
        const protocolFees = currentSellAmount / 1000;
        const res = await fetchQuote(
          BigInt(
            etherToWeiBN(
              currentSellAmount - (protocolFees + 5 * defaultFees),
              currentSelectedSellToken.decimals
            )
          ),
          currentSelectedSellToken.l2_token_address,
          currentSelectedBuyToken.l2_token_address
        );
        if (res) {
          setcurrentBuyAmount(
            parseAmount(res?.total_calculated, currentSelectedBuyToken.decimals)
          );
          const res2 = getMinAmountOut(
            BigInt(res?.total_calculated),
            BigInt(1)
          );
          setminReceived(
            parseAmount(String(res2), currentSelectedBuyToken.decimals)
          );
          const res3 = getSwapCalls(
            currentSelectedSellToken.l2_token_address,
            currentSelectedBuyToken.l2_token_address,
            BigInt(
              etherToWeiBN(
                currentSellAmount - (protocolFees + 5 * defaultFees),
                currentSelectedSellToken.decimals
              )
            ),
            BigInt(1),
            res
          );
          if (res3) {
            const arr: any = res3;
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
        setrefereshData(false);
        setrefereshSellData(false);
        setrefreshBuyData(false);
      } catch (error) {
        console.log(error, "err");
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
  }, [currentSelectedBuyToken, currentSelectedSellToken, currentSellAmount]);

  useEffect(() => {
    try {
      const fetchDefaultfees = async () => {
        const protocolFees = sellTokenBalance / 1000;
        const res = await fetchQuote(
          BigInt(
            etherToWeiBN(
              sellTokenBalance - protocolFees,
              currentSelectedSellToken.decimals
            )
          ),
          currentSelectedSellToken.l2_token_address,
          currentSelectedBuyToken.l2_token_address
        );
        if (res) {
          const res3 = getSwapCalls(
            currentSelectedSellToken.l2_token_address,
            currentSelectedBuyToken.l2_token_address,
            BigInt(
              etherToWeiBN(
                sellTokenBalance - protocolFees,
                currentSelectedSellToken.decimals
              )
            ),
            BigInt(1),
            res
          );
          if (res3) {
            res3.push(
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
                    sellTokenBalance,
                    currentSelectedSellToken.decimals
                  ).toString(),
                  "0",
                ]),
              }
            );
            const estimated_gas_fee = await getEstimatedGasFees(
              "MAINNET",
              processAddress(account?.address as string),
              processAddress(currentSelectedSellToken.l2_token_address),
              res3
            );
            setdefaultFees(
              parseAmount(
                String(estimated_gas_fee?.estimatedFees),
                currentSelectedSellToken.decimals
              )
            );
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
    if (
      currentSelectedBuyToken.symbol !== "Select a token" &&
      currentSelectedSellToken.symbol !== "Select a token"
    ) {
      const fetchExchangeRate = async () => {
        const res = await fetchQuote(
          BigInt(etherToWeiBN(1, currentSelectedSellToken.decimals)),
          currentSelectedSellToken.l2_token_address,
          currentSelectedBuyToken.l2_token_address
        );
        if (res) {
          setexchangeRate(
            parseAmount(
              String(res?.total_calculated),
              currentSelectedBuyToken.decimals
            )
          );
        }
      };
      fetchExchangeRate();
    }
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

  useEffect(() => {
    if (sellTokenPrice) {
      // setcurrentConvertedSellAmount(currentConvertedSellAmount*currentSelectedCurrencyAmount)
      setcurrentSellAmount(
        currentConvertedSellAmount /
          currentSelectedCurrencyAmount /
          sellTokenPrice
      );
      // setsellvalueChanged(!sellvalueChanged);
    }
  }, [convertedSellAmountChanged, currentSelectedCurrencyAmount]);

  useEffect(() => {
    if (sellTokenPrice && firstAmountChanged) {
      setcurrentConvertedSellAmount(
        currentSellAmount * sellTokenPrice * currentSelectedCurrencyAmount
      );
    }
  }, [sellvalueChanged, sellTokenPrice]);
  const [initialData, setinitialData] = useState([])
  // useEffect(()=>{
  //   const fetchChartData=async()=>{
  //     const res=await axios.get('https://starknet.impulse.avnu.fi/v1/tokens/0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7/prices/line?resolution=1&startDate=2025-01-24T06%3A21%3A42.372Z&endDate=2025-01-24T07%3A21%3A42.372Z&in=0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8')
  //     setinitialData(res?.data)
  //   }
  //   fetchChartData()
  // },[])

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
    >
      <Box
        display="flex"
        flexDirection="column"
        borderRadius="6px"
        width="100%"
        // width={{ sm: "80%", md: "30%" }}
      >
        {/* <SplashCursor/> */}
        <Tabs.Root variant="plain" lazyMount unmountOnExit defaultValue="Buy" >
          <Tabs.List width="100%" bg="#0D0D10"  rounded="l3" gap="1rem" padding="8px">
            <Tabs.Trigger
              py="1"
              width="50%"
              px="5"
              textAlign="center"
              color="white"
              fontSize="sm"
              display="flex"
              alignItems="center"
              justifyContent="center"
              // border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              borderRadius="md"
              fontWeight="normal"
              _selected={{
                color: "white",
                bg: "#459c6e",
                border: "none",
              }}
              _hover={tabContent==='Sell'?{bg:'#353942'}:{}}
              onClick={() => {
                setcurrentBuyAmount(0);
                setcurrentSellAmount(0);
                setminReceived(0);
                setcurrentConvertedSellAmount(0)
                settabContent("Buy")
              }}
              value="Buy"
            >
              Buy
            </Tabs.Trigger>
            <Tabs.Trigger
              py="1"
              px="5"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="50%"
              color="white"
              fontSize="sm"
              _hover={tabContent==='Buy'?{bg:'#353942'}:{}}
              // border="1px solid var(--stroke-of-30, rgba(103, 109, 154, 0.30))"
              borderRadius="md"
              fontWeight="normal"
              _selected={{
                color: "white",
                bg: "#a13c45",
                border: "none",
              }}
              onClick={() => {
                setcurrentBuyAmount(0);
                setcurrentSellAmount(0);
                setminReceived(0);
                setcurrentConvertedSellAmount(0)
                settabContent("Sell")
              }}
              value="Sell"
              
            >
              Sell
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value={tabContent}>
            <Box
              display="flex"
              flexDir="column"
              justifyContent="center"
              width="100%"
              mt="0.5rem"
              // gap="0.3rem"
              borderRadius="8px"
              border="1px solid #374151"
              bg="#0D0D10"
            >
              <Box
                display="flex"
                flexDir="column"
                gap="0.5rem"
                borderRadius="12px"
                padding="1rem"
              >
                <Box display="flex" justifyContent="space-between">
                  <Text>{"From"}</Text>
                  <Box display="flex" gap="0.4rem">
                    <Text color="#9CA3AF">
                      balance: {formatNumberEs(sellTokenBalance)}
                    </Text>
                    <Box
                      cursor="pointer"
                      color="#3c31ff"
                      onClick={() => {
                        if (currentSellAmount === sellTokenBalance) {
                        } else {
                          setfirstAmountChanged(true);
                          setsellvalueChanged(!sellvalueChanged);
                          setcurrentSellAmount(sellTokenBalance);
                        }
                      }}
                    >
                      MAX
                    </Box>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="8px"
                  border="1px solid #374151"
                  padding="8px"
                >
                  <Box>
                    {refereshSellData ? (
                      <Skeleton
                        width="10rem"
                        height="2rem"
                        borderRadius="6px"
                      />
                    ) : (
                      <Input
                        border="0px"
                        width="100%"
                        pl="0.4rem"
                        placeholder={`0 ${currentSelectedSellToken.symbol}`}
                        _focus={{
                          outline: "0",
                          border: "0px",
                          boxShadow: "none",
                        }}
                        value={currentSellAmount ? currentSellAmount : ""}
                        onChange={(e) => {
                          setfirstAmountChanged(true);
                          setsellvalueChanged(!sellvalueChanged);
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
                      if(tabContent==='Buy'){
                        setsellDropdownSelected(true);
                        setbuyDropdownSelected(false);
                      }
                    }}
                  >
                    {currentSelectedSellToken.logo_url ? (
                      <Box  
                      height="20px"
                      width="20px">
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
                    {tabContent==='Buy' &&<Box>
                      <DropdownUp />
                    </Box>}
                  </Box>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDir="column"
                gap="0.5rem"
                borderRadius="12px"
                padding="1rem"
                paddingTop="0rem"
              >
                <Box>
                  <Text>Payout Amount</Text>
                </Box>
                <Box
                  display="flex"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="8px"
                  border="1px solid #374151"
                  padding="8px"
                >
                  <Box>
                    {refereshSellData ? (
                      <Skeleton
                        width="10rem"
                        height="2rem"
                        borderRadius="6px"
                      />
                    ) : (
                      <Input
                        border="0px"
                        width="100%"
                        pl="0.4rem"
                        placeholder={`0 ${currentCurrencySelected.toUpperCase()}`}
                        _focus={{
                          outline: "0",
                          border: "0px",
                          boxShadow: "none",
                        }}
                        value={
                          currentConvertedSellAmount
                            ? currentConvertedSellAmount
                            : ""
                        }
                        onChange={(e) => {
                          // setsellvalueChanged(!sellvalueChanged);
                          setfirstAmountChanged(true);
                          setconvertedSellAmountChanged(
                            !convertedSellAmountChanged
                          );
                          setcurrentConvertedSellAmount(Number(e.target.value));
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
                      setcurrencyDropdownSelected(true);
                      setsellDropdownSelected(false);
                      setbuyDropdownSelected(false);
                    }}
                  >
                    <Box
                      height="20px"
                      width="20px"
                      // bg={generateRandomGradient()}
                      borderRadius="200px"
                    >
                      <Image
                        src={
                          getFlagByCode(
                            String(currentCurrencySelected).toUpperCase()
                          ) as string
                        }
                        alt="Country Flag"
                        height={100}
                        width={100}
                      />
                    </Box>
                    <Text textTransform="uppercase">
                      {currentCurrencySelected}
                    </Text>
                    <Box>
                      <DropdownUp />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDir="column"
                gap="0.5rem"
                // border="1px solid #374151"
                // bg="rgba(31, 41, 55, 0.5)"
                borderRadius="12px"
                padding="1rem"
                paddingTop="0rem"
              >
                <Box display="flex" justifyContent="space-between">
                  <Text>To</Text>
                  <Box display="flex" gap="0.4rem">
                    <Text color="#9CA3AF">
                      balance: {formatNumberEs(buyTokenBalance)}
                    </Text>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  width="100%"
                  justifyContent="space-between"
                  padding="8px"
                  borderRadius="8px"
                  border="1px solid #374151"
                  alignItems="center"
                >
                  <Box>
                    {refreshBuyData ? (
                      <Skeleton
                        width="10rem"
                        height="2rem"
                        borderRadius="6px"
                      />
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
                        disabled={true}
                        onChange={(e) => {
                          setbuyvalueChanged(!buyvalueChanged);
                          setcurrentBuyAmount(Number(e.target.value));
                        }}
                        placeholder={`0 ${currentSelectedBuyToken.symbol}`}
                        type="number"
                        css={{
                          "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                            {
                              "-webkit-appearance": "none",
                              margin: 0,
                            },
                        }}
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
                      if(tabContent==='Sell'){
                        setsellDropdownSelected(false);
                        setbuyDropdownSelected(true);
                      }
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
                    {tabContent==='Sell'&&<Box>
                      <DropdownUp />
                    </Box>}
                  </Box>
                </Box>
                <Box display="flex" width="100%" justifyContent="space-between">
                  {
                    <Text color="#9CA3AF">
                      {buyTokenPrice ? "$" : ""}
                      {buyTokenPrice
                        ? formatNumberEs(buyTokenPrice * currentBuyAmount)
                        : ""}
                    </Text>
                  }
                </Box>
              </Box>
              {currentSelectedBuyToken.symbol !== "Select a token" &&
                currentSelectedSellToken.symbol !== "Select a token" && (
                  <Box display="flex" flexDirection="column">
                    <Box
                      width="100%"
                      display="flex"
                      justifyContent="space-between"
                      padding="0px 16px"
                    >
                      <Text color={tabContent==='Buy'? "#459C6E":'#A13C45'} fontSize={{lg:'14px',md:'14px',xl:'16px'}}>
                        1 {currentSelectedSellToken.symbol} ={" "}
                        {numberFormatter(exchangeRate ? exchangeRate : 0)}{" "}
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
                          padding="0px 16px"
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
                          padding="0px 16px"
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
                ml="0.5rem"
                mr="0.5rem"
                mb="2rem"
                padding="1rem"
                color="white"
                bg={tabContent==='Buy'? "#26513a":"#542226"}
                _hover={tabContent==='Buy'?{  bg: "#377554" }:{bg:'#6e2c31'}}
                border={tabContent==='Buy'?"1px solid rgb(69 156 110/1)":'1px solid #8a363c'}
                disabled={
                  currentBuyAmount === 0 ||
                  currentSellAmount === 0 ||
                  currentSelectedBuyToken.symbol === "Select a token" ||
                  currentSelectedSellToken.symbol === "Select a token" ||
                  transactionStarted ||
                  refereshSellData ||
                  refreshBuyData ||
                  (sellTokenBalance !== 0
                    ? currentSellAmount > sellTokenBalance
                    : false)
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
                width={{ base: "70vw", md: "50vw", lg: "25vw" }}
                // overflow="auto"
                height="500px"
                mt="9rem"
                display="flex"
                padding="1rem"
                borderRadius="8px"
                flexDirection="column"
                gap="1rem"
                position="fixed"
                top="35%"
                left="82%"
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
                <Box overflow="auto">
                  {allTokens.filter((token:any)=>swapTokens.some((swapToken:SwapToken)=>processAddress(swapToken?.tokenAddress)===processAddress(token?.l2_token_address)))                   
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
                          justifyContent="space-between"
                          onClick={() => {
                            setsellDropdownSelected(false);
                            setSellToken(token);
                            setcurrentSelectedSellToken(token);
                          }}
                        >
                          <Box display="flex" alignItems="center" gap="0.8rem">
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
                            {
                              <Text color="white">
                                $
                                {formatNumberEs(
                                  getPriceInUSD(
                                    prices,
                                    processAddress(token.l2_token_address)
                                  )
                                    ? getPriceInUSD(
                                        prices,
                                        processAddress(token.l2_token_address)
                                      )
                                    : 0
                                )}
                              </Text>
                            }
                            {userTokens && (
                              <Text>
                                {formatNumberEs(
                                  getBalanceUserToken(
                                    userTokens,
                                    token.l2_token_address
                                  )
                                    ? getBalanceUserToken(
                                        userTokens,
                                        token.l2_token_address
                                      )
                                    : 0
                                )}
                              </Text>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Box>
            </Box>
            )}
            {currencyDropdownSelected && (
              <Box
              position="fixed"
              top="0"
              left="0"
              width="100vw"
              height="100vh"
              bg="rgba(133, 133, 133, 0.6)" // Adjust opacity as needed
              zIndex="200"
              onClick={() => setcurrencyDropdownSelected(false)} // Close modal on click
            >
              <Box
                width={{ base: "70vw", md: "50vw", lg: "25vw" }}
                // overflow="auto"
                height="500px"
                mt="9rem"
                display="flex"
                padding="1rem"
                borderRadius="8px"
                flexDirection="column"
                gap="1rem"
                position="fixed"
                top="35%"
                left="82%"
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
                  <Text>Select a Currency</Text>
                  <Box
                    cursor="pointer"
                    onClick={() => {
                      setcurrencyDropdownSelected(false);
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
                    placeholder="Enter currency symbol"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>
                <Box overflow="auto">
                  {Object.keys(currencies)
                    .filter((token: any) =>
                      token.toLowerCase().includes(searchTerm.toLowerCase())
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
                          justifyContent="space-between"
                          onClick={() => {
                            setcurrentCurrencySelected(token);
                            setcurrencyDropdownSelected(false);
                            setSearchTerm("");
                            setcurrentSelectedCurrencyAmount(currencies[token]);
                          }}
                        >
                          <Box display="flex" alignItems="center" gap="0.8rem">
                            <Box
                              height="16px"
                              width="16px"
                              // bg={generateRandomGradient()}
                              borderRadius="200px"
                            >
                              <Image
                                src={
                                  getFlagByCode(
                                    String(token).toUpperCase()
                                  ) as string
                                }
                                alt="Country Flag"
                                height={100}
                                width={100}
                              />
                            </Box>
                            <Box>
                              <Text
                                textTransform="uppercase"
                                fontSize="14px"
                                color="white"
                              >
                                {token}
                              </Text>
                            </Box>
                          </Box>
                          <Text
                            fontSize="12px"
                            color="gray.400"
                            mr="0.5rem"
                            textTransform="uppercase"
                          >
                            $1 = {formatNumberEs(currencies[token])} {token}
                          </Text>
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
                    width={{ base: "70vw", md: "50vw", lg: "25vw" }}
                    // overflow="auto"
                    height="500px"
                    mt="9rem"
                    display="flex"
                    padding="1rem"
                    borderRadius="8px"
                    flexDirection="column"
                    gap="1rem"
                    position="fixed"
                    top="35%"
                    left="82%"
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
                        placeholder="Enter token name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </Box>
                    <Box overflow="auto" className="custom-scrollbar">
                      {filteredTokens.map((token: any, index: number) => (
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
                              setbuyDropdownSelected(false);
                              setBuyToken(token);
                              setSearchTerm("");
                              setcurrentSelectedBuyToken(token);
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
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Box>
  );
};


export default SwapInterface;
