/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { AppState } from '../types';
import ResultView from 'domain/ResultView';
import Location from 'domain/Location';

export function getBoundingBox(resultView: ResultView): Location[] {
  let lowerLeft = { lat: Infinity, lng: Infinity, address: "" };
  let upperRight = { lat: -Infinity, lng: -Infinity, address: "" };
  resultView.result.personList.forEach(p => {
    if (p.location.lat < lowerLeft.lat) {
        lowerLeft.lat = p.location.lat;
    }
    if (p.location.lng < lowerLeft.lng) {
        lowerLeft.lng = p.location.lng;
    }
    if (p.location.lat > upperRight.lat) {
        upperRight.lat = p.location.lat;
    }
    if (p.location.lng > upperRight.lng) {
        upperRight.lng = p.location.lng;
    }
  });
  lowerLeft.lat = Math.min(lowerLeft.lat, 180);
  lowerLeft.lng = Math.min(lowerLeft.lng, 90);
  upperRight.lat = Math.max(upperRight.lat, -180);
  upperRight.lng = Math.max(upperRight.lng, -90);
  console.log(lowerLeft);
  console.log(upperRight);
  return [lowerLeft, upperRight];
}