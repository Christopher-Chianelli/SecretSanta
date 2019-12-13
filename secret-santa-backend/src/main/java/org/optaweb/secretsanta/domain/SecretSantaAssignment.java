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

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

@PlanningEntity
@Entity
public class SecretSantaAssignment {

    @PlanningId
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @NotNull
    private Long id;

    @PlanningVariable(valueRangeProviderRefs = "personRange")
    @ManyToOne
    private Person gifter;
    
    @PlanningVariable(valueRangeProviderRefs = "personRange")
    @ManyToOne
    private Person reciever;

    private SecretSantaAssignment() {
    }

    public SecretSantaAssignment(Person gifter, Person reciever) {
        this.gifter = gifter;
        this.reciever = reciever;
    }

    public Long getId() {
        return id;
    }
    
    public Person getGifter() {
        return gifter;
    }

    public void setGifter(Person gifter) {
        this.gifter = gifter;
    }

    public Person getReciever() {
        return reciever;
    }

    public void setReciever(Person reciever) {
        this.reciever = reciever;
    }

    @Override
    public String toString() {
        return gifter.getName() + " -> [&] -> " + reciever.getName();
    }

}