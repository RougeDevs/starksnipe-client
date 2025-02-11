import ParticleBackground from "@/components/animatedComponents/Particlebackground";
import Footer from "@/components/layouts/Footer/Footer";
import Navbar from "@/components/layouts/Navbar/Navbar";
import SwapDashboard from "@/components/layouts/SwapDashboard";
import { Pricer } from "@/interfaces/interface";
import { getAllTokens } from "@/utils/swapRouter";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import React from "react";

const Index = ({ prices, allTokens }: { prices: Pricer[]; allTokens: any }) => {
  return (
    <Box minH="100vh">
      <Head>
        <title>SniQ | Memecoin Snipping</title>
      </Head>
      <Navbar allTokens={allTokens} />
      <ParticleBackground />
      <SwapDashboard allTokens={allTokens} prices={prices} />
      <Footer />
    </Box>
  );
};

export default Index;

export async function getStaticProps() {
  try {
    const res2 = await axios.get(
      "https://starknet.api.avnu.fi/paymaster/v1/gas-token-prices"
    );

    const res3 = await getAllTokens();

    return {
      props: {
        prices: res2?.data,
        allTokens: res3,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        filteredCurrencies: null,
      },
    };
  }
}
