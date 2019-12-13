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

import { RouteComponentProps } from "react-router";

export type UrlProps<T extends string> = { [K in T]: string|null };

const pathnameToQueryStringMap: Map<string, string> = new Map();

export function setTenantIdInUrl(props: RouteComponentProps, tenantId: number) {
  const endOfTenantId = props.location.pathname.indexOf('/', 1);
  if (endOfTenantId !== -1) {
    props.history.push(`/${tenantId}${props.location.pathname
      .slice(props.location.pathname.indexOf('/', 1))}`);
  }
  // Else, the page is not specific to a tenant, so we do nothing
}

export function getPropsFromUrl<T extends UrlProps<string> >(props: RouteComponentProps, defaultValues: T): T {
  const out: { [index: string]: string|null }  = { ...defaultValues };
  if (props.location.search === "" && pathnameToQueryStringMap.has(props.location.pathname)) {
    const searchParams = new URLSearchParams(pathnameToQueryStringMap.get(props.location.pathname));
    searchParams.forEach((value, key) => out[key] = value);
    // defer updating URL since that counts as an update operation and 
    // you cannot update in render
    setTimeout(() => requestAnimationFrame(() => setPropsInUrl(props, out as T)));
  }
  else {
    const searchParams = new URLSearchParams(props.location.search);
    searchParams.forEach((value, key) => out[key] = value);
  }
  return out as T;
}

export function setPropsInUrl<T extends UrlProps<string> >(props: RouteComponentProps, urlProps: Partial<T>) {
  const searchParams = new URLSearchParams(props.location.search);
  
  Object.keys(urlProps).forEach(key => {
    const value = urlProps[key] as string|null|undefined;
    if (value !== undefined) {
      if (value !== null && value.length > 0) {
        searchParams.set(key, value);
      }
      else {
        searchParams.delete(key);
      }
    }
  });
  pathnameToQueryStringMap.set(props.location.pathname, `?${searchParams.toString()}`);
  props.history.push(`${props.location.pathname}?${searchParams.toString()}`);
}