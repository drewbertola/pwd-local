import { Injectable } from "@angular/core";
import Localbase from 'localbase'
import { PwdDb } from "../models/PwdDb.data";
import { Completion } from "../models/Completion.data";
import { PwdDbKeyed } from "../models/PwdDbKeyed.data";

@Injectable({
    providedIn: 'root'
})
export class LocalDbService {
    private db;

    constructor() {
        this.db = new Localbase('db');
        this.db.config.debug = false;
    }

    getCompletions(): Promise<Completion[]> {
        return new Promise((resolve, reject) => {
            this.db.collection('pwdDbs').get({ keys: true }).then((data: PwdDbKeyed[]) => {
                let completions: Completion[] = [];

                for (const pwdDb of data) {
                    completions.push({
                        value: pwdDb.key,
                        label: pwdDb.data.name,
                    });
                }

                const sorted = completions.sort((a, b) => {
                    if (a < b) return 1;
                    if (a > b) return -1;
                    return 0;
                })

                resolve(sorted);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    // get all local entries (w/o keys)
    getAll(): Promise<PwdDb[]> {
        return new Promise((resolve, reject) => {
            this.db.collection('pwdDbs').get().then((data: PwdDb[]) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    // get all local entries with keys
    getAllKeyed(): Promise<PwdDbKeyed[]> {
        return new Promise((resolve, reject) => {
            this.db.collection('pwdDbs').get({ keys: true }).then((data: PwdDbKeyed[]) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    // get a local entry
    get(key: string): Promise<PwdDb> {
        return new Promise((resolve, reject) => {
            this.db.collection('pwdDbs').doc(key).get().then((data: PwdDb) => {
                resolve(data);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    // add locally, use current milliseconds as key
    insert(pwdDb: PwdDb): Promise<string> {
        const key: string = 'db-' + Date.now();
        return new Promise((resolve, reject) => {
            this.db.collection('pwdDbs').add(pwdDb, key).then(() => {
                resolve(key);
            }).catch((error: Error) => {
                reject(error);
            })
        });
    }

    // update an entry locally
    update(key: string, pwdDb: PwdDb): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.collection('pwdDbs').doc(key).update(pwdDb).then(() => {
                resolve(true);
            }).catch((error: Error) => {
                reject(error);
            })
        });
    };

    // delete an entry locally
    delete(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.collection('pwdDbs').doc(key).delete().then(() => {
                resolve(true);
            }).catch((error: Error) => {
                reject(error);
            })
        });
    }

    // forget all local entries
    destroy(): void {
        this.db.collection('pwdDbs').delete();
    }
}
