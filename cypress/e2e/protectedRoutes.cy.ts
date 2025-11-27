import {AUTH0_USERNAME,AUTH0_PASSWORD, AUTH0_DOMAIN} from "../../src/utils/constants";

describe('Protected routes test', () => {
  it('should redirect to Auth0 when accessing a protected route unauthenticated', () => {
    // Visit the protected route - it will automatically redirect to Auth0
    cy.visit('/');

    // After redirect to Auth0, verify we're on Auth0 login page using cy.origin
    cy.origin(AUTH0_DOMAIN, () => {
      cy.url({ timeout: 10000 }).should('include', '/u/login');
    });
  });

  it('should display login content on Auth0', () => {
    // Visit the protected route to trigger Auth0 redirect
    cy.visit('/');
    
    // Wait for redirect to Auth0
    cy.wait(2000);

    // Use cy.origin to interact with Auth0 domain
    cy.origin(AUTH0_DOMAIN, { args: {} }, () => {
      // Look for text that appears on Auth0 login page
      cy.contains('Email address', { timeout: 10000 }).should('exist');
      cy.contains('Password', { timeout: 10000 }).should('exist');
    });
  });

  it('should not redirect to Auth0 when the user is already authenticated', () => {
    cy.loginToAuth0(
        AUTH0_USERNAME,
        AUTH0_PASSWORD
    )

    cy.visit('/');

    cy.wait(1000)

    // Check that we're still on localhost (not redirected to Auth0)
    cy.url().should('equal', 'http://localhost/');
    cy.url().should('not.include', AUTH0_DOMAIN.replace('https://', ''));
  });

})
