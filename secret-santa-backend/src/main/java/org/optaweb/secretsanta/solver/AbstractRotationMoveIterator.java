package org.optaweb.secretsanta.solver;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.optaplanner.core.impl.heuristic.selector.common.iterator.UpcomingSelectionIterator;

public abstract class AbstractRotationMoveIterator<S, SubS> extends UpcomingSelectionIterator<S>  {
    
    protected final List<? extends Iterable<SubS>> rotationSelectorList;
    protected List<Iterator<SubS>> rotationSubSelectionIteratorList;
    
    public AbstractRotationMoveIterator(List<? extends Iterable<SubS>> rotationSelectorList) {
        this.rotationSelectorList = rotationSelectorList;
        rotationSubSelectionIteratorList = new ArrayList<>(rotationSelectorList.size());
        rotationSelectorList.forEach(s -> rotationSubSelectionIteratorList.add(s.iterator()));
    }
    
    @Override
    protected S createUpcomingSelection() {
        List<SubS> newSelection = new ArrayList<>(rotationSelectorList.size());
        for (int i = 0; i < rotationSubSelectionIteratorList.size(); i++) {
            if (!rotationSubSelectionIteratorList.get(i).hasNext()) {
                rotationSubSelectionIteratorList.set(i, rotationSelectorList.get(i).iterator());
                if (!rotationSubSelectionIteratorList.get(i).hasNext()) {
                    return noUpcomingSelection();
                }
                newSelection.add(rotationSubSelectionIteratorList.get(i).next());
            } 
        }
        return newRotationSelection(newSelection);
    }
    
    protected abstract S newRotationSelection(List<SubS> rotationSelection);
}
