export interface FilterField {
  domainName: string;
  conventionName: string;
  operator: string;
}

export interface FilterConfig {
  [key: string]: Array<FilterField>;
}
