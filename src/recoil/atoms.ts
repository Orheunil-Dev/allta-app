// jotai/atoms.ts
import { atom } from "jotai";

export const errorModalAtom = atom<{
  visible: boolean;
  message: string | null;
}>({
  visible: false,
  message: null,
});
