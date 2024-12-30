import { ArgentTMA } from "@argent/tma-wallet";
import { Box, Button } from "@chakra-ui/react";
import React from "react";

const Navbar = ({ argentTma, account }: any) => {
  const handleConnectButton = async () => {
    await argentTma.requestConnection({
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
  return (
    <Box
      display="flex"
      width="100%"
      justifyContent="space-between"
      padding="1rem 2rem"
      alignItems="center"
    >
      <Box color="#34D399">Starksnipe</Box>
      {account ? (
        <Box padding="8px" border="1px solid grey" borderRadius="6px" color="green">
          {`${account.address.substring(0, 5)}...${account?.address.substring(
            account.address.length - 7,
            account.address.length
          )}`}
        </Box>
      ) : (
        <Button
          padding="8px 16px"
          bg="#4F46E5"
          color="white"
          borderRadius="8px"
          disabled={!argentTma}
          onClick={() => {
            if (argentTma) {
              handleConnectButton();
            }
          }}
        >
          Connect Argent
        </Button>
      )}
    </Box>
  );
};

export default Navbar;
