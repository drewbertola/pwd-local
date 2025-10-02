import Localbase from 'localbase';

Cypress.Commands.add('clearDb', () => {
    const db = new Localbase('db');
    db.collection('pwdDbs').delete().then(() => {
        return;
    });
})

Cypress.Commands.add('openDb', () => {
    cy.get('input#database-label').type('cypress');
    cy.get('li#db-item-0').click();
    cy.get('input#secretKey').type('abcd1234');
    cy.get('button#open-db-submit').click();
});

Cypress.Commands.add('openDbWithFile', () => {
    cy.get('input#database-label').clear().type('cypress');
    cy.get('li#db-item-0').click();
    cy.get('input#secretKey').clear().type('1234abcd');
    cy.get('button#open-db-submit').click();
    cy.get('input#useKF').check();
    cy.get('input#keyFile').selectFile('./cypress/support/test_file.txt');
    cy.get('button#open-db-submit').click();
});

declare global {
    namespace Cypress {
        interface Chainable {
            clearDb(): Chainable<void>,
            openDb(): Chainable<void>,
            openDbWithFile(): Chainable<void>,
        }
    }
}

// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
