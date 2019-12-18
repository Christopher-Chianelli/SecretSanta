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
                sameReceiverConflict(constraintFactory),
                gifterIsReceiverConflict(constraintFactory),
                largerDistanceAward(constraintFactory),
                largerSecretAward(constraintFactory),
                giftPair(constraintFactory)
        };
    }

    private Constraint sameReceiverConflict(ConstraintFactory constraintFactory) {
        return constraintFactory
                .fromUniquePair(SecretSantaAssignment.class,
                        Joiners.equal(SecretSantaAssignment::getReceiver))
                .penalize("Same Receiver", HardMediumSoftBigDecimalScore.ONE_HARD);
    }
    
    private Constraint gifterIsReceiverConflict(ConstraintFactory constraintFactory) {
        return constraintFactory
                .from(SecretSantaAssignment.class)
                .filter(assignment -> assignment.getGifter().equals(assignment.getReceiver()))
                .penalize("Gifter is Receiver", HardMediumSoftBigDecimalScore.ONE_HARD);
    }
    
    private Constraint giftPair(ConstraintFactory constraintFactory) {
        return constraintFactory
                .fromUniquePair(SecretSantaAssignment.class,
                                Joiners.equal(SecretSantaAssignment::getGifter, SecretSantaAssignment::getReceiver),
                                Joiners.equal(SecretSantaAssignment::getReceiver, SecretSantaAssignment::getGifter))
                .penalize("Gifter-Receiver Cycle", HardMediumSoftBigDecimalScore.ONE_MEDIUM);
    }
    
    private Constraint largerDistanceAward(ConstraintFactory constraintFactory) {
        return constraintFactory
                .from(SecretSantaAssignment.class)
                .rewardConfigurableBigDecimal("secretFactor", "Larger Distance Award",
                                  (m) -> BigDecimal.valueOf(Location.calculateDistanceBetween(m.getGifter().getLocation(),
                                                                           m.getReceiver().getLocation())));
    }
    
    private Constraint largerSecretAward(ConstraintFactory constraintFactory) {
        return constraintFactory
                 .from(SecretSantaAssignment.class)
                 .rewardConfigurableBigDecimal("secretFactor", "Larger Secret Distance Award",
                    m -> 
                 BigDecimal.valueOf(Math.abs(m.getGifter().getSecretFactor() - m.getReceiver().getSecretFactor())));
    }

}