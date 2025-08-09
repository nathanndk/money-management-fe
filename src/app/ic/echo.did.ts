import { IDL } from '@dfinity/candid';
export const idlFactory = ({ IDL: _IDL = IDL }) => _IDL.Service({ greet: _IDL.Func([_IDL.Text], [_IDL.Text], ['query']) });