export const idlFactory = ({ IDL }) => {
  const NFT = IDL.Service({
    'getAsset' : IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
    'getCanisterid' : IDL.Func([], [IDL.Principal], ['query']),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
    'getname' : IDL.Func([], [IDL.Text], ['query']),
    'transferOwnership' : IDL.Func([IDL.Principal], [IDL.Text], []),
  });
  return NFT;
};
export const init = ({ IDL }) => {
  return [IDL.Text, IDL.Principal, IDL.Vec(IDL.Nat8)];
};
