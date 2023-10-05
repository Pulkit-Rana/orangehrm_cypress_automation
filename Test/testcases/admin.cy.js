import { LoginPage } from "../support/pageobject/loginpage"

const loginPage = new LoginPage()

describe("Automating Admin Tab", () => {
  beforeEach(() => {
    cy.login()
    cy.fixture("/adminpage.json").as("admindata")
  })

  afterEach(() => {
    cy.logout()
  })

  it("Validating that user can navigate to the Admin Tab and see the details of the page", () => {
    navigateToAdminTab()
    cy.get(".oxd-topbar-body-nav").should("be.visible")
    cy.get(".oxd-table-filter").should("be.visible")
    cy.get(".oxd-button--secondary").find("i").should("be.visible")
    cy.get(".orangehrm-container").should("be.visible")
  })

  // Investigate the passing of includes
  it("Validating the headers on the admin page.", () => {
    navigateToAdminTab()
    cy.get(".oxd-table-header")
      .find(".oxd-table-th")
      .then($headers => {
        expect($headers.text())
          .includes("Username")
          .and.includes("User Role")
          .and.includes("Employee Name")
          .and.includes("Status")
          .and.includes("Actions")
      })
  })

  // check the eslint flaky ness smelltu
  it("Validating the search functionality of tyhe page", () => {
    cy.get("@admindata").then(adminpage => {
      navigateToAdminTab()
      cy.get(".oxd-form-row")
        .find(".oxd-input.oxd-input--active")
        .type(adminpage.searchUsername, { force: true })
      cy.get(".oxd-select-text--arrow")
        .first()
        .click({ force: true })
        .then(() => {
          cy.get(".oxd-select-dropdown.--positon-bottom").should("be.visible")
          cy.get(".oxd-select-option span")
            .contains(adminpage.searchUsername)
            .click({ force: true })
        })
    })
  })

  it("Validating that user can navigate to the Admin Tab and see the details of the page", () => {
    navigateToAdminTab()
  })

  it("Validating that user can navigate to the Admin Tab and see the details of the page", () => {
    navigateToAdminTab()
  })
})

function navigateToAdminTab() {
  loginPage.getSideMenu().contains("Admin").click({ force: true })
  loginPage.getSideMenu().contains("Admin").should("have.class", "oxd-main-menu-item active")
}
