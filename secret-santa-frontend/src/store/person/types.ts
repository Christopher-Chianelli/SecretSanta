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

import { Action } from 'redux';
import Person from 'domain/Person';
import DomainObjectView from 'domain/DomainObjectView';

export enum ActionType {
  ADD_PERSON = 'ADD_PERSON',
  REMOVE_PERSON = 'REMOVE_PERSON',
  UPDATE_PERSON = 'UPDATE_PERSON',
  REFRESH_PERSON_LIST = 'REFRESH_PERSON_LIST',
  SET_PERSON_LIST_LOADING = 'SET_PERSON_LIST_LOADING'
}

export interface SetPersonListLoadingAction extends Action<ActionType.SET_PERSON_LIST_LOADING> {
  readonly isLoading: boolean;
}

export interface AddPersonAction extends Action<ActionType.ADD_PERSON> {
  readonly person: Person;
}

export interface RemovePersonAction extends Action<ActionType.REMOVE_PERSON> {
  readonly person: Person;
}

export interface UpdatePersonAction extends Action<ActionType.UPDATE_PERSON> {
  readonly person: Person;
}

export interface RefreshPersonListAction extends Action<ActionType.REFRESH_PERSON_LIST> {
  readonly personList: Person[];
}

export type PersonAction = SetPersonListLoadingAction | AddPersonAction | RemovePersonAction |
UpdatePersonAction | RefreshPersonListAction;

export interface PersonList {
  readonly isLoading: boolean;
  readonly personMapById: Map<number, DomainObjectView<Person>>;
}
