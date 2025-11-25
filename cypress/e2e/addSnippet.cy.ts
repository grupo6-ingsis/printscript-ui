import {AUTH0_USERNAME} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {
    cy.log("Logging in with user: " + AUTH0_USERNAME);
    const username = "pit@mail.com";
    const password = "Boca123!";
    cy.loginToAuth0(
        username,
        password
    )
  })
  it('Can add snippets manually', () => {
    cy.visit("/")
      cy.intercept('POST', '**/service/snippets', (req) => {
          req.reply((res) => {
              expect(res.statusCode).to.eq(200);
              expect(res.body).to.include.keys("id", "title", "description", "languageVersion");
          });
      }).as('postRequest');


      /* ==== Generated with Cypress Studio ==== */
      cy.contains('button', 'Add Snippet').click();
      cy.contains('Create snippet').click();
    cy.get('#name').type('Some snippet name');
      cy.get('#demo-simple-select').click();
      cy.get('li[data-testid^="language-option-"]', { timeout: 8000 })
          .should('be.visible')
          .first()
          .click();
      cy.get('#description').type('This is a test description');
      cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(`let snippet: String = "some snippet"; \nprintln(snippet);`);
      cy.contains('button', 'Save Snippet').should('be.visible').should('not.be.disabled').click();
      cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })

  it('Can add snippets via file', () => {
    cy.visit("/")
    cy.intercept('POST', '**/service/snippets', (req) => {
      req.reply((res) => {
          expect(res.body).to.include.keys();
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
      cy.contains('button', 'Add Snippet').click();
      cy.contains('li', 'Load snippet from file')
          .should('be.visible')
          .click();
      cy.get('[data-testid="upload-file-input"]')
          .selectFile('cypress/fixtures/example.ps', { force: true });
      // Wait for the modal to populate with file data
      cy.get('#name').should('have.value', 'example');
      cy.get('#description').type('This is a test description');
      // Wait for button to be enabled before clicking
      cy.contains('button', 'Save Snippet').should('be.visible').should('not.be.disabled').click({ force: true });
      cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })
})
