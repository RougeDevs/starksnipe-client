import { BigNumber } from "bignumber.js";
import { AnyAaaaRecord } from "dns";
import { ethers, } from "ethers";
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

export const toFixed = (num: number, digit: number) => {
  if (isNaN(num)) return 0;
  var fixed_num = Number(num).toFixed(digit);
  return Number(fixed_num.toString());
};

export const OnErrorCallback = (err: any) => {};

export const etherToWeiBN = (amount:any, decimals:any) => {
  if (!amount) {
    return 0;
  }
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
    try {
        const normalizedAmount = Number(amount).toLocaleString('fullwide', { useGrouping: false });
        
        const factor = BigInt("1000000");
        const divisor = BigInt(10) ** BigInt(decimals);
        const amountBigInt = (BigInt(normalizedAmount) * factor) / divisor;
        
        const preciseValue = Number(amountBigInt.toString()) / Number(factor);
        
        const multiplier = Math.pow(10, precision);
        return Math.floor(preciseValue * multiplier) / multiplier;
    } catch (error) {
        console.error('Error parsing amount:', error);
        throw error;
    }
};
