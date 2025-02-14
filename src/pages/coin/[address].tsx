import ParticleBackground from '@/components/animatedComponents/Particlebackground'
import Footer from '@/components/layouts/Footer/Footer'
import MemeCoinDashboard from '@/components/layouts/MemeCoinDashboard'
import Navbar from '@/components/layouts/Navbar/Navbar'
import { currency, Pricer } from '@/interfaces/interface'
import { getAllTokens } from '@/utils/swapRouter'
import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Head from 'next/head'
import React from 'react'

const Index = ({currencies,prices,allTokens,allMemeTokens}:{prices:Pricer[],currencies:currency[],allTokens:any,allMemeTokens:any}) => {
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
    const [currencies, prices, allTokens, memeTokens] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/native-curr`),
      axios.get("https://starknet.api.avnu.fi/paymaster/v1/gas-token-prices"),
      getAllTokens(),
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/tokens?all=true`)
    ]);
  
    return {
      props: {
        currencies: currencies.data.data,
        prices: prices.data,
        allTokens,
        allMemeTokens: memeTokens.data.data.tokens
      },
    };
  } catch (error) {
    console.log(error,'er')
  }

}