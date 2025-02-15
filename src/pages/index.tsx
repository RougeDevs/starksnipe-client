import Head from "next/head";
import Navbar from "@/components/layouts/Navbar/Navbar";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import TokenDashboard from "@/components/layouts/TokenDashboard";
import Footer from "@/components/layouts/Footer/Footer";
import ParticleBackground from "@/components/animatedComponents/Particlebackground";
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
        const res3 = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/tokens?all=true`);
      return {
        props: {
          allTokens:res3?.data.data.tokens
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
