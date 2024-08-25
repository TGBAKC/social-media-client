/// <reference types="cypress" />

Cypress.on("uncaught:exception", (err, runnable) => {
  // Cypress'in testi hataya düşürmesini engeller
  return false;
});

describe("login form", () => {
  beforeEach(() => {
    cy.fixture("credentials.json").as("credentials");
    cy.visitPage();
    cy.wait(1000);  // İsteğe bağlı olarak bekleme süresi
  });

  it("should not submit the login form when provided with invalid credentials and user is shown a message", () => {
    cy.intercept(
      "POST",
      "https://nf-api.onrender.com/api/v1/social/auth/login",
      { statusCode: 401, body: { message: "Invalid email or password" } }
    ).as("failedLogin");

    // Login butonuna tıklayın ve modalın açılmasını bekleyin
    cy.get('[data-cy="login-btn"]').click();
    cy.get('#loginModal').should('be.visible');  // Modalın görünür olduğunu doğrula

    // Formu doldurun ve giriş butonuna tıklayın
    cy.get(`[data-cy="loginFormBtn"]`).should('be.visible').click();
    cy.get("@credentials").then((user) => {
      cy.get(`[data-cy="emailInput"]`).type(`${user.invalidEmail}`);
      cy.get(`[data-cy="passwordInput"]`).type(`${user.password}{enter}`);
    });

    // Yanıtı bekleyin ve doğrulayın
    cy.wait("@failedLogin", { timeout: 10000 });

    // Uyarı mesajı gösteriliyor mu kontrol et
    cy.on("window:alert", (alertText) => {
      expect(alertText).to.contains("Invalid email or password");
    });

    // Kullanıcının giriş yapmadığını ve ana sayfada kaldığını doğrulayın
    cy.location("pathname").should("eq", "/");
  });
});
