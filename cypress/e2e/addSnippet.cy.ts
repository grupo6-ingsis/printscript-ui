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
      cy.get('#demo-simple-select').click({ force: true });
      cy.get('.MuiPopover-root ul[role="listbox"]', { timeout: 8000 })
          .should('be.visible')
          .click();
      cy.get('#description').type('This is a test description');
      cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(`let snippet: String = "some snippet"; \nprintln(snippet);`);
      cy.contains('button', 'Save Snippet').click({ force: true });
      cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })

  it('Can add snippets via file', () => {
    cy.visit("/")
    cy.intercept('POST', '**/service/snippets', (req) => {
      req.reply((res) => {
          expect(res.body).to.include.keys("id", "title", "description", "languageVersion");
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
      cy.contains('button', 'Add Snippet').click();
      cy.contains('li', 'Load snippet from file')
          .should('be.visible')
          .click();
      cy.get('[data-testid="upload-file-input"]')
          .selectFile('cypress/fixtures/test-snippet.ts', { force: true });
      cy.contains('button', 'Save Snippet').click({ force: true });
      cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })
})
