/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: b/TLuUqINIFHqNy8IjyoDRnRWz0aLEEYWGrkKpsOD9BpvZBHYkgRLfaCU/Dkv99DG9lgo1yJ7TDgyXBbJHtHtQ==
 */

/* eslint-disable */
// tslint:disable

interface Users {
  email: string
  password: string
  /**
   * @default nextval('users_user_id_seq'::regclass)
   */
  user_id: number & {readonly __brand?: 'users_user_id'}
  username: string
}
export default Users;

interface Users_InsertParameters {
  email: string
  password: string
  /**
   * @default nextval('users_user_id_seq'::regclass)
   */
  user_id?: number & {readonly __brand?: 'users_user_id'}
  username: string
}
export type {Users_InsertParameters}
