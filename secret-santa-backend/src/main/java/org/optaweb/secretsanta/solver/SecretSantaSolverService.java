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

package org.optaweb.secretsanta.solver;

import org.optaplanner.core.api.score.ScoreManager;
import org.optaplanner.core.api.solver.SolverManager;
import org.optaplanner.core.api.solver.SolverStatus;
import org.optaweb.secretsanta.domain.SecretSantaResult;
import org.optaweb.secretsanta.domain.SecretSantaResultView;
import org.optaweb.secretsanta.persistence.SecretSantaResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/assignments")
public class SecretSantaSolverService {

    @Autowired
    private SecretSantaResultRepository timeTableRepository;
    @Autowired
    private SolverManager<SecretSantaResult, Long> solverManager;
    @Autowired
    private ScoreManager<SecretSantaResult> scoreManager;

    // To try, open http://localhost:8080/timeTable
    @GetMapping()
    public SecretSantaResultView getTimeTableView() {
        SecretSantaResult result = timeTableRepository.findById(SecretSantaResultRepository.SINGLETON_TIME_TABLE_ID);
        scoreManager.updateScore(result);
        SolverStatus solverStatus = solverManager.getSolverStatus(SecretSantaResultRepository.SINGLETON_TIME_TABLE_ID);
        return new SecretSantaResultView(result, solverStatus);
    }

    @PostMapping("/solve")
    public void solve() {
        solverManager.solveAndListen(SecretSantaResultRepository.SINGLETON_TIME_TABLE_ID,
                timeTableRepository::findById,
                timeTableRepository::save);
    }

    public void reloadProblem() {
        if (solverManager.getSolverStatus(SecretSantaResultRepository.SINGLETON_TIME_TABLE_ID) == SolverStatus.NOT_SOLVING) {
            return;
        }
        throw new UnsupportedOperationException("The solver is solving.");
        // TODO Future work: use reloadProblem() instead of the code above
//        solverManager.reloadProblem(TIME_TABLE_ID, timeTableRepository::findById);
    }

    @PostMapping("/stopSolving")
    public void stopSolving() {
        solverManager.terminateEarly(SecretSantaResultRepository.SINGLETON_TIME_TABLE_ID);
    }

}
