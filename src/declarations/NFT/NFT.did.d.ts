import type { Principal } from '@dfinity/principal';
export interface NFT {
  'getAsset' : () => Promise<Array<number>>,
  'getCanisterid' : () => Promise<Principal>,
  'getOwner' : () => Promise<Principal>,
  'getname' : () => Promise<string>,
  'transferOwnership' : (arg_0: Principal) => Promise<string>,
}
export interface _SERVICE extends NFT {}
