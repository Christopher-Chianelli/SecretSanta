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
 
import React, { FC, PropsWithChildren } from 'react';
import { Modal, Button, ButtonVariant } from "@patternfly/react-core";
import { useTranslation } from 'react-i18next';

export interface ConfirmDialogProps {
  title: string;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: FC<PropsWithChildren<ConfirmDialogProps>> = (props) => {
  const { t } = useTranslation("ConfirmDialog");
  return (
    <Modal
      title={props.title}
      onClose={props.onClose}
      isOpen={props.isOpen}
      actions={
        [(
          <Button 
            aria-label="Close Modal"
            variant={ButtonVariant.tertiary}
            key={0}
            onClick={props.onClose}
          >
            {t("close")}
          </Button>
        ),
        (
          <Button
            aria-label={t("confirm")}
            data-cy="confirm"
            key={2}
            onClick={() => {props.onClose(); props.onConfirm();}}
          >
            {t("confirm")}
          </Button>
        )
        ]
      }
      isSmall
    >
      {props.children}
    </Modal>
  );
};