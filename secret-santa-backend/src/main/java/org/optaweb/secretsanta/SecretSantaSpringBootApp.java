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

import java.time.DayOfWeek;
import java.time.LocalTime;

import org.optaweb.secretsanta.domain.Person;
import org.optaweb.secretsanta.domain.SecretSantaAssignment;
import org.optaweb.secretsanta.domain.Timeslot;
import org.optaweb.secretsanta.persistence.LessonRepository;
import org.optaweb.secretsanta.persistence.RoomRepository;
import org.optaweb.secretsanta.persistence.TimeslotRepository;
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
    public CommandLineRunner demoData(
            TimeslotRepository timeslotRepository, RoomRepository roomRepository,
            LessonRepository lessonRepository) {
        return (args) -> {
            timeslotRepository.save(new Timeslot(DayOfWeek.MONDAY, LocalTime.of(8, 30), LocalTime.of(9, 30)));
            Timeslot timeslotMonday0930 = new Timeslot(DayOfWeek.MONDAY, LocalTime.of(9, 30), LocalTime.of(10, 30));
            timeslotRepository.save(timeslotMonday0930);
            Timeslot timeslotMonday1030 = new Timeslot(DayOfWeek.MONDAY, LocalTime.of(10, 30), LocalTime.of(11, 30));
            timeslotRepository.save(timeslotMonday1030);
            timeslotRepository.save(new Timeslot(DayOfWeek.MONDAY, LocalTime.of(13, 30), LocalTime.of(14, 30)));
            timeslotRepository.save(new Timeslot(DayOfWeek.MONDAY, LocalTime.of(14, 30), LocalTime.of(15, 30)));

            timeslotRepository.save(new Timeslot(DayOfWeek.TUESDAY, LocalTime.of(8, 30), LocalTime.of(9, 30)));
            timeslotRepository.save(new Timeslot(DayOfWeek.TUESDAY, LocalTime.of(9, 30), LocalTime.of(10, 30)));
            timeslotRepository.save(new Timeslot(DayOfWeek.TUESDAY, LocalTime.of(10, 30), LocalTime.of(11, 30)));
            timeslotRepository.save(new Timeslot(DayOfWeek.TUESDAY, LocalTime.of(13, 30), LocalTime.of(14, 30)));
            timeslotRepository.save(new Timeslot(DayOfWeek.TUESDAY, LocalTime.of(14, 30), LocalTime.of(15, 30)));

            Person roomA = new Person("Room A");
            roomRepository.save(roomA);
            Person roomB = new Person("Room B");
            roomRepository.save(roomB);
            roomRepository.save(new Person("Room C"));

            lessonRepository.save(new SecretSantaAssignment("Math", "B. May", "9th grade"));
            lessonRepository.save(new SecretSantaAssignment("Math", "B. May", "9th grade"));
            lessonRepository.save(new SecretSantaAssignment("Physics", "M. Curie", "9th grade"));
            lessonRepository.save(new SecretSantaAssignment("Chemistry", "M. Curie", "9th grade"));
            SecretSantaAssignment lesson4 = new SecretSantaAssignment("Geography", "M. Polo", "9th grade");
            lesson4.setTimeslot(timeslotMonday0930);
            lesson4.setRoom(roomA);
            lessonRepository.save(lesson4);
            SecretSantaAssignment lesson5 = new SecretSantaAssignment("History", "I. Jones", "9th grade");
            lesson5.setTimeslot(timeslotMonday1030);
            lesson5.setRoom(roomA);
            lessonRepository.save(lesson5);
            SecretSantaAssignment lesson6 = new SecretSantaAssignment("English", "I. Jones", "9th grade");
            lesson6.setTimeslot(timeslotMonday1030);
            lesson6.setRoom(roomB);
            lessonRepository.save(lesson6);
            lessonRepository.save(new SecretSantaAssignment("English", "I. Jones", "9th grade"));
            lessonRepository.save(new SecretSantaAssignment("Spanish", "P. Cruz", "9th grade"));
            lessonRepository.save(new SecretSantaAssignment("Spanish", "P. Cruz", "9th grade"));

            lessonRepository.save(new SecretSantaAssignment("Math", "B. May", "10th grade"));
            lessonRepository.save(new SecretSantaAssignment("Math", "B. May", "10th grade"));
            lessonRepository.save(new SecretSantaAssignment("Math", "B. May", "10th grade"));
            lessonRepository.save(new SecretSantaAssignment("Physics", "M. Curie", "10th grade"));
            lessonRepository.save(new SecretSantaAssignment("Chemistry", "M. Curie", "10th grade"));
            lessonRepository.save(new SecretSantaAssignment("Geography", "M. Polo", "10th grade"));
            lessonRepository.save(new SecretSantaAssignment("History", "I. Jones", "10th grade"));
            lessonRepository.save(new SecretSantaAssignment("English", "P. Cruz", "10th grade"));
            lessonRepository.save(new SecretSantaAssignment("Spanish", "P. Cruz", "10th grade"));
            lessonRepository.save(new SecretSantaAssignment("French", "M. Curie", "10th grade"));
        };
    }

}
