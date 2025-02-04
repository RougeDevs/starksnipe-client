import { parseAmount, processAddress } from '@/Blockchain/utils/utils';
import currenciesLogos from '../../currencies-with-flags.json'


export function getFlagByCode(token:string) {
    const currency = currenciesLogos.find(item => item.code === token);
    return currency ? currency.flag : null; // Return null if the code is not found
}

export function getPriceInUSD(tokens: [], l2TokenAddress: string) {
    const matchedToken: any = tokens.find(
      (item: any) => item.tokenAddress === l2TokenAddress
    );
    return matchedToken ? matchedToken?.priceInUSD : null; // Return null if no match is found
}

export function getBalanceUserToken(tokens: [], l2TokenAddress: string) {
    const matchedToken: any = tokens.find(
      (item: any) => item.l2_token_address === processAddress(l2TokenAddress)
    );
    return matchedToken
      ? parseAmount(String(matchedToken?.balance), matchedToken?.decimals)
      : 0; // Return null if no match is found
}
export const findTokenPrice = (address: string,prices:[]) => {
    const token:any = prices.find(
      (token: { tokenAddress: string }) =>
        processAddress(token.tokenAddress) === address
    );
    return token ? token.priceInUSD : null;
};

export function findTokenByAddress(currentToken: string, tokens: any) {
    let matchedToken = null;

    for (let token of tokens) {
      if (processAddress(token.l2_token_address) === currentToken) {
        matchedToken = token;
        break;
      }
    }

    return matchedToken;
}

export const generateRandomGradient = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F5A623", "#FF00FF"];
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors[Math.floor(Math.random() * colors.length)];
    return `linear-gradient(45deg, ${color1}, ${color2})`;
};

export function timeAgo(timestamp:any) {
  const now :any= new Date();
  const givenTime:any = new Date(timestamp);
  const difference:any = now - givenTime; // Difference in milliseconds

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `Just now`;
}
}