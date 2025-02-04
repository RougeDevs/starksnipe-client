import { Box, Button, HStack, Input, SimpleGrid, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { generateRandomGradient } from "@/functions/helpers";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
const TokenDashboard = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pageSize = 6;
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: any, index: number) => {
    setHoveredIndex(index);
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    const x = ((clientX - left) / width - 0.5) * 25; // Adjusts tilt sensitivity
    const y = ((clientY - top) / height - 0.5) * 25; // Adjusts tilt sensitivity

    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTilt({ x: 0, y: 0 });
  };
  const tokens = Array(20).fill({
    name: "ETH",
    l2_token_address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    logo_url: "https://token-icons.s3.amazonaws.com/eth.png",
    decimals: 18,
    symbol: "ETH",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const filteredTokens = tokens.filter((token: any) => {
    return (
      searchTerm === "" ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const count = filteredTokens.length;
  return (
    <Box display="flex" width="100%" justifyContent="center" pt="6rem">
      <Box
        width={{ sm: "100%", base: "100%", md: "100%" }}
        padding={{ sm: "1rem 4rem", base: "1rem" }}
      >
        <Box
          width={{ base: "100%", sm: "95%" }}
          bg="grey"
          borderRadius="8px"
          mb="2rem"
        >
          <Input
            _selected={{ border: "1px solid blue" }}
            bg="#101010"
            pl="0.4rem"
            placeholder="Enter token name or token symbol"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <SimpleGrid
          alignItems="center"
          columns={{ sm: 1, md: 2, xl: 3 }}
          rowGap="10"
        >
          {/* Reduced horizontal spacing with spacingX */}
          {filteredTokens
            .slice(startRange, endRange)
            .map((token, index: number) => (
              <Box
                key={index}
                cursor="pointer"
                bg="rgb(16 16 20)"
                padding="2rem 0rem"
                width={{ base: "100%", sm: "90%", md: "90%" }}
                gap="0.5rem"
                border="1px solid rgb(30 32 37)"
                borderRadius="8px"
                position="relative"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                boxShadow="md"
                transition="transform 0.3s ease-out"
                transform={
                  hoveredIndex === index
                    ? `perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
                    : "none"
                }
                onMouseMove={(e) => {
                  handleMouseMove(e, index);
                }}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  router.push(`/coin/${token.l2_token_address}`);
                }}
              >
                <Box
                  display="flex"
                  gap={{ base: "1rem", lg: "1.5rem" }}
                  alignItems="center"
                >
                  <Box
                    height={{
                      base: "90px",
                      sm: "90px",
                      mdToLg: "90px",
                      lg: "100px",
                    }}
                    width={{
                      base: "90px",
                      sm: "90px",
                      mdToLg: "90px",
                      lg: "100px",
                    }}
                  >
                    <Image
                      src={token.logo_url}
                      alt=""
                      height="100"
                      width="100"
                      style={{ cursor: "pointer", borderRadius: "40px" }}
                    />
                  </Box>
                  <Box display="flex" flexDir="column">
                    <Box
                      fontSize={{ base: "16px", md: "18px" }}
                      color="#C9D3EE"
                    >
                      {token.symbol}
                    </Box>
                    <Box color="#61DC9B" whiteSpace="nowrap">
                      Market Cap: $34000
                    </Box>
                    <Box color="grey">{token.symbol}</Box>
                    <Box
                      mt="0.4rem"
                      display="flex"
                      alignItems="center"
                      gap="0.4rem"
                      color="#C9D3EE"
                    >
                      <Text whiteSpace="nowrap">Deployed by</Text>
                      <Box
                        height="16px"
                        width="16px"
                        cursor="pointer"
                        bg={generateRandomGradient()}
                        borderRadius="200px"
                      ></Box>
                      <Text>Address</Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
        </SimpleGrid>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PaginationRoot
            mb="4rem"
            page={page}
            count={count}
            pageSize={pageSize}
            onPageChange={(e) => setPage(e.page)}
            variant="solid"
            mt="2rem"
          >
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </Box>
      </Box>
    </Box>
  );
};

export default TokenDashboard;
