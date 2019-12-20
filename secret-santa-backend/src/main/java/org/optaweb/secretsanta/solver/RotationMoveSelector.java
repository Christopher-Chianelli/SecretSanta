package org.optaweb.secretsanta.solver;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

import org.optaplanner.core.impl.domain.entity.descriptor.EntityDescriptor;
import org.optaplanner.core.impl.domain.variable.descriptor.GenuineVariableDescriptor;
import org.optaplanner.core.impl.domain.variable.inverserelation.SingletonInverseVariableDemand;
import org.optaplanner.core.impl.domain.variable.inverserelation.SingletonInverseVariableSupply;
import org.optaplanner.core.impl.domain.variable.supply.SupplyManager;
import org.optaplanner.core.impl.heuristic.move.Move;
import org.optaplanner.core.impl.heuristic.selector.common.iterator.AbstractOriginalSwapIterator;
import org.optaplanner.core.impl.heuristic.selector.common.iterator.AbstractRandomSwapIterator;
import org.optaplanner.core.impl.heuristic.selector.entity.EntitySelector;
import org.optaplanner.core.impl.heuristic.selector.move.generic.GenericMoveSelector;
import org.optaplanner.core.impl.heuristic.selector.move.generic.chained.ChainedSwapMove;
import org.optaplanner.core.impl.solver.scope.DefaultSolverScope;

public class RotationMoveSelector extends GenericMoveSelector {

    protected final List<EntitySelector> rotationEntitySelectorList;
    protected final List<GenuineVariableDescriptor> variableDescriptorList;
    protected final boolean randomSelection;

    protected final boolean anyChained;
    protected List<SingletonInverseVariableSupply> inverseVariableSupplyList = null;

    public RotationMoveSelector(List<EntitySelector> rotationEntitySelectorList,
            List<GenuineVariableDescriptor> variableDescriptorList, boolean randomSelection) {
        this.rotationEntitySelectorList = rotationEntitySelectorList;
        this.variableDescriptorList = variableDescriptorList;
        this.randomSelection = randomSelection;
        List<EntityDescriptor> entityDescriptorList = rotationEntitySelectorList.stream()
                .map(EntitySelector::getEntityDescriptor)
                .collect(Collectors.toList());
        
        List<Class> entityDescriptorClassList = entityDescriptorList.stream()
                .map(EntityDescriptor::getEntityClass)
                .distinct()
                .collect(Collectors.toList());
        
        if (entityDescriptorClassList.size() != 1) {
            throw new IllegalStateException("The selector (" + this
                    + ") does not have 1 entityClass; it entities classes are (" +
                    entityDescriptorClassList.stream().map(Class::getName).reduce("", (prev, curr) -> prev.isEmpty()? curr : prev + ", " + curr)
                    + ").");
        }
        boolean anyChained = false;
        if (variableDescriptorList.isEmpty()) {
            throw new IllegalStateException("The selector (" + this
                    + ")'s variableDescriptors (" + variableDescriptorList + ") is empty.");
        }
        for (GenuineVariableDescriptor variableDescriptor : variableDescriptorList) {
            if (!variableDescriptor.getEntityDescriptor().getEntityClass().isAssignableFrom(
                    entityDescriptorClassList.get(0))) {
                throw new IllegalStateException("The selector (" + this
                        + ") has a variableDescriptor with a entityClass ("
                        + variableDescriptor.getEntityDescriptor().getEntityClass()
                        + ") which is not equal or a superclass to the leftEntitySelector's entityClass ("
                        + entityDescriptorClassList.get(0) + ").");
            }
            if (variableDescriptor.isChained()) {
                anyChained = true;
            }
        }
        this.anyChained = anyChained;
        rotationEntitySelectorList.stream().distinct().forEach(phaseLifecycleSupport::addEventListener);
    }

    @Override
    public boolean supportsPhaseAndSolverCaching() {
        return !anyChained;
    }

    @Override
    public void solvingStarted(DefaultSolverScope solverScope) {
        super.solvingStarted(solverScope);
        if (anyChained) {
            inverseVariableSupplyList = new ArrayList<>(variableDescriptorList.size());
            SupplyManager supplyManager = solverScope.getScoreDirector().getSupplyManager();
            for (GenuineVariableDescriptor variableDescriptor : variableDescriptorList) {
                SingletonInverseVariableSupply inverseVariableSupply;
                if (variableDescriptor.isChained()) {
                    inverseVariableSupply = supplyManager.demand(
                            new SingletonInverseVariableDemand(variableDescriptor));
                } else {
                    inverseVariableSupply = null;
                }
                inverseVariableSupplyList.add(inverseVariableSupply);
            }
        }
    }

    @Override
    public void solvingEnded(DefaultSolverScope solverScope) {
        super.solvingEnded(solverScope);
        if (anyChained) {
            inverseVariableSupplyList = null;
        }
    }

    // ************************************************************************
    // Worker methods
    // ************************************************************************

    @Override
    public boolean isCountable() {
        return rotationEntitySelectorList.stream().allMatch(EntitySelector::isCountable);
    }

    @Override
    public boolean isNeverEnding() {
        return rotationEntitySelectorList.stream().anyMatch(EntitySelector::isNeverEnding);
    }

    @Override
    public long getSize() {
        // ... this will be a very big number for large rotation lengths; may overflow
        long totalSize = 1;
        List<EntitySelector> distinctEntitySelectorList = rotationEntitySelectorList.stream().distinct().collect(Collectors.toList());
        for (EntitySelector distinctEntitySelector : distinctEntitySelectorList) {
            long count = rotationEntitySelectorList.stream().filter(s -> s.equals(distinctEntitySelector)).count();
            long numOfPerms = 1;
            for (long i = 0; i < count; i++) {
                numOfPerms *= distinctEntitySelector.getSize() - i;
            }
            // cycles (1 2 3), (2 3 1) and (3 1 2) are identical, so divide by count
            totalSize *= numOfPerms / count;
        }
        return totalSize;
    }

    @Override
    public Iterator<Move> iterator() {
        //if (!randomSelection) {
        //    return new AbstractOriginalSwapIterator<Move, Object>(leftEntitySelector, rightEntitySelector) {
        //        @Override
        //        protected Move newSwapSelection(Object leftSubSelection, Object rightSubSelection) {
        //            return anyChained
        //                    ? new RotationMove(variableDescriptorList, ...)
        //                    : new RotationMove(variableDescriptorList, ...);
        //        }
        //    };
        //} else {
            return new AbstractRotationMoveIterator<Move, Object>(rotationEntitySelectorList) {
                @Override
                protected Move newRotationSelection(List<Object> rotationSelection) {
                    return anyChained
                            ? new RotationMove(variableDescriptorList, rotationSelection)
                            : new RotationMove(variableDescriptorList, rotationSelection);
                }
            };
        //}
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" + rotationEntitySelectorList.stream().map(s -> toString()).reduce("", (prev, curr) -> prev.isEmpty()? curr : prev + ", " + curr) + ")";
    }

}