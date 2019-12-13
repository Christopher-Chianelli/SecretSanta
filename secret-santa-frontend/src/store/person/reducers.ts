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

import { ActionType, PersonList, PersonAction } from './types';
import { createIdMapFromList, mapWithElement, mapWithoutElement,
  mapWithUpdatedElement } from 'util/ImmutableCollectionOperations';
import DomainObjectView from 'domain/DomainObjectView';
import Person from 'domain/Person';

export const initialState: PersonList = {
  isLoading: true,
  personMapById: new Map<number, DomainObjectView<Person>>()
};

const personReducer = (state = initialState, action: PersonAction): PersonList => {
  switch (action.type) {
    case ActionType.SET_PERSON_LIST_LOADING: {
      return { ...state, isLoading: action.isLoading };
    }
    case ActionType.ADD_PERSON: {
      return { ...state, personMapById: mapWithElement(state.personMapById, action.person) };
    }
    case ActionType.REMOVE_PERSON: {
      return { ...state, personMapById: mapWithoutElement(state.personMapById, action.person) };
    }
    case ActionType.UPDATE_PERSON: {
      return { ...state, personMapById: mapWithUpdatedElement(state.personMapById, action.person) };
    }
    case ActionType.REFRESH_PERSON_LIST: {
      return { ...state, personMapById: createIdMapFromList(action.personList) };
    }
    default:
      return state;
  }
};

export default personReducer;
