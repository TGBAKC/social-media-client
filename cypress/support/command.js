// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("interceptSuccess", () => {
    cy.intercept("POST", "https://nf-api.onrender.com/api/v1/social/auth/login", {
      statusCode: 200,
      body: {
        name: "testcypress",
        email: "testcypress@stud.noroff.no",
        banner: null,
        avatar: "",
        accessToken: "fake-token",
      },
    }).as("loginReq");
  });
  
  Cypress.Commands.add("visitPage", () => {
    cy.visit("/");
    cy.wait(500);
  });
  
  Cypress.Commands.add("logoutFn", () => {
    cy.get(`[data-cy="logoutBtn"]`).click({ force: true });
    cy.location("pathname").should("eq", "/");
  });
  
  Cypress.Commands.add("getCredentials", () => {
    cy.get("@credentials").then((user) => {
      cy.get(`[data-cy="emailInput"]`).type(`${user.email}`);
      cy.get(`[data-cy="passwordInput"]`).click();
      cy.get(`[data-cy="passwordInput"]`).type(`${user.password}{enter}`);
    });
  });