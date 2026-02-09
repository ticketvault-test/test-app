/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmptyFeatureResult, SignalStoreFeature, signalStoreFeature, withState } from '@ngrx/signals';

export interface BaseStoreState {
  pending: boolean;
  error: any;
}

export interface BaseStore {
  state: BaseStoreState;
  computed: Record<string, any>;
  methods: Record<string, any>;
  props: Record<string, (... args: any[]) => any>;
}

export const initialBaseState: BaseStoreState = {
  pending: false,
  error: null,
};

export function withBaseStore(): SignalStoreFeature<EmptyFeatureResult, BaseStore> {
  return signalStoreFeature(withState(initialBaseState));
}
