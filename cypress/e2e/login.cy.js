/// <reference types="cypress" />

describe("login form", () => {
    beforeEach(() => {
      cy.fixture("credentials.json").as("credentials");
      cy.visitPage();
    });
  
    it("should log in with valid credentials", () => {
      cy.interceptSuccess().as("loginReq");
      cy.get(`[data-cy="loginFormBtn"]`).click();
      cy.wait(500);
      cy.get(`[data-cy="emailInput"]`).click();
      cy.getCredentials();
      cy.wait("@loginReq");
      cy.window().its("localStorage.token").should("exist");
      cy.window().its("localStorage.profile").should("exist");
      cy.logoutFn();
      cy.wait(500);
      cy.get(`[data-cy="loginFormBtn"]`).click();
      cy.wait(500);
      cy.get(`[data-cy="emailInput"]`).click();
      cy.get("@credentials").then((user) => {
        cy.get(`[data-cy="emailInput"]`).type(`${user.email}`);
        cy.get(`[data-cy="passwordInput"]`).click();
        cy.get(`[data-cy="passwordInput"]`).type(`${user.password}`);
      });
      cy.get(`[data-cy="login-btn"]`).click();
      cy.wait("@loginReq");
      cy.window().its("localStorage.token").should("exist");
      cy.window().its("localStorage.profile").should("exist");
    });
  
    it("should not submit the login form when provided with invalid credentials and user is shown a message", () => {
      cy.intercept(
        "POST",
        "https://nf-api.onrender.com/api/v1/social/auth/login",
        { statusCode: 401, body: { message: "Invalid email or password" } },
      ).as("failedLogin");
      cy.get(`[data-cy="loginFormBtn"]`).click();
      cy.wait(500);
      cy.get(`[data-cy="emailInput"]`).click();
      cy.get("@credentials").then((user) => {
        cy.get(`[data-cy="emailInput"]`).type(`${user.invalidEmail}`);
        cy.get(`[data-cy="passwordInput"]`).click();
        cy.get(`[data-cy="passwordInput"]`).type(`${user.password}{enter}`);
      });
      cy.wait('@failedLogin', { timeout: 10000 });

      cy.on("window:alert", () => {
        expect(true).to.be.true;
      });
      cy.location("pathname").should("eq", "/");
    });
  });