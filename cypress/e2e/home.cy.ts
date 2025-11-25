import { CreateSnippet } from "../../src/utils/snippet";

describe('Home', () => {

    beforeEach(() => {
        cy.loginToAuth0("pit@mail.com", "Boca123!");
    });

    before(() => {
        process.env.FRONTEND_URL = Cypress.env("FRONTEND_URL");
        process.env.BACKEND_URL = Cypress.env("BACKEND_URL");
        process.env.AUTH0_USERNAME = Cypress.env("AUTH0_USERNAME");
        process.env.AUTH0_PASSWORD = Cypress.env("AUTH0_PASSWORD");
    });

    it('Renders home', () => {
        cy.visit("http://localhost");

        // Header visible
        cy.contains('Printscript').should('be.visible');

        // Search input visible (selector estable)
        cy.get('[data-testid="search-snippet-input"]', { timeout: 6000 })
            .should('be.visible');

        // Botón visible
        cy.get('.css-9jay18 > .MuiButton-root')
            .should('be.visible');

        // Click en menú (si corresponde)
        cy.get('.css-jie5ja').click();
    });

    it('Renders the first snippets', () => {
        cy.visit("http://localhost");

        const first10Snippets = cy.get('[data-testid="snippet-row"]');

        first10Snippets.should('have.length.greaterThan', 0);
        first10Snippets.should('have.length.lessThan', 10);
    });

    it('Can create snippet and find it by name', () => {
        cy.visit("http://localhost");

        const snippetData: CreateSnippet = {
            name: "Test name",
            content: "println(1);",
            language: "printscript",
            extension: ".ps",
            version: "1.0",
            description: "hola"
        };

        // Intercept de búsqueda
        cy.intercept('GET', '**/service/snippets*').as('getSnippets');

        // IMPORTANTE: cy.request requiere URL absoluta
        cy.request({
            method: 'POST',
            url: `${Cypress.env("BACKEND_URL")}/service/snippets`,
            body: snippetData,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body.title).to.eq(snippetData.name);
            expect(response.body.content).to.eq(snippetData.content);
            expect(response.body.languageVersion.language).to.eq(snippetData.language);
            expect(response.body).to.have.property("id");

            // Buscar snippet por nombre
            cy.get('input[type="text"]')
                .clear()
                .type(snippetData.name + "{enter}");

            cy.wait("@getSnippets");

            cy.contains(snippetData.name).should('exist');
        });
    });

});
