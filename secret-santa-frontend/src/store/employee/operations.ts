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
import { alert } from 'store/alert';
import Employee from 'domain/Employee';
import { SetEmployeeListLoadingAction, AddEmployeeAction, RemoveEmployeeAction, UpdateEmployeeAction,
  RefreshEmployeeListAction } from './types';
import { AddAlertAction } from 'store/alert/types';

export const addEmployee: ThunkCommandFactory<Employee, AddAlertAction | AddEmployeeAction> = employee =>
  (dispatch, state, client) => {
    let tenantId = employee.tenantId;
    return client.post<Employee>(`/tenant/${tenantId}/employee/add`, employee).then(newEmployee => {
      dispatch(alert.showSuccessMessage("addEmployee", { name: newEmployee.name }));
      dispatch(actions.addEmployee(newEmployee))
    });
  };

export const removeEmployee: ThunkCommandFactory<Employee, AddAlertAction | RemoveEmployeeAction> = employee =>
  (dispatch, state, client) => {
    let tenantId = employee.tenantId;
    let employeeId = employee.id;
    return client.delete<boolean>(`/tenant/${tenantId}/employee/${employeeId}`).then(isSuccess => {
      if (isSuccess) {
        dispatch(alert.showSuccessMessage("removeEmployee", { name: employee.name }));
        dispatch(actions.removeEmployee(employee));
      }
      else {
        dispatch(alert.showErrorMessage("removeEmployeeError", { name: employee.name }));
      }
    });
  };

export const updateEmployee: ThunkCommandFactory<Employee, AddAlertAction | UpdateEmployeeAction> = employee =>
  (dispatch, state, client) => {
    let tenantId = employee.tenantId;
    return client.post<Employee>(`/tenant/${tenantId}/employee/update`, employee).then(updatedEmployee => {
      dispatch(alert.showSuccessMessage("updateEmployee", { id: updatedEmployee.id }));
      dispatch(actions.updateEmployee(updatedEmployee));
    });
  };

export const refreshEmployeeList:
ThunkCommandFactory<void, SetEmployeeListLoadingAction | RefreshEmployeeListAction> = () =>
  (dispatch, state, client) => {
    let tenantId = state().tenantData.currentTenantId;
    dispatch(actions.setIsEmployeeListLoading(true));
    return client.get<Employee[]>(`/tenant/${tenantId}/employee/`).then(employeeList => {
      dispatch(actions.refreshEmployeeList(employeeList));
      dispatch(actions.setIsEmployeeListLoading(false));
    });
  };
