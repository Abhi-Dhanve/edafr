import * as user from "./user";
import * as session from "./session";

const schema = {
  ...user,
  ...session,
};

export default schema;

export type DBSchema = typeof schema;
export type DB = {
  [K in keyof DBSchema as K extends `${infer Base}s`
    ? Base
    : K]: DBSchema[K]["$inferSelect"];
};
