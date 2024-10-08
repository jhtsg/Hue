import { useContext } from "react";
import { UserContext, UserContextType } from "../contexts/AuthContext";

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) { throw new Error('AAAA!'); }
  return context as UserContextType;
};