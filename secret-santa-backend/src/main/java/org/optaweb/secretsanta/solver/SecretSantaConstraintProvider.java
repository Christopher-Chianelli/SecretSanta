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

import java.math.BigDecimal;
import java.math.MathContext;

import org.optaplanner.core.api.score.buildin.hardmediumsoftbigdecimal.HardMediumSoftBigDecimalScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import org.optaplanner.core.api.score.stream.Joiners;
import org.optaweb.secretsanta.domain.Location;
import org.optaweb.secretsanta.domain.SecretSantaAssignment;

public class SecretSantaConstraintProvider implements ConstraintProvider {

    @Override
    public Constraint[] defineConstraints(ConstraintFactory constraintFactory) {
        return new Constraint[] {
                noGifterOrReciever(constraintFactory),
        		sameRecieverConflict(constraintFactory),
        		sameGifterConflict(constraintFactory),
        		gifterIsRecieverConflict(constraintFactory),
        		largerDistanceAward(constraintFactory),
        		largerSecretAward(constraintFactory)
        };
    }

    private Constraint sameRecieverConflict(ConstraintFactory constraintFactory) {
        return constraintFactory
                .fromUniquePair(SecretSantaAssignment.class,
                        Joiners.equal(SecretSantaAssignment::getReciever))
                .penalize("Same Reciever", HardMediumSoftBigDecimalScore.ONE_HARD);
    }
    
    private Constraint sameGifterConflict(ConstraintFactory constraintFactory) {
        return constraintFactory
                .fromUniquePair(SecretSantaAssignment.class,
                        Joiners.equal(SecretSantaAssignment::getGifter))
                .penalize("Same Gifter", HardMediumSoftBigDecimalScore.ONE_HARD);
    }
    
    private Constraint gifterIsRecieverConflict(ConstraintFactory constraintFactory) {
        return constraintFactory
                .from(SecretSantaAssignment.class)
                .filter(assignment -> assignment.getGifter() != null && assignment.getReciever() != null)
                .filter(assignment -> assignment.getGifter().equals(assignment.getReciever()))
                .penalize("Gifter is Reciever", HardMediumSoftBigDecimalScore.ONE_HARD);
    }
    
    private Constraint noGifterOrReciever(ConstraintFactory constraintFactory) {
        return constraintFactory
                .from(SecretSantaAssignment.class)
                .filter(assignment -> assignment.getGifter() == null || assignment.getReciever() == null)
                .penalize("No Gifter or Reciever", HardMediumSoftBigDecimalScore.ONE_MEDIUM);
    }
    
    private Constraint largerDistanceAward(ConstraintFactory constraintFactory) {
        return constraintFactory
                .from(SecretSantaAssignment.class)
                .filter(assignment -> assignment.getGifter() != null && assignment.getReciever() != null)
                .rewardConfigurableBigDecimal("secretFactor", "Larger Distance Award",
                                  (m) -> BigDecimal.valueOf(Location.calculateDistanceBetween(m.getGifter().getLocation(),
                                                                           m.getReciever().getLocation())));
    }
    
    private Constraint largerSecretAward(ConstraintFactory constraintFactory) {
        return constraintFactory
                 .from(SecretSantaAssignment.class)
                 .filter(assignment -> assignment.getGifter() != null && assignment.getReciever() != null)
                 .rewardConfigurableBigDecimal("secretFactor", "Larger Secret Distance Award",
                    m -> 
                 BigDecimal.valueOf(Math.abs(m.getGifter().getSecretFactor() - m.getReciever().getSecretFactor())));
    }

}