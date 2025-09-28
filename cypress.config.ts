import { defineConfig } from 'cypress'

export default defineConfig({

    'video': true,

    e2e: {
        'supportFile': 'cypress/support/commands.ts',
        'baseUrl': 'http://localhost:4200',
    },


    component: {
        devServer: {
            framework: 'angular',
            bundler: 'webpack',
        },
        specPattern: '**/*.cy.ts'
    }

})