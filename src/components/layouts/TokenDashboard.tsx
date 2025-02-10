"use client";
import { Box, Button, HStack, Input, SimpleGrid, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { generateRandomGradient } from "@/functions/helpers";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import axios from "axios";
const TokenDashboard = ({ allTokens }: any) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pageSize = 6;
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [currentTokens, setcurrentTokens] = useState([]);
  const [totalTokensLength, settotalTokensLength] = useState(100);

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
  const [searchTerm, setSearchTerm] = useState("");
  const filteredTokens = allTokens?.filter((token: any) => {
    return (
      searchTerm === "" ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const count = allTokens.length;
  return (
    <Box display="flex" width="100%" justifyContent="center" pt="6rem">
      <Box
        width={{ sm: "100%", base: "100%", md: "100%" }}
        padding={{ sm: "1rem 3rem", base: "1rem" }}
      >
        <Box
          width={{ base: "100%", sm: "100%" }}
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
          gap="10"
        >
          {/* Reduced horizontal spacing with spacingX */}
          {filteredTokens
            .slice(startRange, endRange)
            .map((token: any, index: number) => (
              <Box
                key={index}
                cursor="pointer"
                bg="rgb(16 16 20)"
                padding="2rem 0rem"
                width={{ base: "100%" }}
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
                    {token.logo_url ? (
                      <Image
                        src={token.logo_url}
                        alt=""
                        height="100"
                        width="100"
                        objectFit="cover"
                      />
                    ) : (
                      <Box
                        borderRadius="full"
                        boxSize="90px"
                        bg="gray.600"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text color="white" fontSize="4xl" fontWeight="bold">
                          ?
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Box display="flex" flexDir="column">
                    <Box
                      fontSize={{ base: "16px", md: "18px" }}
                      color="#C9D3EE"
                    >
                      {token.symbol}
                    </Box>
                    <Box color="#459C6E" whiteSpace="nowrap">
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
