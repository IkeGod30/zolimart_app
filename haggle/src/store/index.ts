import { configureStore } from "@reduxjs/toolkit";
import marketReducer, { type MarketState } from "./marketSlice";
import { loadMarket, saveMarket } from "./persist";

export function makeStore(market?: MarketState) {
  return configureStore({
    reducer: { market: marketReducer },
    preloadedState: market ? { market } : undefined,
  });
}

export const store = makeStore(loadMarket());

let lastSaved = store.getState().market;
store.subscribe(() => {
  const { market } = store.getState();
  if (market !== lastSaved) {
    lastSaved = market;
    saveMarket(market);
  }
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
