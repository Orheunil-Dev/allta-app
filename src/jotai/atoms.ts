import { atom } from "jotai";

export const errorModalAtom = atom<{
  visible: boolean;
  message: string | null;
}>({
  visible: false,
  message: null,
});

export const commonModalAtom = atom<{
  visible: boolean;
  title: string | null;
  message: string | null;
}>({
  visible: false,
  title: null,
  message: null,
});
