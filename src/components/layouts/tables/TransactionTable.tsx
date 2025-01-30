import { transaction } from "@/interfaces/interface";
import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const TransactionTable = ({ transactions }:{transactions:transaction[]}) => {
  return (
    <Box width="100%" mt="1rem">
      <Box display="flex" width="100%" bg='rgb(30 32 37)' justifyContent="space-between" fontWeight="bold" border="1px solid #374151"p={2}>
        <Text flex={1} textAlign="left">Date</Text>
        <Text flex={1} textAlign="left">Type</Text>
        <Text flex={1} textAlign="left">Amount</Text>
        <Text flex={1} textAlign="left">User</Text>
        <Text flex={1} textAlign="center">Transaction</Text>
      </Box>
      <Box width="100%" maxH="300px" overflow="auto">
        {transactions.map((transaction: transaction, index: number) => (
          <Box key={index} display="flex" width="100%" _hover={{bg:'#353942'}} justifyContent="space-between" p={2} border="1px solid #374151" borderTop="0px">
            <Text flex={1} textAlign="left">{transaction.Date}</Text>
            <Text flex={1} textAlign="left">{transaction.type}</Text>
            <Text flex={1} textAlign="left">{transaction.amount}</Text>
            <Text flex={1} textAlign="left">{transaction.user.substring(0,5)}...{transaction.user.substring(transaction.user.length-5,transaction.user.length)}</Text>
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