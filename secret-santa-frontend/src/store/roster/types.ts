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

import { Action } from 'redux';
import ShiftRosterView from 'domain/ShiftRosterView';
import AvailabilityRosterView from 'domain/AvailabilityRosterView';
import RosterState from 'domain/RosterState';

export enum RosterStateActionType {
  SET_ROSTER_STATE_IS_LOADING = 'SET_ROSTER_STATE_IS_LOADING',
  SET_ROSTER_STATE = 'SET_ROSTER_STATE',
  PUBLISH_ROSTER = 'PUBLISH_ROSTER'
}

export enum AvailabilityRosterViewActionType {
  SET_AVAILABILITY_ROSTER_IS_LOADING = 'SET_AVAILABILITY_ROSTER_IS_LOADING',
  SET_AVAILABILITY_ROSTER_VIEW = 'SET_AVAILABILITY_ROSTER_VIEW'
}

export enum ShiftRosterViewActionType {
  SET_SHIFT_ROSTER_IS_LOADING = 'SET_SHIFT_ROSTER_IS_LOADING',
  SET_SHIFT_ROSTER_VIEW = 'SET_SHIFT_ROSTER_VIEW'
}

export enum SolverActionType {
  SOLVE_ROSTER = 'SOLVE_ROSTER',
  TERMINATE_SOLVING_ROSTER_EARLY = 'TERMINATE_SOLVING_ROSTER_EARLY'
}

export interface SetRosterStateIsLoadingAction extends Action<RosterStateActionType.SET_ROSTER_STATE_IS_LOADING> {
  readonly isLoading: boolean;
}


export interface SetRosterStateAction extends Action<RosterStateActionType.SET_ROSTER_STATE> {
  readonly rosterState: RosterState;
}

export interface PublishRosterAction extends Action<RosterStateActionType.PUBLISH_ROSTER> {
  readonly publishResult: PublishResult;
}

export interface SetShiftRosterIsLoadingAction extends Action<ShiftRosterViewActionType.SET_SHIFT_ROSTER_IS_LOADING> {
  readonly isLoading: boolean;
}

export interface SetShiftRosterViewAction extends Action<ShiftRosterViewActionType.SET_SHIFT_ROSTER_VIEW> {
  readonly shiftRoster: ShiftRosterView;
}

export interface SetAvailabilityRosterIsLoadingAction extends
  Action<AvailabilityRosterViewActionType.SET_AVAILABILITY_ROSTER_IS_LOADING> {
  readonly isLoading: boolean;
}

export interface SetAvailabilityRosterViewAction extends
  Action<AvailabilityRosterViewActionType.SET_AVAILABILITY_ROSTER_VIEW> {
  readonly availabilityRoster: AvailabilityRosterView;
}

export interface SolveRosterAction extends Action<SolverActionType.SOLVE_ROSTER> {
}

export interface TerminateSolvingRosterEarlyAction extends Action<SolverActionType.TERMINATE_SOLVING_ROSTER_EARLY> {
}

export type RosterStateAction = SetRosterStateIsLoadingAction | SetRosterStateAction | PublishRosterAction;
export type ShiftRosterViewAction = SetShiftRosterIsLoadingAction | SetShiftRosterViewAction;
export type AvailabilityRosterViewAction = SetAvailabilityRosterIsLoadingAction | SetAvailabilityRosterViewAction;
export type SolverAction = SolveRosterAction | TerminateSolvingRosterEarlyAction;

export interface PublishResult {
  readonly publishedFromDate: Date;
  readonly publishedToDate: Date;
}

export interface CurrentRosterState {
  readonly isLoading: boolean;
  readonly rosterState: RosterState | null;
}

export interface CurrentShiftRoster {
  readonly isLoading: boolean;
  readonly shiftRosterView: ShiftRosterView | null;
}

export interface CurrentAvailabilityRoster {
  readonly isLoading: boolean;
  readonly availabilityRosterView: AvailabilityRosterView | null;
}

export interface CurrentSolverState {
  readonly isSolving: boolean;
}