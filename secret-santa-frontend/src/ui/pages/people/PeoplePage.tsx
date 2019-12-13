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
import { AppState } from 'store/types';
import { Text, Level, LevelItem, Pagination, Button, DataList, DataListItem, DataListItemRow, DataListItemCells, DataListCell, DataListAction } from '@patternfly/react-core';
import { connect } from 'react-redux';
import { Stream } from 'util/ImmutableCollectionOperations';
import { stringFilter } from 'util/CommonFilters';
import Person from 'domain/Person';
import { personOperations, personSelectors } from 'store/person';
import FilterComponent from 'ui/components/FilterComponent';
import { useTranslation } from 'react-i18next';
import { getPropsFromUrl, setPropsInUrl, UrlProps } from 'util/BookmarkableUtils';
import { withRouter, RouteComponentProps } from 'react-router';

interface StateProps {
  personList: Person[];
}

type DataTableUrlProps = UrlProps<"page" | "itemsPerPage" | "filter" | "sortBy" | "asc"> 

const mapStateToProps = (state: AppState): StateProps => ({
  personList: personSelectors.getPersonList(state)
}); 

export type Props = StateProps & RouteComponentProps;

export const PeoplePage: React.FC<Props> = (props) => {
  const { personList } = props;
  const { t } = useTranslation("PeoplePage");

  const urlProps = getPropsFromUrl<DataTableUrlProps>(props, {
    page: "1",
    itemsPerPage: "10",
    filter: null,
    sortBy: null,
    asc: "true"
  });
  
  const filterText = urlProps.filter || "";
  const page = parseInt(urlProps.page as string);
  const itemsPerPage = parseInt(urlProps.itemsPerPage as string)
  const filter = stringFilter((person: Person) => person.name)(filterText);
  const filteredRows = new Stream(personList)
    .filter(filter);
    
  const numOfFilteredRows = filteredRows.collect(c => c.length);
  
  const rowsInPage = filteredRows
    .page(page, itemsPerPage)
    .collect(c => c);

  return (
    <>      
      <Level
        gutter="sm"
        style={{
          padding: "5px 5px 5px 5px",
          backgroundColor: "var(--pf-global--BackgroundColor--200)"
        }}
      >
        <LevelItem>
          <FilterComponent
            aria-label="Filter by Name"
            filterText={urlProps.filter || ""}
            onChange={newFilterText => setPropsInUrl<DataTableUrlProps>(props, { page: "1", filter: newFilterText })}
          />
        </LevelItem>
        <LevelItem style={{ display: "flex" }}>
          <Button
            aria-label="Add Tenant"
            data-cy="add-tenant"
            onClick={() => props.history.push("/person/new")}
          >
            {t("add")}
          </Button>
          <Pagination
            aria-label="Change Page"
            itemCount={numOfFilteredRows}
            perPage={itemsPerPage}
            page={page}
            onSetPage={(e, newPage) =>  setPropsInUrl<DataTableUrlProps>(props, { page: String(newPage) })}
            widgetId="pagination-options-menu-top"
            onPerPageSelect={(e, newItemsPerPage) => setPropsInUrl<DataTableUrlProps>(props, { 
              itemsPerPage: String(newItemsPerPage) 
            })}
          />
        </LevelItem>
      </Level>
      <DataList aria-label="People">
        { rowsInPage.map(person => (
            <DataListItem aria-labelledby={person.name}>
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key="Name">
                      {person.name}
                    </DataListCell>,
                  ]}
                />
                <DataListAction
                  id={person.name + "-actions"}
                  aria-labelledby="Actions"
                  aria-label="Actions"
                >
                  <Button
                    onClick={() => {
                    }}
                    variant="primary"
                    key="delete-action"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                    }}
                    variant="primary"
                    key="edit-action"
                  >
                    Delete
                  </Button>
                </DataListAction>
              </DataListItemRow>
            </DataListItem>	
          ))
        }
      </DataList>
    </>
  );
}

export default connect(mapStateToProps)(withRouter(PeoplePage));