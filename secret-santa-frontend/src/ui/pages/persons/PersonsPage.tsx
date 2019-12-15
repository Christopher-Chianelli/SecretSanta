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

import * as React from 'react';

import NewPersonPage from './NewPersonPage';
import PersonList from './PersonList';
import ViewPersonPage from './ViewPersonPage';
import { Switch, Route } from 'react-router';

export type Props = {};

export const PersonPage: React.FC<Props> = (props) => (
  <Switch>
    <Route
      path="/persons"
      exact
    >
      <PersonList />
    </Route>
    <Route
      path="/persons/new"
      exact
    >
      <NewPersonPage />
    </Route>
    <Route
      path="/persons/:id"
      exact
      component={ViewPersonPage}
    />
  </Switch>
);

export default PersonPage;