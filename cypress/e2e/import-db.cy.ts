describe('Import Database, Save, and Backup', () => {
    it('Prepares Session and Local Db ', () => {
        cy.clearDb();
    });
    it('Import a DB', () => {
        cy.visit('/');
        cy.get('a#settings-link').click();
        cy.contains('a', 'Import DB');
        cy.get('a#import-db-link').click();
        cy.get('input#jsonFile').selectFile('./cypress/support/import-db.json');
        cy.get('input#pwdDbCalled').type('Cypress Imported Db');
        cy.get('input#secretKey').type('foobar1234');
        cy.get('button#import-db-submit').click();
        cy.contains('h1', 'Open a Pwd Database');
        cy.get('input#database-label').type('cypress');
        cy.get('li#db-item-0').click();
        cy.get('input#secretKey').type('foobar1234');
        cy.get('button#open-db-submit').click();
        cy.get('app-entry-card').its('length').should('eq', 1);
    });
});
