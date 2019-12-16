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
import { personOperations, personSelectors } from 'store/person';
import { useTranslation } from 'react-i18next';
import SerachBox from 'ui/components/SearchBox';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, FormGroup,TextInput } from '@patternfly/react-core';

interface StateProps {
    appState: AppState;
}
  
interface DispatchProps {
    addPerson: typeof personOperations.addPerson;
    updatePerson: typeof personOperations.updatePerson;
    removePerson: typeof personOperations.removePerson;
    refreshPersonList: typeof personOperations.refreshPersonList;
}
  
export type Props = StateProps & DispatchProps & RouteComponentProps<{ id: string }>;
  
const mapStateToProps = (state: AppState): StateProps => ({
    appState: state
});
  
const mapDispatchToProps: DispatchProps = {
    addPerson: personOperations.addPerson,
    updatePerson: personOperations.updatePerson,
    removePerson: personOperations.removePerson,
    refreshPersonList: personOperations.refreshPersonList
};

export const ViewPersonPage: React.FC<Props> = (props) =>  {
    const personId = props.match.params.id;
    const person =  personSelectors.getPersonById(props.appState, parseInt(personId));
    const [ lastPerson, setLastPerson ] = React.useState(person);
    const [ name, setName ] = React.useState(person? person.name : "");
    const [ secret, setSecret ] = React.useState(person? person.secretFactor : 0);
    const [ location, setLocation ] = React.useState(person? person.location : null);
    const { t } = useTranslation("ViewPersonPage");
    React.useEffect(() => {
      props.refreshPersonList();
    }, [props.refreshPersonList]);
    
    if (person !== lastPerson) {
      setLastPerson(person);
      setName(person? person.name : "");
      setSecret(person? person.secretFactor : 0);
      setLocation(person? person.location : null);
    }
    
    if ( person === null) {
        return <EmptyState>{t("loading")}</EmptyState>;
    }
    return (
      <>
        <Title size="4xl">{person.name}</Title>
        <Button
          style={{ width: "min-content" }}
          onClick={() => props.history.goBack()}
        >
          {t("back")}
        </Button>
        <Form
          onSubmit={(e) => e.preventDefault()}
        >
          <FormGroup
             label={t("name")}
             isRequired
             fieldId="name"
          >
            <TextInput
              isRequired
              type="text"
              id="Name"
              name="Name"
              aria-describedby={t("name")}
              value={name}
              onChange={setName}
            />
          </FormGroup>
          <FormGroup
             label={t("secretFactor")}
             isRequired
             fieldId="secret-factor"
          >
            <TextInput
              isRequired
              type="number"
              id="secret-factor"
              name="Secret Factor"
              aria-describedby={t("secretFactor")}
              value={secret}
              onChange={n => setSecret(parseInt(n))}
            />
          </FormGroup>
          <FormGroup
             label={t("location")}
             isRequired
             fieldId="location"
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
                if (name.trim().length > 0 && location !== null) {
                  props.updatePerson({
                    ...person,
                    name,
                    secretFactor: secret,
                    location
                  });
                  props.history.goBack();
                }
              }}
            >
              Update
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                props.removePerson(person);
                props.history.goBack();
              }}
            >
              {t("delete")}
            </Button>
          </ActionGroup>
        </Form>
      </>
    );
};

export default  connect(mapStateToProps, mapDispatchToProps)(withRouter(ViewPersonPage));