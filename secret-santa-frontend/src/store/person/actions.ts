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

import Person from 'domain/Person';
import { ActionFactory } from '../types';
import { ActionType,SetPersonListLoadingAction, AddPersonAction, UpdatePersonAction, RemovePersonAction,
  RefreshPersonListAction } from './types';

export const setIsPersonListLoading: ActionFactory<boolean, SetPersonListLoadingAction> = isLoading => ({
  type: ActionType.SET_PERSON_LIST_LOADING,
  isLoading: isLoading
});

export const addPerson: ActionFactory<Person, AddPersonAction> = person => ({
  type: ActionType.ADD_PERSON,
  person
});

export const removePerson: ActionFactory<Person, RemovePersonAction> = person => ({
  type: ActionType.REMOVE_PERSON,
  person
});

export const updatePerson: ActionFactory<Person, UpdatePersonAction> = person => ({
  type: ActionType.UPDATE_PERSON,
  person
});

export const refreshPersonList: ActionFactory<Person[], RefreshPersonListAction> = personList => ({
  type: ActionType.REFRESH_PERSON_LIST,
  personList
});
