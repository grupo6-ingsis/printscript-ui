import {AUTH0_PASSWORD, AUTH0_USERNAME} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {
    cy.loginToAuth0(
        AUTH0_USERNAME,
        AUTH0_PASSWORD
    );
    // Intercepta el GET paginado real
    cy.intercept('GET', '**/service/snippets/paginated*').as('getSnippetsPaginated');
    cy.visit("/");
    cy.wait('@getSnippetsPaginated');
    cy.wait(2000);
    // Click en la primera fila de la tabla de snippets
    cy.get('.MuiTableBody-root > tr').first().click();
    // Espera extra para que cargue el detalle del snippet
    cy.wait(4000);
  });

  it('Can share a snippet ', () => {
    // Click en el botón de compartir (Share)
    cy.get('[data-testid="ShareIcon"]').click({ force: true });
    // Escribe en el autocomplete para buscar usuarios
    cy.get('.MuiAutocomplete-root input').type('a', { force: true }); // escribe una letra para que aparezcan opciones
    // Espera y selecciona la primera opción del dropdown de MUI
    cy.get('.MuiAutocomplete-popper li').first().click({ force: true });
    // Click en el botón de confirmar compartir (por texto)
    cy.contains('button', 'Share').click({ force: true });
    cy.wait(2000);
  });

  it('Can run snippets', function() {
    // Click en el botón de ejecutar (Interpretar sin inputs)
    cy.contains('button', 'Interpretar sin inputs').click({ force: true });
    cy.wait(2000);
  });

  it('Can format snippets', function() {
    // Click en el botón de formatear (Format)
    cy.get('[data-testid="ReadMoreIcon"]').click({ force: true });
    cy.wait(2000);
  });

  it('Can save snippets', function() {
    // Click en el editor de código
    cy.get('.npm__react-simple-code-editor__textarea').first().click();
    cy.get('.npm__react-simple-code-editor__textarea').first().type('\nprintln(2);', { force: true });
    // Intercepta la request PUT a la URL hardcodeada
    cy.intercept('PUT', '**/service/snippets/*').as('saveSnippet');
    // Click en el botón de guardar
    cy.get('[data-testid="SaveIconUpdate"]').click({ force: true });
    // Espera la request y valida el status
    cy.wait('@saveSnippet').its('response.statusCode').should('eq', 200);
  });

  it('Can delete snippets', function() {
    // Click en el icono de borrar
    cy.get('[data-testid="DeleteIcon"]').click({ force: true });
    // Click en el botón de confirmación de borrado (por texto, ya que no tiene data-testid)
    cy.contains('button', 'Delete').click({ force: true });
  });
})
