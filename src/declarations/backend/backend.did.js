export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getGameStatus' : IDL.Func([], [IDL.Bool, IDL.Nat], []),
    'newGame' : IDL.Func([], [], []),
    'validateGuess' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(IDL.Nat8))], []),
  });
};
export const init = ({ IDL }) => { return []; };
