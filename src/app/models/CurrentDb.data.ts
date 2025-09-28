import { PwdDbEntry } from "./PwdDbEntry.data";
import { Completion } from "./Completion.data";

// this is what we store in our session
export interface CurrentDb {
    key: string,
    name: string,
    password: string,
    pwdEntries: PwdDbEntry[],
    categories: Completion[],
    isDirty: boolean,
}

