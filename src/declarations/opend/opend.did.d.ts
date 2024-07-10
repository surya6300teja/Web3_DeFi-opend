import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'completePurchase' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: Principal,
    ) => Promise<string>,
  'getListedntfs' : () => Promise<Array<Principal>>,
  'getOpendCanisterId' : () => Promise<Principal>,
  'getOriginalOwner' : (arg_0: Principal) => Promise<Principal>,
  'getOwnedntfs' : (arg_0: Principal) => Promise<Array<Principal>>,
  'getsellPrice' : (arg_0: Principal) => Promise<bigint>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'mint' : (arg_0: Array<number>, arg_1: string) => Promise<Principal>,
}
