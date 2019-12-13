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

import {
  Button,
  ButtonVariant,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { BellIcon, CogIcon } from '@patternfly/react-icons';
import * as React from 'react';
import {
  withRouter, RouteComponentProps
} from 'react-router-dom'

export type Props = RouteComponentProps;

export class ToolbarComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {isTenantSelectOpen : false};
  }

  render() {
    const bellAndCog = (
      <ToolbarGroup>
        <ToolbarItem>
          <Button
            id="horizontal-example-uid-01"
            aria-label="Notifications actions"
            variant={ButtonVariant.plain}
          >
            <BellIcon />
          </Button>
        </ToolbarItem>
      </ToolbarGroup>
    );
      return (
        <Toolbar>
          {bellAndCog}
        </Toolbar>
      );
  }
}

export default withRouter(ToolbarComponent);
