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

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PreRemove;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.optaplanner.core.api.domain.lookup.PlanningId;

@Entity
public class Person {

    @PlanningId
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @NotNull
    @Column(name = "id")
    private Long id;

    @NotBlank
    private String name;
    
    private Location location;
    
    private Long secretFactor;
    
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "gifter", cascade = CascadeType.ALL)
    private SecretSantaAssignment secretSantaAssignment = new SecretSantaAssignment(this, null);
    
    // Why do we have this?
    // JPA has no way to automatically set foreign keys to null
    // on delete, so we need to do it manually on
    // the deleted entity, and to do that we need to have
    // the entities to update
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "reciever")
    private Set<SecretSantaAssignment> recievers;

    private Person() {
    }

    public Person(String name, Location location, Long secretFactor) {
        this.name = name.trim();
        this.secretFactor = secretFactor;
    }
    
    @PreRemove
    private void preRemove() {
        recievers.forEach( child -> child.setReciever(null));
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
    
    public Location getLocation() {
        return location;
    }
    
    public Long getSecretFactor() {
        return secretFactor;
    }

    @Override
    public String toString() {
        return name;
    }

}
