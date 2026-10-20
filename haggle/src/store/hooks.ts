import { useSyncExternalStore } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./index";
import { saveStatus } from "./persist";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/** True while the browser is refusing to save (usually because storage is full). */
export const useSaveFailed = () => useSyncExternalStore(saveStatus.subscribe, saveStatus.failed);
