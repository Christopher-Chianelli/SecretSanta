package org.optaweb.secretsanta.domain;

import java.math.BigDecimal;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.optaplanner.core.api.domain.constraintweight.ConstraintConfiguration;
import org.optaplanner.core.api.domain.constraintweight.ConstraintWeight;
import org.optaplanner.core.api.score.buildin.hardmediumsoftbigdecimal.HardMediumSoftBigDecimalScore;
import org.optaweb.secretsanta.persistence.SecretSantaResultRepository;

@Entity
@ConstraintConfiguration(constraintPackage = "secretFactor")
public class SecretSantaConstraintConfiguration {
    @Id
    @NotNull
    private Long id = SecretSantaResultRepository.SINGLETON_TIME_TABLE_ID;
    
    @ConstraintWeight("Larger Secret Distance Award")
    @Convert(converter = ScoreConvertor.class)
    private HardMediumSoftBigDecimalScore largerSecretDistanceAward = HardMediumSoftBigDecimalScore.ofSoft(BigDecimal.valueOf(1));
    
    @ConstraintWeight("Larger Distance Award")
    @Convert(converter = ScoreConvertor.class)
    private HardMediumSoftBigDecimalScore largerDistanceAward = HardMediumSoftBigDecimalScore.ofSoft(BigDecimal.valueOf(1));
    
    public Long getId() {
      return id;
    }
    
    public void setLargerSecretDistanceAward(String scoreString) {
        largerSecretDistanceAward = HardMediumSoftBigDecimalScore.parseScore(scoreString);
    }
    
    public HardMediumSoftBigDecimalScore getLargerSecretDistanceAward() {
        return largerSecretDistanceAward;
    }
    
    public void setLargerDistanceAward(String scoreString) {
        largerDistanceAward = HardMediumSoftBigDecimalScore.parseScore(scoreString);
    }
    
    public HardMediumSoftBigDecimalScore getLargerDistanceAward() {
        return largerDistanceAward;
    }
}
