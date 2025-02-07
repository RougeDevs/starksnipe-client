import { parseAmount } from "@/Blockchain/utils/utils";
import { Tooltip } from "@/components/ui/tooltip";
import numberFormatter from "@/functions/numberFormatter";
import { holder } from "@/interfaces/interface";
import { Box, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const HoldersTable = ({ holders }: { holders: holder[] }) => {
  const skeletonValues = Array(12).fill("");
  const columnItems=["Rank","Address","Amount","Percentage"]
  return (
    <Box width="100%" overflowX="auto" mt="1rem">
      <Box
        display="flex"
        minW="700px"
        width="100%"
        bg="rgb(30 32 37)"
        justifyContent="space-between"
        fontWeight="bold"
        border="1px solid #374151"
        p={2}
      >
        {columnItems.map((columnItem:string,index:number)=>(
          <Text flex={1} textAlign="left">
            {columnItem}
          </Text>
        ))}
      </Box>
      {!holders && 
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
              {Array(4).fill("").map((index:number)=>(
                <Text flex={1} key={index} textAlign="left">
                  <Skeleton width="4rem" height=".85rem" borderRadius="6px" />
                </Text>
              ))}
            </Box>
          ))}
        </Box>}
        {holders &&<Box width="100%" minW="700px" maxH="300px" overflow="auto">
          {holders.map((holder: holder, index: number) => (
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
              <Text flex={1} textAlign="left">
                {index + 1}
              </Text>
              <Tooltip closeDelay={300}  contentProps={{ css: { "padding":'8px',bg:'rgb(30 32 37)',color:'white' } }} openDelay={100}  content={holder.holder}>
                <Link href={`https://starkscan.co/contract/${holder.holder}`} target="_blank" style={{flex:'1',textAlign:'left',textDecoration:'underline'}}>
                  <Text flex={1} textAlign="left">
                    {holder.holder.substring(0, 5)}...
                    {holder.holder.substring(
                      holder.holder.length - 5,
                      holder.holder.length
                    )}
                  </Text>
                </Link>
              </Tooltip>
              <Text flex={1} textAlign="left">
                {numberFormatter(holder.balance)}
              </Text>
              <Text flex={1} textAlign="left">
                {holder.percentage}
              </Text>
            </Box>
          ))}
        </Box>}
    </Box>
  );
};

export default HoldersTable;
