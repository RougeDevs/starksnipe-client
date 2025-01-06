import { getTokenData } from "./utils/memeCoinData";

async function main() {
    console.log(await getTokenData('0x03b405a98c9e795d427fe82cdeeeed803f221b52471e3a757574a2b4180793ee'))
}

if (require.main === module) {
    main()
}