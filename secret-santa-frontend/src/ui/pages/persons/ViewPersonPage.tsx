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
import { AppState } from 'store/types';
import { Title, Button, ActionGroup, EmptyState } from '@patternfly/react-core';
import { connect } from 'react-redux';
import Person from 'domain/Person';
import { personOperations, personSelectors } from 'store/person';
import { useTranslation } from 'react-i18next';
import SerachBox from 'ui/components/SearchBox';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, FormGroup,TextInput } from '@patternfly/react-core';
import Location from 'domain/Location';

interface StateProps {
    appState: AppState;
}
  
interface DispatchProps {
    addPerson: typeof personOperations.addPerson;
}
  
export type Props = StateProps & DispatchProps & RouteComponentProps<{ id: string }>;
  
const mapStateToProps = (state: AppState): StateProps => ({
    appState: state
});
  
const mapDispatchToProps: DispatchProps = {
    addPerson: personOperations.addPerson
};

export const ViewPersonPage: React.FC<Props> = (props) =>  {
    const personId = props.match.params.id;
    const person =  personSelectors.getPersonById(props.appState, parseInt(personId));
    const { t } = useTranslation("ViewPersonPage");
    
    if ( person === null) {
        return <EmptyState>Loading</EmptyState>;
    }
    return (
      <>
        <Title size="4xl">{person.name}</Title>
        <Button
          style={{ width: "min-content" }}
          onClick={() => props.history.goBack()}
        >
          Back
        </Button>
        <Form
          onSubmit={(e) => e.preventDefault()}
        >
          <FormGroup
             label="Name"
             isRequired
             fieldId="name"
             read-only
          >
            <TextInput
              isRequired
              type="text"
              id="Name"
              name="Name"
              aria-describedby="Name"
              value={person.name}
              onChange={() => {}}
            />
          </FormGroup>
          <FormGroup
             label="Secret Factor"
             isRequired
             fieldId="secret-factor"
             read-only
          >
            <TextInput
              isRequired
              type="number"
              id="secret-factor"
              name="Secret Factor"
              aria-describedby="Secret Factor"
              value={person.secretFactor}
              onChange={() => {}}
            />
          </FormGroup>
          <FormGroup
             label="Location"
             isRequired
             fieldId="location"
             read-only
          >
            <SerachBox
              boundingBox={null}
              countryCodeSearchFilter={[]}
              searchDelay={0.5}
              location={person.location}
              onChange={() => {}}
            />
          </FormGroup>
        </Form>
      </>
    );
};

export default  connect(mapStateToProps, mapDispatchToProps)(withRouter(ViewPersonPage));