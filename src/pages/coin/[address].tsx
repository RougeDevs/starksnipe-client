import ParticleBackground from '@/components/animatedComponents/Particlebackground'
import Footer from '@/components/layouts/Footer/Footer'
import MemeCoinDashboard from '@/components/layouts/MemeCoinDashboard'
import Navbar from '@/components/layouts/Navbar/Navbar'
import { currency, Pricer } from '@/interfaces/interface'
import { getAllTokens } from '@/utils/swapRouter'
import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

const Index = ({currencies,prices,allTokens,allMemeTokens}:{prices:Pricer[],currencies:currency[],allTokens:any,allMemeTokens:any}) => {
    const router=useRouter()
  return (
    <Box minH="100vh">
            <Head>
        <title>SniQ | Memecoin Snipping</title>
      </Head>
        <Navbar allTokens={allTokens}/>
        <ParticleBackground/>
        <MemeCoinDashboard  allTokens={allTokens}
        currencies={currencies}
        prices={prices}
        allMemeTokens={allMemeTokens}
        />
        <Footer/>
    </Box>
  )
}

export default Index

export async function getServerSideProps() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/native-curr`
    );

    if (res?.data) {

      const res2 = await axios.get(
        "https://starknet.api.avnu.fi/paymaster/v1/gas-token-prices"
      );

      const res3 = await getAllTokens();
      const res4= await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/tokens?all=true`);

      return {
        props: {
          currencies: res?.data?.data,
          prices: res2?.data,
          allTokens: res3,
          allMemeTokens:res4?.data.data.tokens
        },
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        filteredCurrencies: null,
      },
    };
  }
}