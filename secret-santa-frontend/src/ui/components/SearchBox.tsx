
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

import '@patternfly/patternfly/patternfly.css';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import * as React from 'react';
import Location from 'domain/Location';
import { Select, SelectOption, SelectVariant } from "@patternfly/react-core";
import { stringFilter } from "util/CommonFilters";

export interface Props {
  searchDelay: number;
  boundingBox: [Location, Location] | null;
  countryCodeSearchFilter: string[];
  location: Location | null;
  onChange: (result: Location | null) => void;
}

export interface State {
  query: string;
  isExpanded: boolean;
  results: Location[];
  attributions: string[];
}

const searchParams = (props: Props) => ({
  countrycodes: props.countryCodeSearchFilter.reduce((p,c) => `${p}${c},`, ',').slice(0,-1),
  viewbox: props.boundingBox
    ? `${props.boundingBox[0].lng},${props.boundingBox[0].lat},${props.boundingBox[1].lng},${props.boundingBox[1].lat}`
    : undefined,
  bounded: (props.boundingBox? 1 : 0) as 1 | 0,
});

class SearchBox extends React.Component<Props, State> {
  static defaultProps: Pick<Props, 'searchDelay'> = {
    searchDelay: 500,
  };

  private searchProvider: OpenStreetMapProvider;

  private timeoutId: number | null;

  constructor(props: Props) {
    super(props);

    this.state = {
      query: '',
      results: [],
      attributions: [],
      isExpanded: false
    };

    this.searchProvider = new OpenStreetMapProvider(searchParams(props));
    this.timeoutId = null;

    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  UNSAFE__componentWillReceiveProps(nextProps: Readonly<Props>): void {
    this.searchProvider = new OpenStreetMapProvider(searchParams(nextProps));
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }

  handleTextInputChange(query: string): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    if (query.trim() !== '') {
      this.timeoutId = window.setTimeout(
        async () => {
          const searchResults = await this.searchProvider.search({ query });
          if (this.state.query !== query) {
            return;
          }
          this.setState({
            results: searchResults
              .map(result => ({
                address: result.label,
                lat: parseInt(result.y),
                lng: parseInt(result.x)
              }))
              .filter((location, index, array) => array.findIndex(v => v.address === location.address) === index),
            attributions: searchResults
              .map(result => result.raw.licence)
              // filter out duplicate elements
              .filter((value, index, array) => array.indexOf(value) === index),
          });
        },
        this.props.searchDelay,
      );
      this.setState({ query });
    } else {
      this.setState({ query, results: [], attributions: [] });
    }
  }

  handleClick(index: number) {
    this.props.onChange(this.state.results[index]);
    this.setState({
      query: '',
      results: [],
      attributions: [],
    });
    // TODO focus text input
  }

  onToggle(isExpanded: boolean) {
    this.setState({
      isExpanded
    });
  }

  clearSelection() {
    this.props.onChange(null);
    this.setState({
      isExpanded: false
    });
  }

  onSelect(event: any,
    selection: string) {
    const options = this.getOptions();
    const selectedOption = options.find(
      option => option? option.address === selection : false
    ) as Location;
    this.props.onChange(selectedOption);
    this.setState(() => ({
        isExpanded: false
    }));
  }

  getOptions(): (Location|null)[] {
    const { results } = this.state;
    return results? results : this.props.location? [this.props.location] : [null]
  }

  render() {
    const { attributions, query, results } = this.state;
    return (
        <Select
          variant={SelectVariant.typeahead}
          aria-label="Enter a Location..."
          onToggle={this.onToggle}
          onSelect={this.onSelect as any}
          onClear={this.clearSelection}
          onFilter={(e: React.ChangeEvent<HTMLInputElement>) => {
            const substringFilter = stringFilter((child: any) => child.props.value)(e.target.value);
            this.handleTextInputChange(e.target.value);
            const options = this.getOptions().map((location) => (
              <SelectOption
                isDisabled={false}
                key={location? location.address : "No Location is Specified"}
                value={location? location.address : "No Location is Specified"}
              />
            ));
            const typeaheadFilteredChildren =
              e.target.value !== ''
                ? options.filter(substringFilter)
                : options;
            return typeaheadFilteredChildren;
          }}
          selections={this.props.location? this.props.location.address : undefined}
          isExpanded={this.state.isExpanded}
          placeholderText={"Enter a Location..."}
        >
          {this.getOptions().map((location) => (
            <SelectOption
              isDisabled={false}
              key={location? location.address : "No Location is Specified"}
              value={location? location.address : "No Location is Specified"}
            />
          )).concat(attributions.map(attribution => (
            <SelectOption
              isDisabled
              key={`attrib: ${attribution}`}
              value={attribution}
            />
          )))}
        </Select>
    );
  }
}

export default SearchBox;