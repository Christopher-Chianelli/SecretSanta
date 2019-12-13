/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.optaweb.secretsanta.persistence;

import org.optaweb.secretsanta.domain.Person;
import org.optaweb.secretsanta.domain.SecretSantaAssignment;
import org.optaweb.secretsanta.domain.Timeslot;
import org.optaweb.secretsanta.solver.TimeTableSolverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler
public class ProblemChangedRepositoryEventListener {

    @Autowired
    private TimeTableSolverService timeTableSolverService;

    @HandleAfterCreate
    @HandleAfterSave
    @HandleAfterDelete
    private void timeslotCreateSaveDelete(Timeslot timeslot) {
        timeTableSolverService.reloadProblem();
    }

    @HandleAfterCreate
    @HandleAfterSave
    @HandleAfterDelete
    private void roomCreateSaveDelete(Person room) {
        timeTableSolverService.reloadProblem();
    }

    @HandleAfterCreate
    @HandleAfterSave
    @HandleAfterDelete
    private void lessonCreateSaveDelete(SecretSantaAssignment lesson) {
        timeTableSolverService.reloadProblem();
    }

}
