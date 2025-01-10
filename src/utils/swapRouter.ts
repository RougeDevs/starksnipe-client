import { Call, num } from "starknet";
import 'dotenv/config';
import { ekubo, getMinAmountOut } from './helper'
import { Selector, TOKEN_SYMBOL } from './constants'
import { EkuboConfig, NetworkType, EkuboQuoteApiResponse, EkuboTokenData } from './types'

let ekuboConfig: EkuboConfig = ekubo('MAINNET');

export async function fetchQuote(amount: bigint, token0: TOKEN_SYMBOL, token1: TOKEN_SYMBOL): Promise<EkuboQuoteApiResponse | null> {
    const quote = await fetch(
        `${ekuboConfig.api}/quote/${amount}/${token0}/${token1}`
    );
    if (!quote.ok) {
        return null;
    }
    return (await quote.json()) as EkuboQuoteApiResponse;
}

export function getSwapCalls(token0: string, token1: string, amount: bigint, slippage: bigint, quote: EkuboQuoteApiResponse): Call[] {
    const splits = quote.splits;
    if (splits.length === 0) {
        throw new Error("no splits found");
    }
    const calls: Call[] = [];
    calls.push({
        contractAddress: token0,
        entrypoint: Selector.TRANSFER,
        calldata: [ekuboConfig.router.address, num.toHex(amount), "0x0"]
    })

    if (splits.length === 1) {
        if (quote.splits[0].route.length === 1) {
            throw new Error("unexpected single hop route")
        }
        const split = splits[0];
        calls.push({
            contractAddress: ekuboConfig.router.address,
            entrypoint: Selector.MULTIHOP_SWAP,
            calldata: [
                num.toHex(split.route.length),
                ...split.route.reduce((memo, routeNode) => {
                    const isToken1 = BigInt(memo.token) === BigInt(routeNode.pool_key.token1);

                    return {
                        token: isToken1 ? routeNode.pool_key.token0 : routeNode.pool_key.token1,
                        encoded: memo.encoded.concat([
                            routeNode.pool_key.token0,
                            routeNode.pool_key.token1,
                            routeNode.pool_key.fee,
                            num.toHex(routeNode.pool_key.tick_spacing),
                            routeNode.pool_key.extension,
                            num.toHex(BigInt(routeNode.sqrt_ratio_limit) % 2n ** 128n),
                            num.toHex(BigInt(routeNode.sqrt_ratio_limit) >> 128n),
                            routeNode.skip_ahead,
                        ]),
                    };
                }, {
                    token: token0,
                    encoded: [] as string[],
                }).encoded,
                token0,
                num.toHex(BigInt(split.specifiedAmount) < 0n ? -BigInt(split.specifiedAmount) : BigInt(split.specifiedAmount)),
                "0x0",
            ],
        })
    }

    else {
        calls.push({
            contractAddress: ekuboConfig.router.address,
            entrypoint: Selector.MULTI_MULTIHOP_SWAP,
            calldata: [
                num.toHex(splits.length),
                ...splits.reduce((memo, split) => {
                    return memo.concat([
                        num.toHex(split.route.length),
                        ...split.route.reduce((memo, routeNode) => {
                            const isToken1 = BigInt(memo.token) === BigInt(routeNode.pool_key.token1);

                            return {
                                token: isToken1 ? routeNode.pool_key.token0 : routeNode.pool_key.token1,
                                encoded: memo.encoded.concat([
                                    routeNode.pool_key.token0,
                                    routeNode.pool_key.token1,
                                    routeNode.pool_key.fee,
                                    num.toHex(routeNode.pool_key.tick_spacing),
                                    routeNode.pool_key.extension,
                                    num.toHex(BigInt(routeNode.sqrt_ratio_limit) % 2n ** 128n),
                                    num.toHex(BigInt(routeNode.sqrt_ratio_limit) >> 128n),
                                    routeNode.skip_ahead,
                                ]),
                            };
                        },
                            {
                                token: token0,
                                encoded: [] as string[],
                            }
                        ).encoded,
                        token0,
                        num.toHex(BigInt(split.specifiedAmount) < 0n ? -BigInt(split.specifiedAmount) : BigInt(split.specifiedAmount)),
                        "0x0",
                    ]);
                }, [] as string[]),
            ],
        }
        )
    }

    calls.push(ekuboConfig.router.populate(Selector.CLEAR_MINIMUM, [{ contract_address: token1 }, getMinAmountOut(BigInt(quote.total), slippage)]))
    calls.push(ekuboConfig.router.populate(Selector.CLEAR, [{ contract_address: token0 }]))

    return calls;

}

if (require.main === module) {
    const network = process.argv.slice(2)[0] as NetworkType;
    ekuboConfig = ekubo(network);
}

export async function getAllTokens(): Promise<EkuboTokenData[] | null> {
    const tokenData = await fetch(
        `${ekuboConfig.api}/tokens`
    );
    if (!tokenData.ok) {
        return null;
    }
    return (await tokenData.json()) as EkuboTokenData[];
}