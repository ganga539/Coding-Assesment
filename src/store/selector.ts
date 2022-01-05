import { createSelector } from 'reselect';

const state = (data: any) => data.itemState;

export const getIsLoading = createSelector(state, (data: any) => data.loading);
export const getMetrics = createSelector(state, (data: any) => data.metrics);
