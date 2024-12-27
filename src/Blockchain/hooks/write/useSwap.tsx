import { useAccount, useContractWrite } from "@starknet-react/core";
import { useState } from "react";
const useSwap = () => {
  const [claimAddressL2, setclaimAddressL2] = useState<string>("")
  const [l2sellToken, setl2sellToken] = useState<string>("")
  const [l2buyToken, setl2buyToken] = useState<string>("")
  const [l2buyAmount, setl2buyAmount] = useState<number>(0)
  const [l2SellAmount, setl2SellAmount] = useState<number>(0)

  const [ticketIdL2, setticketIdL2] = useState<number>(0)
  const { address: owner } = useAccount();
  // const provider=getProvider();
  // const claimContract = new Contract(proxyClaimAbi, claimAddressL2, provider)
  // const call = claimContract.populate('claim', {amount:strkAmount, proof: proof})
  ////console.log("rToken stake request - ", rToken);

  const {
    data: dataSwap,
    error: errorSwap,
    reset: resetSwap,
    write: writeSwap,
    writeAsync: writeAsyncSwap,
    isError: isErrorSwap,
    isIdle: isIdleSwap,
    isSuccess: isSuccessSwap,
    status: statusSwap,
  } = useContractWrite({
    calls: [
      {
        contractAddress:'',
        entrypoint: "transfer",
        calldata: [ticketIdL2 as any,claimAddressL2===""?owner:claimAddressL2],
      },
      {
        contractAddress:'',
        entrypoint: "claim_ticket",
        calldata: [ticketIdL2 as any,claimAddressL2===""?owner:claimAddressL2],
      },
      
    ],
  });

  return {
    l2sellToken,
    setl2sellToken,
    l2buyToken,
    setl2buyToken,
    l2buyAmount,
    setl2buyAmount,
    l2SellAmount,
    setl2SellAmount,
    claimAddressL2,
    setclaimAddressL2,
    ticketIdL2,
    setticketIdL2,
    dataSwap,
    errorSwap,
    resetSwap,
    writeSwap,
    writeAsyncSwap,
    isErrorSwap,
    isIdleSwap,
    isSuccessSwap,
    statusSwap,
  };
};

export default useSwap;
