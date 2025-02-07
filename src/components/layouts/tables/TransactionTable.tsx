import { Tooltip } from "@/components/ui/tooltip";
import { timeAgo } from "@/functions/helpers";
import numberFormatter from "@/functions/numberFormatter";
import { tokenTransaction, transaction } from "@/interfaces/interface";
import { Box, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const TransactionTable = ({ transactions }:{transactions:tokenTransaction[]}) => {
  const skeletonValues = Array(12).fill("");
  const columnItems=["User","Date","Type","Amount","Transaction"]
  return (
    <Box width="100%" mt="1rem" overflowX="auto">
      <Box display="flex" minW="700px" width="100%" bg='rgb(30 32 37)' justifyContent="space-between" fontWeight="bold" border="1px solid #374151"p={2}>
        {columnItems.map((columnItem:string,index:number)=>(
          <Text flex={1} textAlign={index===columnItems.length-1?"center":"left"}>
            {columnItem}
          </Text>
        ))}
      </Box>
      {!transactions &&
        <Box width="100%" minW="700px" maxH="300px" overflow="auto">
          {skeletonValues.map((skeleton: string, index: number) => (
            <Box
              key={index}
              _hover={{ bg: "#353942" }}
              display="flex"
              width="100%"
              justifyContent="space-between"
              p={2}
              border="1px solid #374151"
              borderTop="0px"
            >
              {Array(5).fill("").map((index:number)=>(
                <Text flex={1} key={index} textAlign={index ===columnItems.length-1?"center": "left"}>
                  <Skeleton width="4rem" height=".85rem" borderRadius="6px" />
                </Text>
              ))}
            </Box>
          ))}
        </Box>}
      {transactions &&<Box width="100%" minW="700px" maxH="300px" overflow="auto">
        {transactions.map((transaction: tokenTransaction, index: number) => (
          <Box key={index} display="flex" width="100%"  _hover={{bg:'#353942'}} justifyContent="space-between" p={2} border="1px solid #374151" borderTop="0px">
             <Tooltip closeDelay={300}  contentProps={{ css: { "padding":'8px',bg:'rgb(30 32 37)',color:'white' } }} openDelay={100}  content={transaction?.account_address}>
              <Link style={{textAlign:'left',flex:'1',textDecoration:'underline'}} href={`https://starkscan.co/contract/${transaction.account_address}`} target="_blank">
                <Text flex={1} textAlign="left">{transaction?.account_address?.substring(0,5)}...{transaction.account_address?.substring(transaction.account_address.length-5,transaction?.account_address.length)}</Text>
              </Link>
             </Tooltip>
            <Text flex={1} textAlign="left" color={transaction.trade_type==='buy'?"#459C6E":'#A13C45'}>{timeAgo(String(transaction.timestamp))}</Text>
            <Text flex={1} textAlign="left" color={transaction.trade_type==='buy'?"#459C6E":'#A13C45'}>{transaction.trade_type}</Text>
            <Text flex={1} textAlign="left" color={transaction.trade_type==='buy'?"#459C6E":'#A13C45'}>{numberFormatter(transaction.amount.replace(/,/g, ""))}</Text>
            <Tooltip closeDelay={300}  contentProps={{ css: { "padding":'8px',bg:'rgb(30 32 37)',color:'white' } }} openDelay={100}  content={transaction.tx_hash}>
              <Text flex={1} textAlign="center" textDecoration="underline">
                  <Link href={`https://starkscan.co/tx/${transaction.tx_hash}`} target="_blank">
                      {transaction.tx_hash.substring(0,5)}...{transaction.tx_hash.substring(transaction.tx_hash.length-5,transaction.tx_hash.length)}
                  </Link>
              </Text>
            </Tooltip>
          </Box>
        ))}
      </Box>}
    </Box>
  );
};

export default TransactionTable;