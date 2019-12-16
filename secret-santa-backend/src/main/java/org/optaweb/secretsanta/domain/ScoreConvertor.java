package org.optaweb.secretsanta.domain;

import javax.persistence.AttributeConverter;

import org.optaplanner.core.api.score.buildin.hardmediumsoftbigdecimal.HardMediumSoftBigDecimalScore;

public class ScoreConvertor implements
AttributeConverter<HardMediumSoftBigDecimalScore, String> {

    @Override
    public String convertToDatabaseColumn(HardMediumSoftBigDecimalScore attribute) {
        return attribute.toString();
    }

    @Override
    public HardMediumSoftBigDecimalScore convertToEntityAttribute(String dbData) {
        return HardMediumSoftBigDecimalScore.parseScore(dbData);
    }

}
