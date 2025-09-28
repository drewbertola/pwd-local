describe('Restore Database, Save, and Backup', () => {
    it('Prepares Session and Local Db ', () => {
        cy.clearDb();
    });
    it('Restore a DB', () => {
        cy.visit('/');
        cy.get('a#settings-link').click();
        cy.contains('a', 'Restore DB');
        cy.get('a#restore-db-link').click();
        cy.get('input#backupFile').selectFile('./cypress/support/restore-db.bak');
        cy.get('input#pwdDbCalled').type('Cypress Restored Db');
        cy.get('input#secretKey').type('abcd1234');
        cy.get('button#restore-db-submit').click();
        cy.contains('h1', 'Open a Pwd Database');
        cy.get('input#database-label').type('cypress');
        cy.get('li#db-item-0').click();
        cy.get('input#secretKey').type('abcd1234');
        cy.get('button#open-db-submit').click();
        cy.get('app-entry-card').its('length').should('eq', 1);
    });
});
