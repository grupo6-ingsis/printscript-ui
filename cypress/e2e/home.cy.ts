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
        cy.contains('Add Snippet').should('be.visible');

        // Click en menú (si corresponde)
        cy.get('.css-jie5ja').click();
    });

    it('Renders the first snippets', () => {
        cy.visit("http://localhost");

        const first20Snippets = cy.get('[data-testid="snippet-row"]');

        first20Snippets.should('have.length.greaterThan', 0);
        first20Snippets.should('have.length.lessThan', 20);
    });

    it('Can create snippet and find it by name', () => {
        cy.visit("http://localhost");

        // Intercept de búsqueda
        cy.intercept('GET', '**/service/snippets*').as('getSnippets');
        
        // First, get supported languages and versions from the backend
        cy.window().its('localStorage').invoke('getItem', 'authAccessToken').then((token) => {
            const normalizedBackendUrl = "https://snippet-searcher-app-dev.duckdns.org/service";
            
            // Get supported languages
            cy.request({
                method: 'GET',
                url: `${normalizedBackendUrl}/language/supported`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((langResponse) => {
                // Use the first available language
                const availableLanguage = langResponse.body[0];
                const languageName = availableLanguage.language;
                
                // Get versions for this language
                cy.request({
                    method: 'GET',
                    url: `${normalizedBackendUrl}/language-version/supported?languageName=${languageName}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then((versionResponse) => {
                    // Use the first available version
                    const version = versionResponse.body.versions[0];
                    
                    const snippetData: CreateSnippet = {
                        name: "Test name",
                        content: "println(1);",
                        language: languageName,
                        extension: availableLanguage.extension,
                        version: version,
                        description: "hola"
                    };
                    
                    const requestBody = {
                        title: snippetData.name,
                        description: snippetData.description,
                        language: snippetData.language,
                        content: snippetData.content,
                        version: snippetData.version
                    };
                    
                    // Create the snippet
                    cy.request({
                        method: 'POST',
                        url: `${normalizedBackendUrl}/snippets`,
                        body: requestBody,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        failOnStatusCode: false
                    }).then((response) => {
                        expect(response.status).to.eq(200);

                        expect(response.body.title).to.eq(snippetData.name);
                        expect(response.body.languageVersion.language.name).to.eq(snippetData.language);
                        expect(response.body).to.have.property("id");

                        // Buscar snippet por nombre
                        cy.get('input[type="text"]')
                            .clear()
                            .type(snippetData.name + "{enter}");
                    });
                });
            });
        });
    });

});
