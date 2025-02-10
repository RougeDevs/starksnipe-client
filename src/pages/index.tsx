import Head from "next/head";
import Navbar from "@/components/layouts/Navbar/Navbar";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import { getAllTokens } from "@/utils/swapRouter";
import TokenDashboard from "@/components/layouts/TokenDashboard";
import Footer from "@/components/layouts/Footer/Footer";
import ParticleBackground from "@/components/animatedComponents/Particlebackground";
import { Pricer } from "@/interfaces/interface";

export default function Home({allTokens}:{allTokens:any}) {
  return (
    <>
      <Head>
        <title>SniQ | Memecoin Snipping</title>
      </Head>
      <Box>
        <Navbar allTokens={allTokens}/>
        <ParticleBackground/>
        <TokenDashboard allTokens={allTokens}/>
        <Footer/>
      </Box>
    </>
  );
}

export async function getServerSideProps() {
  try {
        const res3 = await getAllTokens();
      return {
        props: {
          allTokens:res3
        },
      };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        allTokens:null,
      },
    };
  }
}
