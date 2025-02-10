import ParticleBackground from '@/components/animatedComponents/Particlebackground'
import Footer from '@/components/layouts/Footer/Footer'
import MemeCoinDashboard from '@/components/layouts/MemeCoinDashboard'
import Navbar from '@/components/layouts/Navbar/Navbar'
import { Pricer } from '@/interfaces/interface'
import { getAllTokens } from '@/utils/swapRouter'
import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

const Index = ({currencies,prices,allTokens}:{prices:Pricer,currencies:any,allTokens:any}) => {
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
        prices={prices}/>
        <Footer/>
    </Box>
  )
}

export default Index

export async function getServerSideProps() {
  try {
    const res = await axios.get(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json"
    );

    if (res?.data?.usd) {
      const fiatCurrencies = [
        "aed",
        "afn",
        "all",
        "amd",
        "ang",
        "aoa",
        "ars",
        "aud",
        "awg",
        "bam",
        "bbd",
        "bdt",
        "bgn",
        "bhd",
        "bif",
        "bmd",
        "bnd",
        "bob",
        "brl",
        "bsd",
        "btn",
        "bwp",
        "byn",
        "bzd",
        "cad",
        "cdf",
        "chf",
        "clp",
        "cny",
        "cop",
        "crc",
        "cup",
        "cve",
        "czk",
        "djf",
        "dkk",
        "dop",
        "dzd",
        "egp",
        "ern",
        "etb",
        "eur",
        "fjd",
        "fkp",
        "fok",
        "gbp",
        "gel",
        "ghs",
        "gip",
        "gmd",
        "gnf",
        "gtq",
        "gyd",
        "hkd",
        "hnl",
        "hrk",
        "htg",
        "huf",
        "idr",
        "ils",
        "inr",
        "iqd",
        "irr",
        "isk",
        "jmd",
        "jod",
        "jpy",
        "kes",
        "kgs",
        "khr",
        "kmf",
        "kpw",
        "krw",
        "kwd",
        "kyd",
        "kzt",
        "lak",
        "lbp",
        "lkr",
        "lrd",
        "lsl",
        "lyd",
        "mad",
        "mdl",
        "mga",
        "mkd",
        "mmk",
        "mnt",
        "mop",
        "mru",
        "mur",
        "mvr",
        "mwk",
        "mxn",
        "myr",
        "mzn",
        "nad",
        "ngn",
        "nio",
        "nok",
        "npr",
        "nzd",
        "omr",
        "pab",
        "pen",
        "pgk",
        "php",
        "pkr",
        "pln",
        "pyg",
        "qar",
        "ron",
        "rsd",
        "rub",
        "rwf",
        "sar",
        "sbd",
        "scr",
        "sdg",
        "sek",
        "sgd",
        "shp",
        "sle",
        "sll",
        "sos",
        "srd",
        "ssp",
        "stn",
        "svc",
        "syp",
        "szl",
        "thb",
        "tjs",
        "tmt",
        "tnd",
        "top",
        "try",
        "ttd",
        "tvd",
        "twd",
        "tzs",
        "uah",
        "ugx",
        "usd",
        "uyu",
        "uzs",
        "ves",
        "vnd",
        "vuv",
        "wst",
        "xaf",
        "xcd",
        "xof",
        "xpf",
        "yer",
        "zar",
        "zmw",
        "zwl",
      ];

      const filteredCurrencies = Object.keys(res.data.usd)
        .filter((key) => fiatCurrencies.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = res.data.usd[key];
          return obj;
        }, {});

      const res2 = await axios.get(
        "https://starknet.api.avnu.fi/paymaster/v1/gas-token-prices"
      );

      const res3 = await getAllTokens();

      return {
        props: {
          currencies: filteredCurrencies,
          prices: res2?.data,
          allTokens: res3,
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