import { Box, Button } from "@chakra-ui/react";
import React from "react";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { GiHamburgerMenu } from "react-icons/gi";
import ShinyText from "@/components/animatedComponents/ShinnyText";
import { FaGasPump } from "react-icons/fa";
import { useRouter } from "next/router";
const NavbarDrawer = ({
  open,
  setOpen,
  gaslessdropdownSelected,
  setgaslessdropdownSelected,
  setwalletDropdownSelected,
}: any) => {
  const router = useRouter();
  return (
    <Box hideFrom="md">
      <DrawerRoot size="sm" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DrawerBackdrop />
        <DrawerTrigger asChild>
          <Box
            hideFrom="md"
            border="1px solid #374151"
            padding="12px"
            borderRadius="8px"
          >
            <GiHamburgerMenu />
          </Box>
        </DrawerTrigger>
        <DrawerContent padding="1rem">
          <DrawerHeader>
            <DrawerTitle>
              <ShinyText text="SniQ" />
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody
            display="flex"
            width="100%"
            mt="2rem"
            justifyContent="center"
            // alignItems="center"
          >
            <Box display="flex" flexDir="column" gap="1rem" width="100%">
              <Box
                border="1px solid grey"
                borderRadius="8px"
                padding="8px 16px"
                width="100%"
                cursor="pointer"
                textAlign="center"
                onClick={() => {
                  router.push("/");
                  setOpen(false);
                }}
              >
                Home
              </Box>
              <Box
                border="1px solid grey"
                borderRadius="8px"
                padding="8px 16px"
                cursor="pointer"
                width="100%"
                textAlign="center"
                onClick={() => {
                  router.push("/swap");
                  setOpen(false);
                }}
              >
                Swap
              </Box>
              <Button
                border="1px solid grey"
                borderRadius="8px"
                padding="8px 16px"
                width="100%"
                textAlign="center"
                onClick={() => {
                  setOpen(false);
                }}
                color="white"
                disabled={true}
                bg="transparent"
              >
                Launch Coin 🚀
              </Button>
              <Box
                cursor="pointer"
                width="100%"
                textAlign="center"
                padding="8px 16px"
                display="flex"
                justifyContent="center"
                border="1px solid grey"
                _hover={{ bg: "grey" }}
                // bg="grey"
                borderRadius="8px"
                onClick={() => {
                  setgaslessdropdownSelected(!gaslessdropdownSelected);
                  setwalletDropdownSelected(false);
                  setOpen(false);
                }}
              >
                <FaGasPump />
              </Box>
            </Box>
          </DrawerBody>
          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerActionTrigger>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </Box>
  );
};

export default NavbarDrawer;
