package org.optaweb.secretsanta.solver;

import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Random;

import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.variable.PlanningVariable;
import org.optaplanner.core.config.heuristic.selector.common.SelectionCacheType;
import org.optaplanner.core.impl.domain.common.accessor.MemberAccessor;
import org.optaplanner.core.impl.domain.common.accessor.MemberAccessorFactory;
import org.optaplanner.core.impl.domain.entity.descriptor.EntityDescriptor;
import org.optaplanner.core.impl.domain.solution.descriptor.SolutionDescriptor;
import org.optaplanner.core.impl.domain.variable.descriptor.GenuineVariableDescriptor;
import org.optaplanner.core.impl.heuristic.move.Move;
import org.optaplanner.core.impl.heuristic.selector.entity.AbstractEntitySelector;
import org.optaplanner.core.impl.heuristic.selector.entity.EntitySelector;
import org.optaplanner.core.impl.heuristic.selector.entity.FromSolutionEntitySelector;
import org.optaplanner.core.impl.heuristic.selector.move.factory.MoveIteratorFactory;
import org.optaplanner.core.impl.score.director.ScoreDirector;
import org.optaweb.secretsanta.domain.Person;
import org.optaweb.secretsanta.domain.SecretSantaAssignment;
import org.optaweb.secretsanta.domain.SecretSantaResult;

import static org.optaplanner.core.impl.domain.common.accessor.MemberAccessorFactory.MemberAccessorType.FIELD_OR_GETTER_METHOD_WITH_SETTER;

public class SecretSantaResultRotationMoveIteratorFactory implements MoveIteratorFactory {
    
    private int rotationLength = 3;
    
    private static final SolutionDescriptor<SecretSantaResult> SOLUTION_DESCRIPTOR = SolutionDescriptor.buildSolutionDescriptor(SecretSantaResult.class, SecretSantaAssignment.class);
    
    @Override
    public long getSize(ScoreDirector scoreDirector) {
        return buildRotationMoveSelector(scoreDirector, true).getSize();
    }

    @Override
    public Iterator<? extends Move> createOriginalMoveIterator(ScoreDirector scoreDirector) {
        return buildRotationMoveSelector(scoreDirector, false).iterator();
    }

    @Override
    public Iterator<? extends Move> createRandomMoveIterator(ScoreDirector scoreDirector, Random workingRandom) {
        return buildRotationMoveSelector(scoreDirector, true).iterator();
    }
    
    private EntityDescriptor<SecretSantaResult> getEntityDescriptor() {
        return new EntityDescriptor<>(SOLUTION_DESCRIPTOR, SecretSantaAssignment.class);
    }
    
    private RotationMoveSelector buildRotationMoveSelector(ScoreDirector scoreDirector, boolean random) {
        return new RotationMoveSelector(getEntitySelector(scoreDirector), getGeninueVariableDescriptorList(), random);
    }
    
    private List<EntitySelector> getEntitySelector(ScoreDirector scoreDirector) {
        SecretSantaResult result = (SecretSantaResult) scoreDirector.getWorkingSolution();
        EntitySelector entitySelector = new SecretSantaAssignmentSelector(result.getSecretSantaAssignmentList());
        List<EntitySelector> out = new ArrayList<>(rotationLength);
        for (int i = 0; i < rotationLength; i++) {
            out.add(entitySelector);
        }
        return out;
    }
    
    private List<GenuineVariableDescriptor> getGeninueVariableDescriptorList() {
        MemberAccessor memberAccessor;
        try {
            memberAccessor = MemberAccessorFactory.buildMemberAccessor(SecretSantaAssignment.class.getMethod("getReceiver"), FIELD_OR_GETTER_METHOD_WITH_SETTER, PlanningVariable.class);
            GenuineVariableDescriptor<SecretSantaResult> variableDescriptor = new GenuineVariableDescriptor(getEntityDescriptor(), memberAccessor);
            List<GenuineVariableDescriptor> out = new ArrayList<>(rotationLength);
            for (int i = 0; i < rotationLength; i++) {
                out.add(variableDescriptor);
            }
            return out;
        }
        catch (NoSuchMethodException | SecurityException e) {
            e.printStackTrace();
            throw new IllegalStateException(e);
        }
    }
    
    public int getRotationLength() {
        return rotationLength;
    }
    
    public void setRotationLength(int rotationLength) {
        this.rotationLength = rotationLength;
    }
    
    private class SecretSantaAssignmentSelector extends AbstractEntitySelector {
        
        private List<SecretSantaAssignment> secretSantaAssignmentList;
        
        public SecretSantaAssignmentSelector(List<SecretSantaAssignment> secretSantaAssignmentList) {
            this.secretSantaAssignmentList = secretSantaAssignmentList;
        }

        @Override
        public EntityDescriptor getEntityDescriptor() {
            return getEntityDescriptor();
        }

        @Override
        public Iterator<Object> endingIterator() {
            return iterator();
        }

        @Override
        public long getSize() {
            return secretSantaAssignmentList.size();
        }

        @Override
        public boolean isCountable() {
            return false;
        }

        @Override
        public boolean isNeverEnding() {
            return true;
        }

        @Override
        public Iterator iterator() {
            return secretSantaAssignmentList.iterator();
        }

        @Override
        public ListIterator listIterator() {
            return secretSantaAssignmentList.listIterator();
        }

        @Override
        public ListIterator listIterator(int index) {
            return secretSantaAssignmentList.listIterator(index);
        }
        
    }

}
