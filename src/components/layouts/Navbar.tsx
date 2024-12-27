import { ArgentTMA } from "@argent/tma-wallet";
import { Box } from "@chakra-ui/react";
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
      <Box>Starksnipe</Box>
      {account ? (
        <Box padding="8px" border="1px solid grey" borderRadius="6px" color="green">
          {`${account.address.substring(0, 5)}...${account?.address.substring(
            account.address.length - 7,
            account.address.length
          )}`}
        </Box>
      ) : (
        <Box
          padding="8px"
          onClick={() => {
            if (argentTma) {
              handleConnectButton();
            }
          }}
        >
          Connect Argent
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
