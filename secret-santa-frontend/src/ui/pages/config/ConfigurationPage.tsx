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
import Person from 'domain/Person';
import { configOperations } from 'store/config';
import { useTranslation } from 'react-i18next';
import SerachBox from 'ui/components/SearchBox';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, FormGroup,TextInput } from '@patternfly/react-core';
import Location from 'domain/Location';
import SecretSantaConstraintConfiguration from 'domain/SecretSantaConstraintConfiguration';

interface StateProps {
    config: SecretSantaConstraintConfiguration;
}
  
interface DispatchProps {
    getConfig: typeof configOperations.getConfig;
    updateConfig: typeof configOperations.updateConfig;
}
  
export type Props = StateProps & DispatchProps;
  
const mapStateToProps = (state: AppState): StateProps => ({
    config: state.config.config
});
  
const mapDispatchToProps: DispatchProps = {
    getConfig: configOperations.getConfig,
    updateConfig: configOperations.updateConfig
};

export const ConfigurationPage: React.FC<Props> = (props) =>  {
    const { config } = props;
    const [ lastConfig, setLastConfig ] = React.useState(config);
    const [ secretScore, setSecretScore ] = React.useState(config.largerSecretDistanceAward.softScore);
    const [ distanceScore, setDistanceScore ] = React.useState(config.largerDistanceAward.softScore);
    const { t } = useTranslation("ConfigurationPage");
    
    React.useEffect(() => {
      props.getConfig();
    }, [props.getConfig]);
    
    if (config !== lastConfig) {
      setLastConfig(config);
      setSecretScore(config.largerSecretDistanceAward.softScore);
      setDistanceScore(config.largerDistanceAward.softScore);  
    }
    
    return (
      <>
        <Title size="4xl">Configuration</Title>
        <Form
          onSubmit={(e) => e.preventDefault()}
        >
          <FormGroup
             label="Larger Secret Distance Award"
             isRequired
             fieldId="larger-secret-distance-award"
             helperText="Please enter the secret factor"
          >
            <TextInput
              isRequired
              type="number"
              id="larger-secret-distance-award"
              name="Larger Secret Distance Award"
              aria-describedby="Larger Secret Distance Award"
              value={secretScore}
              onChange={n => setSecretScore(parseInt(n))}
            />
          </FormGroup>
          <FormGroup
             label="Larger Distance Award"
             isRequired
             fieldId="larger-distance-award"
             helperText="Please enter the distance factor"
          >
            <TextInput
              isRequired
              type="number"
              id="larger-distance-award"
              name="Larger Distance Award"
              aria-describedby="Larger Distance Award"
              value={distanceScore}
              onChange={n => setDistanceScore(parseInt(n))}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              onClick={() => {
                props.updateConfig({
                  ...config,
                  largerSecretDistanceAward: {
                    ...config.largerSecretDistanceAward,
                    softScore: secretScore
                  },
                  largerDistanceAward: {
                    ...config.largerDistanceAward,
                    softScore: distanceScore
                  }
                });
              }}
            >
              Update
            </Button>
          </ActionGroup>
        </Form>
      </>
    );
};

export default  connect(mapStateToProps, mapDispatchToProps)(ConfigurationPage);