import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getGameStatus' : ActorMethod<[], [boolean, bigint]>,
  'newGame' : ActorMethod<[], undefined>,
  'validateGuess' : ActorMethod<[string], [] | [Uint8Array | number[]]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
