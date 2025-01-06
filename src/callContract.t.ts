import { getTokenData, parseTokenData } from "./utils/memeCoinData";
import { parseLiquidityParams } from "./utils/liquidity";
import { EkuboMemecoin } from "./utils/types";

async function main() {
    const response = await getTokenData('0x03b405a98c9e795d427fe82cdeeeed803f221b52471e3a757574a2b4180793ee');
    const result = await parseTokenData('0x03b405a98c9e795d427fe82cdeeeed803f221b52471e3a757574a2b4180793ee', response);
    console.log(result);
    console.log('----------------------');
    const parsedLiquidity = await parseLiquidityParams(result as EkuboMemecoin);
    console.log(parsedLiquidity);
}

if (require.main === module) {
    main()
}