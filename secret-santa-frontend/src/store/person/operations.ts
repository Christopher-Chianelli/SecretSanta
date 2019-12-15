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

import { ThunkCommandFactory } from '../types';
import * as actions from './actions';
import Person from 'domain/Person';
import { alert } from 'store/alert';
import { SetPersonListLoadingAction, AddPersonAction, RemovePersonAction, UpdatePersonAction,
  RefreshPersonListAction } from './types';
import { AddAlertAction } from 'store/alert/types';

export const addPerson: ThunkCommandFactory<Person,  AddAlertAction | AddPersonAction> = person =>
  (dispatch, state, client) => {
    return client.post<Person>(`/persons`, person).then(newPerson => {
      dispatch(alert.showSuccessMessage("addPerson", { name: newPerson.name }));
      dispatch(actions.addPerson(newPerson))
    });
  };

export const removePerson: ThunkCommandFactory<Person,  AddAlertAction | RemovePersonAction> = person =>
  (dispatch, state, client) => {
    const personId = person.id;
    return client.delete<void>(`/persons/${personId}`).then(() => {
      dispatch(alert.showSuccessMessage("removePerson", { name: person.name }));
      dispatch(actions.removePerson(person));
    });
  };

export const updatePerson: ThunkCommandFactory<Person,  AddAlertAction | UpdatePersonAction> = person =>
  (dispatch, state, client) => {
	const personId = person.id;
    return client.post<Person>(`/persons/${person.id}`, person).then(updatedPerson => {
      dispatch(alert.showSuccessMessage("updatePerson", { id: person.id }));
      dispatch(actions.updatePerson(updatedPerson));
    });
  };

export const refreshPersonList: ThunkCommandFactory<void, SetPersonListLoadingAction | RefreshPersonListAction> = () =>
  (dispatch, state, client) => {
    dispatch(actions.setIsPersonListLoading(true));
    return client.get<{ _embedded: { persons: Person[] }}>(`/persons`).then(personList => {
      dispatch(actions.refreshPersonList(personList._embedded.persons));
      dispatch(actions.setIsPersonListLoading(false));
    });
  };
