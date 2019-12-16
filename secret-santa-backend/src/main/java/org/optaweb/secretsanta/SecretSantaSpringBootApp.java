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

package org.optaweb.secretsanta;

import org.optaweb.secretsanta.domain.SecretSantaConstraintConfiguration;
import org.optaweb.secretsanta.persistence.SecretSantaConstraintConfigurationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SecretSantaSpringBootApp {

    public static void main(String[] args) {
        SpringApplication.run(SecretSantaSpringBootApp.class, args);
    }
    
    @Bean
    public CommandLineRunner demoData(SecretSantaConstraintConfigurationRepository configRepository) {
        return (args) -> {
            configRepository.save(new SecretSantaConstraintConfiguration());
        };
    }

}
