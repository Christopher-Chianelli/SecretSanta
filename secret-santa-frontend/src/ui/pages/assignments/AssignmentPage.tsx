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
import { connect } from 'react-redux';
import { assignmentOperations, assignmentSelectors } from 'store/assignments';
import { useTranslation } from 'react-i18next';
import ResultView from 'domain/ResultView';
import Location from 'domain/Location';
import { ScoreDisplay } from 'ui/components/ScoreDisplay';
import Actions from 'ui/components/Actions';
import "./AssignmentPage.css";
import { Text } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, IRow } from '@patternfly/react-table';

interface StateProps {
  resultView: ResultView;
}

interface DispatchProps {
  getAssignments: typeof assignmentOperations.getAssignments;
  startSolving: typeof assignmentOperations.startSolving;
  stopSolving: typeof assignmentOperations.stopSolving;
}


const mapStateToProps = (state: AppState): StateProps => ({
  resultView: state.assignments.resultView
});

const mapDispatchToProps: DispatchProps = {
  getAssignments: assignmentOperations.getAssignments,
  startSolving: assignmentOperations.startSolving,
  stopSolving: assignmentOperations.stopSolving
};

export type Props = StateProps & DispatchProps;

const toRad = (a: number) => a * Math.PI / 180;

const distance = (l1: Location, l2: Location) => {
  var R = 6371e3; // metres
  var φ1 = toRad(l1.lat);
  var φ2 = toRad(l2.lat);
  var Δφ = toRad(l2.lat-l1.lat);
  var Δλ = toRad(l2.lng-l1.lng);
  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

export const PeopleList: React.FC<Props> = (props) => {
  const { resultView } = props;
  const { t } = useTranslation("AssignmentPage");

  React.useEffect(() => {
    props.getAssignments();
  }, [props.getAssignments]);
  
  const actions = [
      { name: props.resultView.solverStatus === 'NOT_SOLVING'? t("startSolving") : t("stopSolving"),
        action: props.resultView.solverStatus === 'NOT_SOLVING'? props.startSolving : props.stopSolving
      },
      { name: t("refresh"), action: () => {
        props.getAssignments()
      }}
    ];
    
  return (
    <>
      <span
         style={{
           display: "grid",
           height: '60px',
           padding: '5px 5px 5px 5px',
           gridTemplateColumns: 'auto auto 1fr',
           backgroundColor: 'var(--pf-global--BackgroundColor--100)',
         }}
      >
        <ScoreDisplay score={resultView.result.score} />
        <span>Total Distance: {
            `${Math.floor(resultView.result.secretSantaAssignmentList
              .reduce((prev, assignment) => prev + ((assignment.gifter && assignment.reciever)? 
                  distance(assignment.gifter.location, assignment.reciever.location) : 0),
                  0))} km`}</span>
        <Actions
          actions={actions}
        />
      </span>
      <Table
        caption={t("Assignments")}
        cells={[t("gifter"), t("reciever"), t("distance")]}
        rows={
          resultView.result.secretSantaAssignmentList.map<IRow>(assignment => (
            {
              cells: [
                (<td key={0}><Text>{assignment.gifter? assignment.gifter.name : assignment.id}</Text></td>),
                (<td key={0}><Text>{assignment.reciever? assignment.reciever.name : ""}</Text></td>),
                (<td key={0}><Text>{(assignment.gifter && assignment.reciever)? 
                  `${Math.floor(distance(assignment.gifter.location, assignment.reciever.location)/1000)} km` : ""}</Text></td>),
              ]
            }))
        }
      >
        <TableHeader />
        <TableBody />
      </Table>
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleList);