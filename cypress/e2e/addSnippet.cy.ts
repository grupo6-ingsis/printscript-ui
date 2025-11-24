import {AUTH0_USERNAME, BACKEND_URL} from "../../src/utils/constants";

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
    cy.intercept('POST', BACKEND_URL+"/snippets", (req) => {
      req.reply((res) => {
        expect(res.body).to.include.keys("id","name","content","language")
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
      cy.contains('button', 'Add Snippet').click();
      cy.contains('Create snippet').click();
    cy.get('#name').type('Some snippet name');
    cy.get('#demo-simple-select').click()
    cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(`const snippet: String = "some snippet" \n print(snippet)`);
    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })

  it('Can add snippets via file', () => {
    cy.visit("/")
    cy.intercept('POST', BACKEND_URL+"/snippets", (req) => {
      req.reply((res) => {
        expect(res.body).to.include.keys("id","name","content","language")
        expect(res.statusCode).to.eq(200);
      });
    }).as('postRequest');

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-testid="upload-file-input"').selectFile("cypress/fixtures/example_ps.ps", {force: true})

    // Wait for modal to open and SaveIcon to be available
    cy.get('[data-testid="SaveIcon"]', {timeout: 10000}).should('be.visible').click();

    cy.wait('@postRequest').its('response.statusCode').should('eq', 200);
  })
})
