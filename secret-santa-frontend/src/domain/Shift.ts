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
import DomainObject from './DomainObject';
import Employee from './Employee';
import Spot from './Spot';
import HardMediumSoftScore from './HardMediumSoftScore';
import RequiredSkillViolation from './indictment/RequiredSkillViolation';
import UnavailableEmployeeViolation from './indictment/UnavailableEmployeeViolation';
import ShiftEmployeeConflictViolation from './indictment/ShiftEmployeeConflictViolation';
import DesiredTimeslotForEmployeeReward from './indictment/DesiredTimeslotForEmployeeReward';
import UndesiredTimeslotForEmployeePenalty from './indictment/UndesiredTimeslotForEmployeePenalty';
import RotationViolationPenalty from './indictment/RotationViolationPenalty';
import UnassignedShiftPenalty from './indictment/UnassignedShiftPenalty';
import ContractMinutesViolation from './indictment/ContractMinutesViolation';

export default interface Shift extends DomainObject {
  startDateTime: Date;
  endDateTime: Date;
  spot: Spot;
  rotationEmployee: Employee | null;
  employee: Employee | null;
  pinnedByUser: boolean;
  indictmentScore?: HardMediumSoftScore;
  requiredSkillViolationList?: RequiredSkillViolation[];
  unavailableEmployeeViolationList?: UnavailableEmployeeViolation[];
  shiftEmployeeConflictList?: ShiftEmployeeConflictViolation[];
  desiredTimeslotForEmployeeRewardList?: DesiredTimeslotForEmployeeReward[];
  undesiredTimeslotForEmployeePenaltyList?: UndesiredTimeslotForEmployeePenalty[];
  rotationViolationPenaltyList?: RotationViolationPenalty[];
  unassignedShiftPenaltyList?: UnassignedShiftPenalty[];
  contractMinutesViolationPenaltyList?: ContractMinutesViolation[];
}