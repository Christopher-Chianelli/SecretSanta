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
import Person from 'domain/Person';

export const getPersonById = (state: AppState, id: number): Person => {
  if (state.personList.isLoading) {
    throw Error("Person list is loading");
  }
  return state.personList.personMapById.get(id) as Person;
};

export const getPersonList = (state: AppState): Person[] => {
  if (state.personList.isLoading) {
    return [];
  }
  const out: Person[] = [];
  state.personList.personMapById.forEach((value, key) => out.push(getPersonById(state, key)));
  return out;
};