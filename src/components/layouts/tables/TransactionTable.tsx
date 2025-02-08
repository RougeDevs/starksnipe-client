import { Tooltip } from "@/components/ui/tooltip";
import { timeAgo } from "@/functions/helpers";
import numberFormatter from "@/functions/numberFormatter";
import { tokenTransaction, transaction } from "@/interfaces/interface";
import { Box, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const TransactionTable = ({ transactions }:{transactions:tokenTransaction[]}) => {
  const skeletonValues = Array(12).fill("");
  const columnItems=["Address","Date","Type","Amount","Transaction"]
  return (
    <Box width="100%" mt="1rem" overflowX="auto">
      <Box display="flex" minW="700px" width="100%" bg='rgb(30 32 37)' justifyContent="space-between" fontWeight="bold" border="1px solid #374151"p={2} color="#98989B">
        {columnItems.map((columnItem:string,indexColumn:number)=>(
          <Text key={indexColumn} flex={1} textAlign={indexColumn===columnItems.length-1?"right":indexColumn===0?"left":'center'} mr={indexColumn===columnItems.length-1?"1.5rem":"0"}>
            {columnItem}
          </Text>
        ))}
      </Box>
      {!transactions &&
        <Box width="100%" minW="700px" maxH="300px" overflow="auto">
          {skeletonValues.map((skeleton: string, indexSkeleton: number) => (
            <Box
              key={indexSkeleton}
              _hover={{ bg: "#353942" }}
              display="flex"
              width="100%"
              justifyContent="space-between"
              p={2}
              border="1px solid #374151"
              borderTop="0px"
            >
              {Array(5).fill("").map((_,index2:number)=>(
                <Text flex={1} key={index2} width="100%" display="flex" justifyContent={index2==0?"flex-start":index2===4?'right': 'center'} mr={index2===4?"2rem":""}>
                  <Skeleton width="4rem" height=".85rem" borderRadius="6px" />
                </Text>
              ))}
            </Box>
          ))}
        </Box>}
      {transactions &&<Box width="100%" minW="700px" maxH="330px" overflow="auto" className="custom-scrollbar">
        {transactions.sort((a, b) => Number(b.timestamp) - Number(a.timestamp)).map((transaction: tokenTransaction, index: number) => (
          <Box key={index} display="flex" width="100%"  _hover={{bg:'#353942'}} justifyContent="space-between" p={2} border="1px solid #374151" borderTop="0px">
             <Tooltip closeDelay={300}  contentProps={{ css: { "padding":'8px',bg:'rgb(30 32 37)',color:'white' } }} openDelay={100}  content={transaction?.account_address}>
                <Text flex={1} textAlign="left" color="#9CA3AF">
                  <Link style={{textAlign:'left',flex:'1',textDecoration:'underline'}} href={`https://starkscan.co/contract/${transaction.account_address}`} target="_blank">
                      {transaction?.account_address?.substring(0,5)}...{transaction.account_address?.substring(transaction.account_address.length-5,transaction?.account_address.length)}
                  </Link>
                </Text>
             </Tooltip>
            <Text flex={1} textAlign="center" color="#98989B">{timeAgo(String(transaction.timestamp))}</Text>
            <Text flex={1} textAlign="center" color={transaction.trade_type==='buy'?"#459C6E":'#A13C45'}>{transaction.trade_type}</Text>
            <Text flex={1} textAlign="center" color="#98989B">{numberFormatter(transaction.amount.replace(/,/g, ""))}</Text>
            <Tooltip closeDelay={300}  contentProps={{ css: { "padding":'8px',bg:'rgb(30 32 37)',color:'white' } }} openDelay={100}  content={transaction.tx_hash}>
              <Text flex={1} textAlign="right" textDecoration="underline" color="#9CA3AF" mr={"0.5rem"}>
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