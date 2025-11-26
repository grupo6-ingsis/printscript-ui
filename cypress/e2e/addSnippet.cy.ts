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
      // Wait for language versions to load and be selected
      cy.get('#version-select', { timeout: 10000 }).should('be.visible');
      // Wait for button to be enabled and visible, then click
      cy.get('[data-testid="SaveIcon"]')
          .click();
      cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })

  it('Can add snippets via file', () => {
    cy.visit("/")
    
    // Wait for file types to be loaded before attempting to upload
    cy.intercept('GET', '**/service/language/supported').as('getFileTypes');
    cy.wait('@getFileTypes', { timeout: 10000 });
    
    cy.intercept('POST', '**/service/snippets', (req) => {
      req.reply((res) => {
          expect(res.body).to.include.keys("id");
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
      cy.contains('button', 'Add Snippet').click();
      cy.contains('li', 'Load snippet from file')
          .should('be.visible')
          .click();
      
      // Wait a bit to ensure file types are available in the component state
      cy.wait(500);
      
      cy.get('[data-testid="upload-file-input"]')
          .selectFile('cypress/fixtures/example.ps', { force: true });
      // Wait for the modal to open and populate with file data
      cy.get('#name', { timeout: 10000 }).should('have.value', 'example');
      
      // Wait for language to be selected (it should be auto-detected from file extension)
      cy.get('#demo-simple-select', { timeout: 10000 }).should('not.have.value', '');
      
      // Wait for content to be loaded in editor
      cy.get('[data-testid="add-snippet-code-editor"]', { timeout: 10000 })
          .should('not.be.empty');
      
      // Wait for language versions to load and be selected automatically
      cy.get('#version-select', { timeout: 10000 })
          .should('be.visible')
          .should('not.have.value', '');
      
      cy.get('#description').type('This is a test description');
      
      // Wait for button to be enabled (not disabled) before clicking
      cy.get('[data-testid="SaveIcon"]', { timeout: 10000 })
          .should('not.be.disabled')
          .should('be.visible')
          .click();
      cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })
})
