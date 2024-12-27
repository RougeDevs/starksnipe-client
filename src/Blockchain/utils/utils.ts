import { BigNumber } from "bignumber.js";
import { AnyAaaaRecord } from "dns";
import { ethers, utils,BigNumber as BigNumberEther } from "ethers";
import { Logger } from "ethers/lib/utils";
import { num } from "starknet";
export const fixedSpecial = (num: number, n: number) => {
  var str = num.toPrecision();
  if (str.indexOf("e+") === -1) return str;

  str = str
    .replace(".", "")
    .split("e+")
    .reduce(function (b, p: any) {
      return b + Array(p - b.length + 2).join("0");
    });

  if (n > 0) str += "." + Array(n + 1).join("0");

  return str;
};

export const BNtoNum = (value: number, decimal: number = 18) => {
  const val = new BigNumber(value).shiftedBy(-decimal).toNumber();
  return val < 1 ? val.toPrecision() : Number(fixedSpecial(val, 0)).toFixed(4);
};

export const NumToBN = (value: number, decimal: number = 18) => {
  const val = new BigNumber(value).shiftedBy(decimal).toNumber();
  return val < 1 ? val.toPrecision() : fixedSpecial(val, 0);
};

export const GetErrorText = (err: any) => {
  if (err.code === Logger.errors.CALL_EXCEPTION)
    return `Transaction failed! \n ${err.transactionHash}`;
  if (err.data) {
    ////console.log(1);
    return err.data.message;
  } else if (err.message) {
    ////console.log("Erro: ", err.message);
    return err.message;
  } else if (typeof err == "string") {
    return err;
  } else return "Oops! Something went wrong.";
};

export const toFixed = (num: number, digit: number) => {
  if (isNaN(num)) return 0;
  var fixed_num = Number(num).toFixed(digit);
  return Number(fixed_num.toString());
};

export const OnSuccessCallback = (
  data: any,
  eventName: any,
  key: any,
  message: any
) => {};

export const OnErrorCallback = (err: any) => {};
export const bytesToString = (bytes: string) => {
  return utils.parseBytes32String(bytes);
};

export const depositInterestAccrued = (asset: any, historicalData: any[]) => {
  const compare = (entryA: any, entryB: any) => {
    if (entryA.timestamp > entryB.timestamp) {
      return -1;
    } else if (entryA < entryB) {
      return 1;
    }
    return 0;
  };
  let marketCommitmentSpecificData = historicalData
    .filter((entry) => {
      return (
        entry["market"] === asset.marketAddress &&
        parseInt(entry["commitment"]) === asset.commitmentIndex
      );
    })
    .sort(compare);

  let currentTime = Date.now() / 1000;
  const secondsInYear_bn = new BigNumber(31536000);

  const result_bn: BigNumber = marketCommitmentSpecificData.reduce(
    (accumulator, entry, index) => {
      let interest = 0;
      let timeDifference = 0;
      // let rate = parseInt(entry.apr100x) / 100;
      if (index === 0) {
        timeDifference = currentTime - entry.timestamp;
      } else {
        timeDifference =
          marketCommitmentSpecificData[index - 1].timestamp - entry.timestamp;
      }
      // amount * difference/seconds in year * rate/100
      let rate = new BigNumber(parseFloat(entry?.apr100x) / 100);
      //   let rate = new BigNumber(parseFloat("200") / 100);
      let timeDifference_bn = new BigNumber(timeDifference);
      let amount_bn = new BigNumber(asset.amount);

      const result_bn: BigNumber = timeDifference_bn
        .multipliedBy(amount_bn)
        .multipliedBy(rate)
        .dividedBy(secondsInYear_bn)
        .dividedBy(100);
      return result_bn.plus(accumulator);
    },
    new BigNumber(0)
  );

  return result_bn.dividedBy(10e18).toFixed(6);
};

export const borrowInterestAccrued = (asset: any) => {
  return new BigNumber(asset.loanInterest)
    .dividedBy(new BigNumber(1e18))
    .toFixed(6);
  //   return new BigNumber(0).toFixed(6);
};

export const etherToWeiBN = (amount:any, tokenName:any) => {
  if (!amount) {
    return 0;
  }
  const decimals = 18;
  if (!decimals) {
    return 0;
  }
  try {
    const factor = new BigNumber(10).exponentiatedBy(18); // Wei in 1 Ether
    const amountBN = new BigNumber(amount)
      .times(factor)
      .times(new BigNumber(10).exponentiatedBy(decimals))
      .dividedBy(factor).integerValue(BigNumber.ROUND_DOWN);;

    // Formatting the result to avoid exponential notation
    const formattedAmount = amountBN.toFixed(); 
    return formattedAmount;
  } catch (e) {
    console.warn("etherToWeiBN fails with error: ", e);
    return amount;
  }
};
export const weiToEtherNumber = (amount: string, tokenName: any) => {
  const decimals = 18;
  if (!decimals) {
    return 0;
  } // @todo should avoid using 18 default
  const factor = new BigNumber(1000000);
  const amountBN = new BigNumber(amount)
    .times(factor)
    .dividedBy(new BigNumber(10).exponentiatedBy(decimals));
    const result = amountBN.dividedBy(factor).toNumber();
    const truncatedResult = Math.trunc(result * 1e6) / 1e6; // Keep six digits after the decimal point without rounding
    return truncatedResult;;
};

export function processAddress(address: string) {
    return num.toHex(num.toBigInt(address));
  }


export const parseAmount = (amount: string, decimals = 18, precision = 18) => {
  const factor = BigNumberEther.from("1000000");
  const divisor = BigNumberEther.from(10).pow(decimals);
  const amountBN = BigNumberEther.from(amount).mul(factor).div(divisor);

  // Convert BigNumber to a Number for arithmetic
  const preciseValue = Number(amountBN.toString()) / factor.toNumber();

  // Truncate to the desired precision
  const multiplier = Math.pow(10, precision);
  return Math.floor(preciseValue * multiplier) / multiplier;
};
