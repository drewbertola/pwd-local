# PwdLocal

This project is a browser based password vault that uses 256 bit AES-GCM for encryption.  You can protect your passwords using a secret key (master password or passphrase) and that can optionally be combined with a key file for even stronger protection. Don't lose your secret key (or key file), otherwise your password vault will be unrecoverable.

PwdLocal is a variant of [PwdDb](https://github.com/drewbertola/pwd-ng) which stores encrypted data on a remote server, thus your password vault on your desktop would stay in sync with the same vault runnint on your phone.  Unlike PwdDb, PwdLocal stores data in device storage (IndexedDb), so to keep the same version of your vault on more than one device, it needs to be sync'ed manually.




This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```
