import { Tooltip } from "@/components/ui/tooltip";
import { transaction } from "@/interfaces/interface";
import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const TransactionTable = ({ transactions }:{transactions:transaction[]}) => {
  return (
    <Box width="100%" mt="1rem" overflowX="auto">
      <Box display="flex" minW="700px" width="100%" bg='rgb(30 32 37)' justifyContent="space-between" fontWeight="bold" border="1px solid #374151"p={2}>
      <Text flex={1} textAlign="left">User</Text>
        <Text flex={1} textAlign="left">Date</Text>
        <Text flex={1} textAlign="left">Type</Text>
        <Text flex={1} textAlign="left">Amount</Text>
        <Text flex={1} textAlign="center">Transaction</Text>
      </Box>
      <Box width="100%" minW="700px" maxH="300px" overflow="auto">
        {transactions.map((transaction: transaction, index: number) => (
          <Box key={index} display="flex" width="100%" _hover={{bg:'#353942'}} justifyContent="space-between" p={2} border="1px solid #374151" borderTop="0px">
             <Tooltip closeDelay={300}  contentProps={{ css: { "padding":'8px',bg:'rgb(30 32 37)',color:'white' } }} openDelay={100}  content={transaction.user}>
              <Link style={{textAlign:'left',flex:'1',textDecoration:'underline'}} href={`https://starkscan.co/contract/${transaction.user}`} target="_blank">
                <Text flex={1} textAlign="left">{transaction.user.substring(0,5)}...{transaction.user.substring(transaction.user.length-5,transaction.user.length)}</Text>
              </Link>
             </Tooltip>
            <Text flex={1} textAlign="left">{transaction.Date}</Text>
            <Text flex={1} textAlign="left">{transaction.type}</Text>
            <Text flex={1} textAlign="left">{transaction.amount}</Text>
            <Text flex={1} textAlign="center" textDecoration="underline">
                <Link href={transaction.tx}>
                    Link
                </Link>
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TransactionTable;