import { Box, Spinner, Tabs, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { LuFolder, LuUser } from "react-icons/lu";
import SwapInterface from "./SwapInterface";
import { MdAttachMoney } from "react-icons/md";
import Image from "next/image";
import { epochToDateTime, generateRandomGradient } from "@/functions/helpers";
import { useRouter } from "next/router";
import TransactionTable from "./tables/TransactionTable";
import HoldersTable from "./tables/HoldersTable";
import ToptradersTable from "./tables/ToptradersTable";
import { holder, token, tokenTransaction, transaction } from "@/interfaces/interface";
import Link from "next/link";
import axios from "axios";
import { useBlock, useBlockNumber } from "@starknet-react/core";
import { BlockNumber } from "starknet";
import { parseAmount } from "@/Blockchain/utils/utils";
import { Tooltip } from "../ui/tooltip";
import numberFormatter from "@/functions/numberFormatter";
const MemeCoinDashboard = ({ allTokens, currencies, prices }: any) => {
  const router = useRouter();
  const [memeCoinData, setmemeCoinData] = useState<token>();
  const [tokenTransactions, settokenTransactions] = useState<tokenTransaction[]>()
  const block=useBlock({blockIdentifier:memeCoinData?.coinData?.launched_at_block as BlockNumber})
  //   {
  //     rank: 1,
  //     address:
  //       "0x05970da1011e2f8dc15bc12fc1b0eb8e382300a334de06ad17d1404384b168e4",
  //     amount: 900,
  //     percentage: 8,
  //   },
  // ];

  useEffect(() => {
    if (router.query.address) {
      try {
        const fetchData = async () => {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/token-data?token_address=${router.query.address}`
          );
          if (res?.data) {
            setmemeCoinData(res?.data?.data);
          }
        };
        fetchData();
      } catch (error) {
        console.log(error, "err in fetch call");
      }
      try {
        const fetchData = async () => {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/transactions?token_address=${router.query.address}`
          );
          if (res?.data) {
            settokenTransactions(res?.data?.data)
          }
        };
        fetchData();
      } catch (error) {
        console.log(error,'err in fetcing transactions')
      }
    }
  }, [router.query.address]);

  return (
    <Box
      pt="6rem"
      width="100%"
      display="flex"
      alignItems="center"
      paddingLeft={{ base: "1rem", lg: "3rem" }}
      paddingRight={{ base: "1rem", lg: "3rem" }}
    >
      {memeCoinData ? (
        <Box
          display="flex"
          flexDirection={{ base: "column", lg: "row" }}
          gap="1rem"
          width="100%"
          bg="rgb(16 16 20)"
          marginBottom="5rem"
          padding={{ base: "1rem", lg: "2rem" }}
          borderRadius="8px"
        >
          <Box
            width={{ sm: "100%", lg: "70%" }}
            border="1px solid #374151"
            borderRadius="8px"
            padding="1rem"
            display="flex"
            flexDir="column"
          >
            <Box>
              <Box display="flex" gap="0.5rem">
                {memeCoinData?.coinData.icon_url ? (
                  <Image
                    src={memeCoinData?.coinData.icon_url}
                    alt=""
                    height={30}
                    width={30}
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
                    <Text color="white" fontSize="2xl" fontWeight="bold">
                      ?
                    </Text>
                  </Box>
                )}
                <Text fontSize="24px">{memeCoinData?.coinData.symbol} ({memeCoinData?.coinData.name})</Text>
              </Box>
              <Box
                width="100%"
                justifyContent="space-between"
                display="flex"
                flexWrap="wrap"
                gap="1rem"
                mt="1rem"
              >
                {router.query.address && (
                  <Box color="#98989B" textDecoration="underline">
                    <Tooltip closeDelay={300}  contentProps={{ css: { "padding":'8px',bg:'rgb(30 32 37)',color:'white' } }} openDelay={100}  content={router.query?.address}>
                      <Link href={`https://starkscan.co/contract/${router.query.address}`} target="_blank">
                        {String(router.query?.address)?.substring(0, 5)}...
                        {String(router.query?.address)?.substring(
                          router.query?.address.length - 5,
                          router.query?.address.length
                        )}
                      </Link>
                    </Tooltip>
                  </Box>
                )}
                <Box color="#459C6E" display="flex" gap="0.2rem">
                  <Text color="#98989B">Market Cap:</Text>$
                  {memeCoinData?.coinData.market_cap}
                </Box>
                {memeCoinData?.coinData?.owner!=='0' &&<Box display="flex" alignItems="center" gap="0.4rem">
                  <Text color="#98989B">Deployed By</Text>
                  <Box
                    height="16px"
                    width="16px"
                    cursor="pointer"
                    bg={generateRandomGradient()}
                    borderRadius="200px"
                  ></Box>
                  {memeCoinData?.coinData?.owner && (
                    <Text textDecoration="underline" cursor="pointer">
                      <Link href="">
                        {String(memeCoinData?.coinData?.owner)?.substring(0, 5)}...
                        {String(memeCoinData?.coinData?.owner)?.substring(
                          memeCoinData?.coinData?.owner.length - 5,
                          memeCoinData?.coinData?.owner.length
                        )}
                      </Link>
                    </Text>
                  )}
                </Box>}
                {block?.data?.timestamp &&<Box display="flex" gap="0.2rem">
                  <Text color="#98989B">Created on</Text>
                  {epochToDateTime(block?.data?.timestamp)}
                </Box>}
              </Box>
              <Box
                width="100%"
                justifyContent="space-between"
                display="flex"
                flexWrap="wrap"
                gap="1rem"
                mt="1rem"
              >
                <Box color="#459C6E" display="flex" gap="0.2rem">
                  <Text color="#98989B">Total Supply:</Text>
                  { parseAmount(memeCoinData?.coinData.total_supply,18)}
                </Box>                
                <Box display="flex" gap="0.2rem">
                  <Text color="#98989B">Current Price: </Text>$
                  {memeCoinData?.coinData.current_price}
                </Box>

                <Box display="flex" gap="0.2rem">
                  <Text color="#98989B">Team Allocation: </Text>
                  {memeCoinData?.coinData.team_allocation}
                </Box>
              </Box>
            </Box>
            <Tabs.Root defaultValue="transactions" mt="1rem">
              <Tabs.List rounded="13" gap="1rem">
                <Tabs.Trigger
                  value="transactions"
                  _selected={{
                    color: "#61DC9B",
                  }}
                >
                  <MdAttachMoney />
                  Transactions
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="holders"
                  _selected={{
                    color: "#61DC9B",
                  }}
                >
                  <LuUser />
                  Holders
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="holders">
                <HoldersTable holders={memeCoinData?.holders} />
              </Tabs.Content>
              <Tabs.Content value="transactions">
                <TransactionTable transactions={tokenTransactions as tokenTransaction[]} />
              </Tabs.Content>
            </Tabs.Root>
          </Box>
          <Box
            width={{ sm: "100%", lg: "30%" }}
            border="1px solid #374151"
            borderRadius="8px"
            padding="1rem"
          >
            <SwapInterface
              allTokens={allTokens}
              currencies={currencies}
              prices={prices}
            />
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection={{ base: "column", lg: "row" }}
          gap="1rem"
          justifyContent="center"
          alignItems="center"
          height="80vh"
          width="100%"
          bg="rgb(16 16 20)"
          marginBottom="5rem"
          padding={{ base: "1rem", lg: "2rem" }}
          borderRadius="8px"
        >
          <Spinner />
        </Box>
      )}
    </Box>
  );
};

export default MemeCoinDashboard;
