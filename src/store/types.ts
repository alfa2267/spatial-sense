import { store } from './store';

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface AsyncThunkConfig {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
  extra?: { s: string; n: number };
}
