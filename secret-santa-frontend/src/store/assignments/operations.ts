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
import { UpdateResultViewAction} from './types';
import { AddAlertAction } from 'store/alert/types';
import ResultView from 'domain/ResultView';
import Assignment from 'domain/Assignment';
import { getHardMediumSoftScoreFromString } from 'domain/HardMediumSoftScore';
import { ThunkDispatch } from 'redux-thunk';

type KindaResultView = Pick<ResultView, "solverStatus"> & { result: {
    personList: Person[],
    secretSantaAssignmentList: Assignment[],
    score: {
      HardMediumSoftBigDecimalScore: string
    }
} };

export const getAssignments: ThunkCommandFactory<void,  UpdateResultViewAction> = () =>
  (dispatch, state, client) => {
    return client.get<KindaResultView>(`/assignments`).then(resultView => {
      dispatch(actions.updateResultView({
        ...resultView,
        result: {
          ...resultView.result,
          score: getHardMediumSoftScoreFromString(resultView.result.score.HardMediumSoftBigDecimalScore)
        }
      }))
    });
  };


let timeoutId: ReturnType<typeof setInterval> | null = null;

export const startSolving: ThunkCommandFactory<void,  AddAlertAction | UpdateResultViewAction> = () =>
  (dispatch, state, client) => {
    return client.post<void>(`/assignments/solve`, {}).then(() => {
        dispatch(alert.showInfoMessage("startedSolving"));
        timeoutId = setInterval(() => {
          client.get<KindaResultView>(`/assignments`).then(resultView => {
            dispatch(actions.updateResultView({
              ...resultView,
              result: {
                ...resultView.result,
                score: getHardMediumSoftScoreFromString(resultView.result.score.HardMediumSoftBigDecimalScore)
              }
            }));
            if (resultView.solverStatus === 'NOT_SOLVING') {
              finishSolving(dispatch);
            }
          });
        }, 1000);
    });
  };
  
export const stopSolving: ThunkCommandFactory<void,  AddAlertAction> = () =>
  (dispatch, state, client) => {
    return client.post<void>(`/assignments/stopSolving`, {}).then(() => {
      finishSolving(dispatch);
    });
  };
  
const finishSolving = (dispatch: ThunkDispatch<any,any,any>) => {
  if (timeoutId != null) {
    dispatch(alert.showInfoMessage("finishedSolving"));
    clearInterval(timeoutId);
    timeoutId = null;
  }
};
  
 

