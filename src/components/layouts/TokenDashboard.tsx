"use client";
import { Box, Button, HStack, Input, SimpleGrid, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { generateRandomGradient } from "@/functions/helpers";
import { RiTwitterXLine } from "react-icons/ri";
import { TbWorld } from "react-icons/tb";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { FaTelegramPlane } from "react-icons/fa";
import STRKLogo from "@/assets/strkLogo";
import { Tooltip } from "../ui/tooltip";
const TokenDashboard = ({ allTokens }: any) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pageSize = 12;
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
          columns={{ sm: 1, md: 2, xl: 3,'2xl':4 }}
          columnGap="8"
          rowGap="10"
        >
          {/* Reduced horizontal spacing with spacingX */}
          {filteredTokens.sort((a:any, b:any) => Number(b.launched_at_block) - Number(a.launched_at_block))
            .slice(startRange, endRange)
            .map((token: any, index: number) => (
              <Box
                key={index}
                cursor="pointer"
                bg="rgb(16 16 20)"
                padding="1rem"
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
                  router.push(`/coin/${token.address}`);
                }}
              >
                <Box
                  display="flex"
                  gap={{ base: "1rem"}}
                  alignItems="center"
                >
                  <Box>
                    <Box
                      height={{
                        base: "90px",
                        sm: "90px",
                        mdToLg: "90px",
                        lg: "90px",
                      }}
                      width={{
                        base: "90px",
                        sm: "90px",
                        mdToLg: "90px",
                        lg: "90px",
                      }}
                      objectFit="contain"
                    >
                      {token.icon_url ? (
                        <Image
                          src={token.icon_url}
                          alt=""
                          height="100"
                          width="100"
                        />
                      ) : (
                        <Box
                          // borderRadius="full"
                          boxSize="90px"
                          bg="rgb(2, 133, 96)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text color="white" fontSize="4xl" fontWeight="bold">
                            S
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box display="flex" flexDir="column">
                    <Box
                      fontSize={{ base: "16px", md: "18px" }}
                      color="#C9D3EE"
                    >
                      {token.symbol}
                    </Box>
                    <Box color="#459C6E" whiteSpace="nowrap">
                      Market Cap: ${token.market_cap}
                    </Box>
                    <Box color="grey">{token.symbol}</Box>
                    <Tooltip closeDelay={300}  contentProps={{ css: { "padding":'8px',bg:'rgb(30 32 37)',color:'white',zIndex:200 } }} openDelay={100}  content={token?.address}>
                      <Box
                        mt="0.4rem"
                        display="flex"
                        alignItems="center"
                        gap="0.4rem"
                        color="#C9D3EE"
                      >
                        <Text>Address: </Text>
                        <Box
                          height="16px"
                          width="16px"
                          cursor="pointer"
                          bg={generateRandomGradient()}
                          borderRadius="200px"
                        ></Box>
                          <Text>{token?.address.substring(0,5)}...{token?.address.substring(token?.address.length-5,token?.address.length)} </Text>
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
                <Box display='flex' justifyContent="center" alignItems="center" mt="1rem" gap="6rem">
                  <Box display='flex'   width='100%'  gap="1rem" alignItems="center">
                    <Text>
                      <RiTwitterXLine height="20px" width="20px" />
                    </Text>
                    <Text>
                    <TbWorld  height="20px" width="20px" />
                    </Text>
                    <Text>
                    <FaTelegramPlane  height="20px" width="20px" />
                    </Text>
                  </Box>
                  <Box whiteSpace="nowrap" display="flex" alignItems="center" gap="0.3rem">
                    Deployed on
                    <STRKLogo width={20} height={20} />
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
