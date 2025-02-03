import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <Box
      width="100%"
      display="flex"
      padding="0.5rem 2rem"
      position="fixed"
      zIndex="100"
      bottom="0"
      bg="black"
      justifyContent="space-between"
    >
      <Box></Box>
      <Box display="flex" gap="1rem" alignItems="center">
        <Box cursor="pointer" _hover={{color:'rgb(33, 219, 166)'}} color='grey'>
          <Link href="http://t.me/STRKsnipeBot" target="_blank" style={{display:'flex',alignItems:'center',gap:'0.2rem'}}>
            {/* <TelegramIcon /> */}
            Telegram
          </Link>
        </Box>
        <Box>
          <Link href="" target="_blank">
            <Text _hover={{color:'rgb(33, 219, 166)'}} color='grey'>
              Privacy
            </Text>
          </Link>
        </Box>
        <Box>
          <Link href="" target="_blank">
            <Text _hover={{color:'rgb(33, 219, 166)'}} color='grey'>
              Documentation
            </Text>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
