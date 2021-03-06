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

package org.optaweb.secretsanta.domain;

import java.util.List;

import org.optaplanner.core.api.domain.constraintweight.ConstraintConfigurationProvider;
import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningScore;
import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.domain.solution.drools.ProblemFactCollectionProperty;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
import org.optaplanner.core.api.score.buildin.hardmediumsoftbigdecimal.HardMediumSoftBigDecimalScore;
import org.optaplanner.core.impl.score.buildin.hardmediumsoftbigdecimal.HardMediumSoftBigDecimalScoreDefinition;

@PlanningSolution
public class SecretSantaResult {

    @ProblemFactCollectionProperty
    @ValueRangeProvider(id = "personRange")
    private List<Person> personList;
    @PlanningEntityCollectionProperty
    private List<SecretSantaAssignment> secretSantaAssignmentList;
    
    @ConstraintConfigurationProvider
    private SecretSantaConstraintConfiguration constraintConfiguration;

    @PlanningScore(scoreDefinitionClass=HardMediumSoftBigDecimalScoreDefinition.class)
    private HardMediumSoftBigDecimalScore score;

    private SecretSantaResult() {
    }

    public SecretSantaResult(List<Person> personList, List<SecretSantaAssignment> secretSantaAssignmentList, SecretSantaConstraintConfiguration constraintConfiguration) {
        this.personList = personList;
        this.secretSantaAssignmentList = secretSantaAssignmentList;
        this.constraintConfiguration = constraintConfiguration;
    }

    public List<Person> getPersonList() {
        return personList;
    }

    public List<SecretSantaAssignment> getSecretSantaAssignmentList() {
        return secretSantaAssignmentList;
    }
    
    public SecretSantaConstraintConfiguration getConstraintConfiguration() {
        return constraintConfiguration;
    }
    
    public void setConstraintConfiguration(SecretSantaConstraintConfiguration constraintConfiguration) {
        this.constraintConfiguration = constraintConfiguration;
    }

    public HardMediumSoftBigDecimalScore getScore() {
        return score;
    }

    public void setScore(HardMediumSoftBigDecimalScore score) {
        this.score = score;
    }
}
