import {AUTH0_DOMAIN} from "../../../src/utils/constants";

export function loginViaAuth0Ui(username: string, password: string) {
    // App landing page redirects to Auth0.
    cy.visit('/')

    // Login on Auth0.
    process.env.AUTH0_DOMAIN = Cypress.env("AUTH0_DOMAIN");
    cy.origin(
        AUTH0_DOMAIN,
        { args: { username, password } },
        ({ username, password }) => {
            cy.get('input#username').type(username)
            cy.get('input#password').type(password, { log: false })
            cy.contains('button[value=default]', 'Continue').click()
        }
    )

    // Ensure Auth0 has redirected us back to the RWA.
    cy.url().should('equal', 'http://localhost')
    
    // Wait for the token to be saved in localStorage
    cy.window().its('localStorage').invoke('getItem', 'authAccessToken').should('exist')
}




