import { Box, Text } from "@chakra-ui/react";
import React from "react";

const ToptradersTable = ({ traders }: any) => {
  return (
    <Box width="100%" mt="1rem">
      <Box display="flex" width="100%" justifyContent="space-between" fontWeight="bold" border="1px solid black"p={2} borderBottom="0px">
        <Text flex={1} textAlign="left">Date</Text>
        <Text flex={1} textAlign="left">Type</Text>
        <Text flex={1} textAlign="left">Amount</Text>
        <Text flex={1} textAlign="left">User</Text>
        <Text flex={1} textAlign="left">Transaction</Text>
      </Box>
      <Box width="100%" >
        {traders.map((trader: any, index: number) => (
          <Box key={index} display="flex" width="100%" justifyContent="space-between" p={2} border="1px solid black"  borderTop={index===trader.length? "0px":"1px solid black"}>
            <Text flex={1} textAlign="left">yello</Text>
            <Text flex={1} textAlign="left">y</Text>
            <Text flex={1} textAlign="left">y</Text>
            <Text flex={1} textAlign="left">y</Text>
            <Text flex={1} textAlign="left">y</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ToptradersTable;