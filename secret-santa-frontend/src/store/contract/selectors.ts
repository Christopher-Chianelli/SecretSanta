/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { AppState } from '../types';
import Contract from 'domain/Contract';

export const getContractById = (state: AppState, id: number): Contract => {
  if (state.contractList.isLoading) {
    throw Error("Contract list is loading");
  }
  return state.contractList.contractMapById.get(id) as Contract;
};

export const getContractList = (state: AppState): Contract[] => {
  if (state.contractList.isLoading) {
    return [];
  }
  const out: Contract[] = [];
  state.contractList.contractMapById.forEach((value, key) => out.push(getContractById(state, key)));
  return out;
};