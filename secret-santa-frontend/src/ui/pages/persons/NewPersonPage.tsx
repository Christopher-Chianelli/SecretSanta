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
import { Title, Button, ActionGroup } from '@patternfly/react-core';
import { connect } from 'react-redux';
import { Stream } from 'util/ImmutableCollectionOperations';
import { stringFilter } from 'util/CommonFilters';
import Person from 'domain/Person';
import { personOperations, personSelectors } from 'store/person';
import FilterComponent from 'ui/components/FilterComponent';
import { useTranslation } from 'react-i18next';
import { getPropsFromUrl, setPropsInUrl, UrlProps } from 'util/BookmarkableUtils';
import SerachBox from 'ui/components/SearchBox';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, FormGroup,TextInput } from '@patternfly/react-core';
import Location from 'domain/Location';

interface StateProps {
    personList: Person[];
}
  
interface DispatchProps {
    addPerson: typeof personOperations.addPerson;
}
  
export type Props = StateProps & DispatchProps & RouteComponentProps;
  
const mapStateToProps = (state: AppState): StateProps => ({
    personList: personSelectors.getPersonList(state),
});
  
const mapDispatchToProps: DispatchProps = {
    addPerson: personOperations.addPerson
};

const generateRandom = () => Math.floor(Math.random() * 10000000)

const addPerson = (props: Props, person: Person) => {
  props.addPerson(person);
}

export const NewPersonPage: React.FC<Props> = (props) =>  {
    const { personList } = props;
    const [ name, setName ] = React.useState("");
    const [ secretFactor, setSecretFactor ] = React.useState(generateRandom());
    const [ location, setLocation ] = React.useState(null as Location | null);
    const { t } = useTranslation("NewPersonPage");
    return (
      <>
        <Title size="4xl">Add Person</Title>
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
             helperText="Please provide your full name"
          >
            <TextInput
              isRequired
              type="text"
              id="Name"
              name="Name"
              aria-describedby="Name"
              value={name}
              onChange={setName}
            />
          </FormGroup>
          <FormGroup
             label="Secret Factor"
             isRequired
             fieldId="secret-factor"
             helperText="Please enter a secret factor"
          >
            <TextInput
              isRequired
              type="number"
              id="secret-factor"
              name="Secret Factor"
              aria-describedby="Secret Factor"
              value={secretFactor}
              onChange={n => setSecretFactor(parseInt(n))}
            />
          </FormGroup>
          <FormGroup
             label="Location"
             isRequired
             fieldId="location"
             helperText="Please provide your location"
          >
            <SerachBox
              boundingBox={null}
              countryCodeSearchFilter={[]}
              searchDelay={0.5}
              location={location}
              onChange={setLocation}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              onClick={() => {
                if (location !== null && name.trim() !== "") {
                  addPerson(props, {
                    name: name.trim(),
                    location,
                    secretFactor
                  });
                  props.history.goBack();
                }
              }}
            >
              Add
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                if (location !== null && name.trim() !== "") {
                  addPerson(props, {
                    name: name.trim(),
                    location,
                    secretFactor
                  });
                  setName("");
                  setSecretFactor(generateRandom());
                  setLocation(null);
                }
              }}
            >
              Add another
            </Button>
          </ActionGroup>
        </Form>
      </>
    );
};

export default  connect(mapStateToProps, mapDispatchToProps)(withRouter(NewPersonPage));