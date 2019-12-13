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
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { useTranslation, Trans } from 'react-i18next';
import './Alerts.css';
import { connect } from 'react-redux';
import { AlertInfo, AlertComponent } from 'store/alert/types';
import { AppState } from 'store/types';
import * as alertOperations from 'store/alert/operations';
import moment from 'moment';
import { useInterval } from 'util/FunctionalComponentUtils';
import { BasicObject, ServerSideExceptionInfo } from 'types';
import { ServerSideExceptionDialog } from './components/ServerSideExceptionDialog';

interface StateProps {
  alerts: AlertInfo[];
}

interface DispatchProps {
  removeAlert: typeof alertOperations.removeAlert;
}

const mapStateToProps = (state: AppState): StateProps => ({
  alerts: state.alerts.alertList
});

const mapDispatchToProps: DispatchProps = {
  removeAlert: alertOperations.removeAlert
}

export type Props = StateProps & DispatchProps;

export function mapToComponent(component: AlertComponent, componentProps: BasicObject): React.ReactNode {
  if (component === AlertComponent.SERVER_SIDE_EXCEPTION_DIALOG) {
    return <ServerSideExceptionDialog {...componentProps as unknown as ServerSideExceptionInfo} />;
  }
}

const Alerts: React.FC<Props> = (props) => {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const { t } = useTranslation("Alerts");
  const [ hoveredOverAlerts, hoveredOverAlertsSetter ] = React.useState([] as number[]);
  const shouldUpdateNextSecond = props.alerts.filter(alert => 
    hoveredOverAlerts.find(id => id === alert.id) === undefined).length > 0;

  const additionClassNames = (alert: AlertInfo) => {
    const secondsFromEvent = moment.duration(moment().diff(moment(alert.createdAt))).asSeconds();

    if (hoveredOverAlerts.find(id => id === alert.id) !== undefined) {
      return ""
    }
    if (secondsFromEvent < 3) {
      return "fade-and-slide-in";
    }
    else if (secondsFromEvent > 10) {
      if (secondsFromEvent > 12) {
        props.removeAlert(alert);
      }
      return "fade-and-slide-out";
    }
    else {
      return "";
    }
  };

  useInterval(forceUpdate, shouldUpdateNextSecond? 1000 : null);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      display: 'grid',
      gridAutoRows: 'auto',
      gridTemplateColumns: 'auto',
      paddingTop: '5px',
      gridRowGap: '5px',
      overflowY: 'auto',
      background: 'transparent',
      zIndex: 10000
    }}
    >
      {props.alerts.map(alert => (
        <Alert
          className={additionClassNames(alert)}
          key={alert.id}
          title={t( alert.i18nKey + ".title")}
          variant={alert.variant}
          onMouseEnter={() => {
            hoveredOverAlertsSetter(hoveredOverAlerts.concat([alert.id as number]));
          }}
          action={(
            <AlertActionCloseButton
              onClose={() => props.removeAlert(alert)} 
            />
          )}
        >
          <Trans
            t={t}
            i18nKey={alert.i18nKey + ".message"}
            values={alert.params}
            components={alert.components.map((c, index) => mapToComponent(c, alert.componentProps[index]))}
          />
        </Alert>
      ))}
    </div>
  );
}

export { Alerts };
export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
