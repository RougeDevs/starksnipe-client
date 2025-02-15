import { parseAmount, processAddress } from '@/Blockchain/utils/utils';
import { getProvider } from '@/Blockchain/strk-constants';
import { TransactionExecutionStatus } from 'starknet';

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
      if (processAddress(token.address) === currentToken) {
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

export function timeAgo(timestamp: string): string {

  let givenTime: number;
  if (!timestamp) {
    console.error("Timestamp is missing");
    return "Invalid date";
  }

  // Handle Unix timestamp (in seconds)
  if (/^\d{10}$/.test(timestamp)) {
    givenTime = new Date(Number(timestamp) * 1000).getTime(); // Convert to ms
  } 
  // Handle standard date formats
  else {
    givenTime = new Date(timestamp).getTime();
  }

  if (isNaN(givenTime)) {
    console.error("Invalid timestamp:", timestamp);
    return "Invalid date";
  }

  const now: number = Date.now();
  const difference: number = now - givenTime; // Difference in milliseconds

  const seconds: number = Math.floor(difference / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);

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


export function epochToDateTime(epoch:number) {
  const date = new Date(epoch * 1000); // Convert seconds to milliseconds
  return date.toDateString(); // Returns in ISO format (UTC)
}

const errorMessages = {
  ElectionInactive: "Election is Not Active",
  "Signature failed":'Transaction Declined',
  OwnerPermissioned: "Must be Owner of Election",
  AlreadyVoted: "Vote Already Casted",
  GetVotes: "Error in Getting Voted",
  ElectionIncomplete: "Election is still Active",
  OnlyOwner: "Must be Owner of Election",
  NotEnoughBalance: "Link Tokens exhausted",
  VoteInputLength: "Incorrect Length of Vote ",
  IncorrectCredits: " Incorrect Credits Given",
  NoCandidates: "No Candidates to Vote",
  ChainMismatchError: "Switch to Mainnet!",
  NothingToClaim:
    "You have currently claimed the full amount. Please wait for the cliff period to end before claiming any additional funds.",
};

export const ErrorMessage = (error: any) => {
  console.log("Error : ", error.message);
  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.message.includes(key)) {
      return message;
    }
  }
  return "Something went wrong. Please try again.";
};

export async function isTxAccepted(txHash: string) {
  const provider = getProvider();

  let keepChecking = true;
  const maxRetries = 30;
  let retry = 0;

  while (keepChecking) {
    let txInfo: any;

    try {
      txInfo = await provider.getTransactionStatus(txHash);
    } catch (error) {
      console.error("isTxAccepted error", error);
      retry++;
      if (retry > maxRetries) {
        throw new Error("Transaction status unknown");
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
    }

    console.debug("isTxAccepted", txInfo);
    if (!txInfo.finality_status || txInfo.finality_status === "RECEIVED") {
      // do nothing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
    }
    if (txInfo.finality_status === "ACCEPTED_ON_L2") {
      if (txInfo.execution_status === TransactionExecutionStatus.SUCCEEDED) {
        keepChecking = false;
        return true;
      }
      throw new Error("Transaction reverted");
    } else if (txInfo.finality_status === "REJECTED") {
      throw new Error("Transaction rejected");
    } else {
      throw new Error("Transaction status unknown");
    }
  }
}
