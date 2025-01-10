import { EkuboTokenData, AvnuTokenBalance, AvnuConfig, NetworkType } from "./types";
import { avnu } from './helper';

export let avnuConfig: AvnuConfig = avnu('MAINNET');

export async function fetchUserBalances(
    userAddress: string,
    tokens: EkuboTokenData[]
): Promise<AvnuTokenBalance[]> {
    const baseUrl = `${avnuConfig.api}/balances`;
    const tokenAddresses = tokens.map(token => token.l2_token_address);

    const url = new URL(baseUrl);
    url.searchParams.append('userAddress', userAddress);
    tokenAddresses.forEach(address => {
        url.searchParams.append('tokenAddress', address);
    });

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.map((item: { balance: string; }) => ({
            ...item,
            balance: parseInt(item.balance, 16)
        }));

    } catch (error) {
        console.error('Error fetching balances:', error);
        throw error;
    }
}

if (require.main === module) {
    const network = process.argv.slice(2)[0] as NetworkType;
    avnuConfig = avnu(network);
}