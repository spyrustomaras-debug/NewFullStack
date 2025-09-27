// src/types/redux-mock-store.d.ts
declare module "redux-mock-store" {
  import { AnyAction, Store } from "redux";

  // Define the mock store factory
  export interface MockStoreCreator<S = any, A extends AnyAction = AnyAction> {
    (state?: S): MockStoreEnhanced<S, A>;
  }

  // Define the enhanced mock store
  export interface MockStoreEnhanced<S = any, A extends AnyAction = AnyAction>
    extends Store<S, A> {
    getActions(): A[];
    clearActions(): void;
    subscribe(): () => void;
    replaceReducer(nextReducer: any): void;
  }

  function configureMockStore<S = any, A extends AnyAction = AnyAction>(
    middlewares?: any[]
  ): MockStoreCreator<S, A>;

  export default configureMockStore;
}
