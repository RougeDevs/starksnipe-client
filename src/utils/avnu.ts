import {
    executeCalls,
    fetchAccountCompatibility,
    fetchAccountsRewards,
    fetchGasTokenPrices,
    GaslessOptions,
    GasTokenPrice,
    getGasFeesInGasToken,
    PaymasterReward,
    SEPOLIA_BASE_URL,
    BASE_URL,
} from '@avnu/gasless-sdk';

import { AccountInterface, Call, EstimateFeeResponse, stark, transaction } from 'starknet';
import { provider } from './services/provider';
import { NetworkType } from './types';

const estimateCalls =
    async (account: string, calls: Call[]): Promise<EstimateFeeResponse> => {
        const contractVersion = await provider.getContractVersion(account);
        const nonce = await provider.getNonceForAddress(account);
        const details = stark.v3Details({ skipValidate: true });
        const invocation = {
            ...details,
            contractAddress: account,
            calldata: transaction.getExecuteCalldata(calls, contractVersion.cairo),
            signature: [],
        };
        return provider.getInvokeEstimateFee(invocation, { ...details, nonce, version: 1 }, 'pending', true);
    };

// CC: Frontend Use All of these functions inside useEffect {Use The gasless-sdk functions directly inside useeffect maintaining the states}

export const options = (network: NetworkType): GaslessOptions => (network === 'MAINNET' ? { baseUrl: BASE_URL } : { baseUrl: SEPOLIA_BASE_URL });

export async function getAccountData(network: NetworkType, account: string) {
    const compatibility = await fetchAccountCompatibility(account, options(network));
    const account_rewards = await fetchAccountsRewards(account, { ...options(network), protocol: 'gasless-sdk' });
    return { compatibility, account_rewards };
}

export async function getGasTokenPrices(network: NetworkType): Promise<GasTokenPrice[]> {
    return fetchGasTokenPrices(options(network));
}

export async function getPaymasterRewards(network: NetworkType, account: string): Promise<PaymasterReward[]> {
    const account_data = await getAccountData(network, account);
    return account_data.account_rewards;
}

/// dev: This function returns the {gas token price, estimated gas fees and max gas fees} in gas token for the given calls
export async function getEstimatedGasFees(network: NetworkType, account: string, gas_token: string, calls: Call[]) {
    const account_data = await getAccountData(network, account);
    if (!account_data.compatibility.isCompatible) { throw new Error('Account not compatible with Paymaster'); }
    const gas_token_price = await fetchGasTokenPrices(options(network)).then((prices) => prices.find((price) => price.tokenAddress === gas_token));
    if (!gas_token_price) {
        throw new Error(`Gas token ${gas_token} not found`);
    }
    const fees = await estimateCalls(account, calls);
    const estimated_gas_fee = getGasFeesInGasToken(BigInt(fees.overall_fee), gas_token_price, BigInt(fees.gas_price!), BigInt(fees.data_gas_price ?? '0x1'), account_data.compatibility.gasConsumedOverhead, account_data.compatibility.dataGasConsumedOverhead);
    return { gasTokenPrice: gas_token_price, estimatedFees: estimated_gas_fee, maxFees: estimated_gas_fee * 30n / 10n };
}

// example Invocation

export async function exampleExecuteCalls(network: NetworkType, account: AccountInterface, gas_token: string, calls: Call[]) {
    const estimated_gas_fee = await getEstimatedGasFees(network, account.address, gas_token, calls);
    return await executeCalls(
        account,
        calls,
        {
            gasTokenAddress: estimated_gas_fee.gasTokenPrice?.tokenAddress,
            maxGasTokenAmount: estimated_gas_fee.maxFees,
        },
        options(network),
    )
}