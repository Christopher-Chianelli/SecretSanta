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

import org.optaweb.secretsanta.domain.SecretSantaAssignment;
import org.optaweb.secretsanta.domain.SecretSantaResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SecretSantaResultRepository {

    // There is only one time table, so there is only timeTableId (= problemId).
    public static final Long SINGLETON_TIME_TABLE_ID = 1L;

    @Autowired
    private SecretSantaAssignmentRepository secretSantaAssignmentRepository;
    @Autowired
    private PersonRepository personRepository;

    public SecretSantaResult findById(Long id) {
        if (!SINGLETON_TIME_TABLE_ID.equals(id)) {
            throw new IllegalStateException("There is no timeTable with id (" + id + ").");
        }
        // Occurs in a single transaction, so each initialized lesson references the same timeslot/room instance
        // that is contained by the timeTable's timeslotList/roomList.
        return new SecretSantaResult(
        		personRepository.findAll(),
                secretSantaAssignmentRepository.findAll()
              );
    }

    public void save(SecretSantaResult result) {
        for (SecretSantaAssignment assignment : result.getSecretSantaAssignmentList()) {
            // TODO this is awfully naive: optimistic locking will cause issues if called by the SolverManager
        	secretSantaAssignmentRepository.save(assignment);
        }
    }

}
