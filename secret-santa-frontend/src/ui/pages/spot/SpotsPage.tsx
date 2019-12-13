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

import * as React from 'react';
import { DataTable, DataTableProps, PropertySetter } from 'ui/components/DataTable';
import { StatefulMultiTypeaheadSelectInput } from 'ui/components/MultiTypeaheadSelectInput'
import { spotSelectors, spotOperations } from 'store/spot';
import { skillSelectors } from 'store/skill';
import Spot from 'domain/Spot';
import { AppState } from 'store/types';
import {
  TextInput, Text, Chip, ChipGroup,
} from '@patternfly/react-core';
import { connect } from 'react-redux';
import Skill from 'domain/Skill';
import { Predicate, ReadonlyPartial, Sorter } from 'types';
import { stringSorter } from 'util/CommonSorters';
import { stringFilter } from 'util/CommonFilters';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withRouter } from 'react-router';

interface StateProps extends DataTableProps<Spot> {
  tenantId: number;
  skillList: Skill[];
}

const mapStateToProps = (state: AppState, ownProps: Props): StateProps => ({
  ...ownProps,
  title: ownProps.t("spots"),
  columnTitles: [ownProps.t("name"), ownProps.t("requiredSkillSet")],
  tableData: spotSelectors.getSpotList(state),
  skillList: skillSelectors.getSkillList(state),
  tenantId: state.tenantData.currentTenantId
}); 

export interface DispatchProps {
  addSpot: typeof spotOperations.addSpot;
  updateSpot: typeof spotOperations.updateSpot;
  removeSpot: typeof spotOperations.removeSpot;
}

const mapDispatchToProps: DispatchProps = {
  addSpot: spotOperations.addSpot,
  updateSpot: spotOperations.updateSpot,
  removeSpot: spotOperations.removeSpot
};

export type Props = StateProps & DispatchProps & WithTranslation;

export class SpotsPage extends DataTable<Spot, Props> {
  constructor(props: Props) {
    super(props);
    this.addData = this.addData.bind(this);
    this.updateData = this.updateData.bind(this);
    this.removeData = this.removeData.bind(this);
  }

  displayDataRow(data: Spot): JSX.Element[] {
    return [
      <Text key={0}>{data.name}</Text>,
      <ChipGroup key={1}>
        {data.requiredSkillSet.map(skill => (
          <Chip key={skill.name} isReadOnly>
            {skill.name}
          </Chip>
        ))}
      </ChipGroup>
    ];
  }

  getInitialStateForNewRow(): Partial<Spot> {
    return {
      requiredSkillSet: []
    };
  }
  
  editDataRow(data: ReadonlyPartial<Spot>, setProperty: PropertySetter<Spot>): JSX.Element[] {
    return [
      <TextInput
        key={0}
        name="name"
        defaultValue={data.name}
        aria-label="Name"
        onChange={(value) => setProperty("name",value)}
      />,
      <StatefulMultiTypeaheadSelectInput
        key={1}
        emptyText={this.props.t("selectRequiredSkills")}
        options={this.props.skillList}
        optionToStringMap={skill => skill.name}
        value={data.requiredSkillSet? data.requiredSkillSet : []}
        onChange={selected => setProperty("requiredSkillSet",selected)}
      />
    ];
  }
  
  isDataComplete(editedValue: ReadonlyPartial<Spot>): editedValue is Spot {
    return editedValue.name !== undefined &&
      editedValue.requiredSkillSet !== undefined;
  }

  isValid(editedValue: Spot): boolean {
    return editedValue.name.trim().length > 0;
  }

  getFilter(): (filter: string) => Predicate<Spot> {
    return stringFilter(spot => spot.name,
      spot => spot.requiredSkillSet.map(skill => skill.name));
  }

  getSorters(): (Sorter<Spot> | null)[] {
    return [stringSorter(s => s.name), null];
  }
  
  updateData(data: Spot): void {
    this.props.updateSpot(data);
  }
  
  addData(data: Spot): void {
    this.props.addSpot({...data, tenantId: this.props.tenantId});
  }

  removeData(data: Spot): void {
    this.props.removeSpot(data);
  }
}

export default withTranslation("SpotsPage")(connect(mapStateToProps, mapDispatchToProps)(withRouter(SpotsPage)));
