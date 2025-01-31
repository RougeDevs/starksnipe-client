import { holder } from "@/interfaces/interface";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const HoldersTable = ({ holders }: {holders:holder[]}) => {
  return (
    <Box width="100%" overflowX="auto" mt="1rem">
      <Box display="flex" minW="700px" width="100%" bg="rgb(30 32 37)" justifyContent="space-between" fontWeight="bold" border="1px solid #374151"p={2}>
        <Text flex={1} textAlign="left">Rank</Text>
        <Text flex={1} textAlign="left">Address</Text>
        <Text flex={1} textAlign="left">Amount</Text>
        <Text flex={1} textAlign="left">Percentage</Text>
      </Box>
      <Box width="100%" minW="700px" maxH="300px" overflow="auto">
        {holders.map((holder: holder, index: number) => (
          <Box key={index} _hover={{bg:'#353942'}} display="flex" width="100%" justifyContent="space-between" p={2} border="1px solid #374151" borderTop="0px">
            <Text flex={1} textAlign="left">{holder.rank}</Text>
            <Text flex={1} textAlign="left">{holder.address.substring(0,5)}...{holder.address.substring(holder.address.length-5,holder.address.length)}</Text>
            <Text flex={1} textAlign="left">{holder.amount}</Text>
            <Text flex={1} textAlign="left">{holder.percentage}%</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default HoldersTable;