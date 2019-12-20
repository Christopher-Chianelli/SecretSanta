package org.optaweb.secretsanta.solver;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.optaplanner.core.api.domain.valuerange.ValueRange;
import org.optaplanner.core.impl.domain.valuerange.descriptor.ValueRangeDescriptor;
import org.optaplanner.core.impl.domain.variable.descriptor.GenuineVariableDescriptor;
import org.optaplanner.core.impl.heuristic.move.AbstractMove;
import org.optaplanner.core.impl.score.director.ScoreDirector;

public class RotationMove<Solution_> extends AbstractMove<Solution_> {
    
    protected final List<GenuineVariableDescriptor<Solution_>> variableDescriptorList;
    protected final List<Object> rotationEntityList;
    
    public RotationMove(List<GenuineVariableDescriptor<Solution_>> variableDescriptorList, List<Object> rotationEntityList) {
        this.variableDescriptorList = variableDescriptorList;
        this.rotationEntityList = rotationEntityList;
    }
    

    public List<String> getVariableNameList() {
        return variableDescriptorList.stream()
                 .map(GenuineVariableDescriptor::getVariableName)
                 .collect(Collectors.toCollection(ArrayList::new));
    }
    
    public List<Object> getRotationEntityList() {
        return rotationEntityList;
    }
    

    // ************************************************************************
    // Worker methods
    // ************************************************************************
    
    @Override
    public boolean isMoveDoable(ScoreDirector<Solution_> scoreDirector) {
        boolean movable = false;
        for (GenuineVariableDescriptor<Solution_> variableDescriptor : variableDescriptorList) {
            List<Object> rotationValues = rotationEntityList.stream().map(variableDescriptor::getValue).collect(Collectors.toList());
            if (rotationValues.stream().distinct().count() > 1) {
                movable = true;
                if (!variableDescriptor.isValueRangeEntityIndependent()) {
                    ValueRangeDescriptor<Solution_> valueRangeDescriptor = variableDescriptor.getValueRangeDescriptor();
                    Solution_ workingSolution = scoreDirector.getWorkingSolution();
                    for (Object entity : rotationEntityList) {
                        ValueRange valueRange = valueRangeDescriptor.extractValueRange(workingSolution, entity);
                        if (!valueRange.contains(entity)) {
                            return false;
                        }
                    }
                }
            }
        }
        return movable;
    }

    @Override
    protected RotationMove<Solution_> createUndoMove(ScoreDirector<Solution_> scoreDirector) {
        final List<Object> reversedRotationEntities = new ArrayList<>(rotationEntityList);
        Collections.reverse(reversedRotationEntities);
        return new RotationMove<>(variableDescriptorList, reversedRotationEntities);
    }
    
    @Override
    public RotationMove<Solution_> rebase(ScoreDirector<Solution_> destinationScoreDirector) {
        return new RotationMove<>(variableDescriptorList,
                rotationEntityList.stream()
                  .map(destinationScoreDirector::lookUpWorkingObject)
                  .collect(Collectors.toList()));
    }

    @Override
    protected void doMoveOnGenuineVariables(ScoreDirector<Solution_> scoreDirector) {
        final int CYCLE_SIZE = rotationEntityList.size();
        if (CYCLE_SIZE > 1) {
            for (GenuineVariableDescriptor<Solution_> variableDescriptor : variableDescriptorList) {
                Object newLastValue = variableDescriptor.getValue(rotationEntityList.get(0));
                for (int i = 0; i < CYCLE_SIZE - 1; i++) {
                    Object oldValue = variableDescriptor.getValue(rotationEntityList.get(i));
                    Object newValue = variableDescriptor.getValue(rotationEntityList.get(i + 1));
                    if (!Objects.equals(oldValue, newValue)) {
                        scoreDirector.beforeVariableChanged(variableDescriptor, rotationEntityList.get(i));
                        variableDescriptor.setValue(rotationEntityList.get(i), newValue);
                        scoreDirector.afterVariableChanged(variableDescriptor, rotationEntityList.get(i));
                    }
                }
                Object oldLastValue = variableDescriptor.getValue(rotationEntityList.get(CYCLE_SIZE - 1));
                if (!Objects.equals(oldLastValue, newLastValue)) {
                    scoreDirector.beforeVariableChanged(variableDescriptor, rotationEntityList.get(CYCLE_SIZE - 1));
                    variableDescriptor.setValue(rotationEntityList.get(CYCLE_SIZE - 1), newLastValue);
                    scoreDirector.afterVariableChanged(variableDescriptor, rotationEntityList.get(CYCLE_SIZE - 1));
                }
            }
        }
    }
    

    // ************************************************************************
    // Introspection methods
    // ************************************************************************

    @Override
    public String getSimpleMoveTypeDescription() {
        StringBuilder moveTypeDescription = new StringBuilder(20 * (variableDescriptorList.size() + 1));
        moveTypeDescription.append(getClass().getSimpleName()).append("(");
        String delimiter = "";
        for (GenuineVariableDescriptor<Solution_> variableDescriptor : variableDescriptorList) {
            moveTypeDescription.append(delimiter).append(variableDescriptor.getSimpleEntityAndVariableName());
            delimiter = ", ";
        }
        moveTypeDescription.append(")");
        return moveTypeDescription.toString();
    }
    
    @Override
    public Collection<? extends Object> getPlanningEntities() {
        return getRotationEntityList();
    }
    

    @Override
    public Collection<? extends Object> getPlanningValues() {
        List<Object> values = new ArrayList<>(variableDescriptorList.size() * rotationEntityList.size());
        for (GenuineVariableDescriptor<Solution_> variableDescriptor : variableDescriptorList) {
            values.addAll(rotationEntityList.stream().map(variableDescriptor::getValue).collect(Collectors.toList()));
        }
        return values;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final RotationMove<?> rotationMove = (RotationMove<?>) o;
        return Objects.equals(variableDescriptorList, rotationMove.variableDescriptorList) &&
                Objects.equals(rotationEntityList, rotationMove.rotationEntityList);
    }
    

    @Override
    public int hashCode() {
        return Objects.hash(variableDescriptorList, rotationEntityList);
    }
    
    @Override
    public String toString() {
        StringBuilder s = new StringBuilder(variableDescriptorList.size() * 16);
        s.append("(");
        if (!rotationEntityList.isEmpty()) {
            rotationEntityList.forEach(entity -> appendVariablesToString(s, entity));
            s.delete(s.length() - 2, s.length() - 1);
        }
        s.append(")");
        return s.toString();
    }
    
    protected void appendVariablesToString(StringBuilder s, Object entity) {
        boolean first = true;
        for (GenuineVariableDescriptor<Solution_> variableDescriptor : variableDescriptorList) {
            if (!first) {
                s.append(", ");
            }
            s.append(variableDescriptor.getValue(entity));
            first = false;
        }
    }
}
