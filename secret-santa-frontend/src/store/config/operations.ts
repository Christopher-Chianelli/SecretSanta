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
import SecretSantaConstraintConfiguration from 'domain/SecretSantaConstraintConfiguration';
import { alert } from 'store/alert';
import { UpdateConfigAction} from './types';
import { AddAlertAction } from 'store/alert/types';
import { convertHardMediumSoftScoreToFullString, getHardMediumSoftScoreFromString } from 'domain/HardMediumSoftScore';

export const getConfig: ThunkCommandFactory<void, UpdateConfigAction> = () =>
  (dispatch, state, client) => {
    return client.get<SecretSantaConstraintConfiguration>(`/secretSantaConstraintConfigurations/1`).then(newConfig => {
      dispatch(actions.updateConfig({
        ...newConfig,
        // @ts-ignore
        largerSecretDistanceAward: getHardMediumSoftScoreFromString(newConfig.largerSecretDistanceAward.HardMediumSoftBigDecimalScore),
        // @ts-ignore
        largerDistanceAward: getHardMediumSoftScoreFromString(newConfig.largerDistanceAward.HardMediumSoftBigDecimalScore)
    }));
    });
  };


export const updateConfig: ThunkCommandFactory<SecretSantaConstraintConfiguration,  AddAlertAction | UpdateConfigAction> = config =>
  (dispatch, state, client) => {
    return client.put<SecretSantaConstraintConfiguration>(`/secretSantaConstraintConfigurations/${config.id}`, {
      ...config,
      largerSecretDistanceAward: convertHardMediumSoftScoreToFullString(config.largerSecretDistanceAward),
      largerDistanceAward: convertHardMediumSoftScoreToFullString(config.largerDistanceAward)
    }).then(() => {
      dispatch(alert.showSuccessMessage("updateConfig"));
      dispatch(actions.updateConfig(config));
    });
  };