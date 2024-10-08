import { useContext } from "react";
import { RefreshContext } from "../contexts/RefreshContext";

export const useRefresh = (flag: string) => {
  const context = useContext(RefreshContext);
  if (!context) { throw new Error('AAAA!'); }
  return { flag: context.subscribeFlag(flag), refresh: () => context.sendRefresh(flag) }
};