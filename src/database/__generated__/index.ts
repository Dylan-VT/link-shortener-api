/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: yQvVNCr41bFCSYTz48wwHl9EgvqFwcD9WBzbnWEaWLZTo2wCQXoyvgMOusp0CfxgTWWYOwpu/kcHxpOmQ1SBvg==
 */

/* eslint-disable */
// tslint:disable

import Links, {Links_InsertParameters} from './links'

interface DatabaseSchema {
  links: {record: Links, insert: Links_InsertParameters};
}
export default DatabaseSchema;

function serializeValue(_tableName: string, _columnName: string, value: unknown): unknown {
  return value;
}
export {serializeValue}

export type {
  Links,
  Links_InsertParameters,
}