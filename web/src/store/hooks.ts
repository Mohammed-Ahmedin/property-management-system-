import { useDispatch, useSelector } from "react-redux";
import { type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// ✅ use throughout your app instead of plain `useDispatch` & `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
