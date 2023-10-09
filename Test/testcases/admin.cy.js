/// <reference types="Cypress" />
import { LoginPage } from "../support/pageobject/loginpage"

const loginPage = new LoginPage()

describe("Automating Admin Tab", () => {
  beforeEach(() => {
    cy.login()
    cy.fixture("/adminpage.json").as("admindata")
    //adminpage.json = admindata;
  })

  afterEach(() => {
    cy.logout()
  })

  it("Pre-req: Invoke and save the empName to fixturefile", () => {
    cy.get("@admindata").then(data => {
      cy.visit("/web/index.php/admin/viewSystemUsers")
      cy.get(".oxd-table-body :nth-child(n+1) div:nth-child(2)")
        .contains(data.searchUsername)
        .parents(".oxd-table-row--with-border") // Suppose it is a new cy.get a fresh start
        .find("div:nth-child(4) > div")
        .invoke("text")
        .as("empName")
        .then(empData => {
          const empName = empData.split(" ")[0]
          cy.readFile("Test/fixtures/adminpage.json", error => {
            if (error) {
              return cy.log(error)
            }
          }).then(file => {
            file.empName = empName // "empName": "Paul"
            cy.writeFile("Test/fixtures/adminpage.json", JSON.stringify(file))
          })
        })
    })
  })

  it("Validating that user can navigate to the Admin Tab and see the details of the page", () => {
    navigateToAdminTab()
    cy.get(".oxd-topbar-body-nav").should("be.visible")
    cy.get(".oxd-table-filter").should("be.visible")
    cy.get(".oxd-button--secondary").find("i").should("be.visible")
    cy.get(".orangehrm-container").should("be.visible")
  })

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

  // check the eslint flakyness smell,// look how this. works in new cypress version.
  it("Validating the search functionality of tyhe page", () => {
    cy.get("@admindata").then(adminPage => {
      // @admindata = adminPage"
      navigateToAdminTab()
      cy.get(".oxd-form-row")
        .find(".oxd-input.oxd-input--active")
        .type(adminPage.searchUsername, { force: true })
      cy.get(".oxd-select-text--arrow")
        .first()
        .click({ force: true })
        .then(() => {
          cy.get(".oxd-select-dropdown.--positon-bottom").should("be.visible")
          cy.get(".oxd-select-option span")
            .contains(adminPage.searchUsername)
            .click({ force: true })
        })
      cy.get(".oxd-autocomplete-text-input input").type(adminPage.empName, { force: true })
      cy.get(".oxd-autocomplete-dropdown.--positon-bottom").should("be.visible")
      cy.get(".oxd-autocomplete-option span").first().click({ force: true })
      cy.get(".oxd-select-text--arrow")
        .last()
        .click({ force: true })
        .then(() => {
          cy.get(".oxd-select-dropdown.--positon-bottom").should("be.visible")
          cy.get(".oxd-select-option span").contains("Enabled").click({ force: true })
        })
      cy.get(".oxd-form-actions .orangehrm-left-space").click({ force: true })
      cy.get(".oxd-table-card").should("have.length", 1)
    })
  })

  it.only("Verifying The Add Functionality", () => {
    cy.intercept("POST", "/web/index.php/api/**/auth/public/validation/password").as("pass")
    cy.intercept("GET", "/web/index.php/api/**/pim/employees?**").as("empName")
    cy.get("@admindata").then(admindata => {
      navigateToAdminTab()
      cy.get(".oxd-button--secondary").find("i").click({ force: true })
      cy.get(".orangehrm-card-container h6").should("have.text", "Add User")
      cy.get(".oxd-select-text--arrow")
        .first()
        .click({ force: true })
        .then(() => {
          cy.get(".oxd-select-dropdown.--positon-bottom").should("be.visible")
          cy.get(".oxd-select-option span")
            .contains(admindata.searchUsername)
            .click({ force: true })
        })
      cy.get(".oxd-autocomplete-text-input input").type(admindata.empName, { force: true })
      cy.get(".oxd-autocomplete-dropdown.--positon-bottom").should("be.visible")
      cy.get(".oxd-autocomplete-option span").first().click({ force: true })
      cy.wait("@empName")
      cy.get(".oxd-select-text--arrow")
        .last()
        .click({ force: true })
        .then(() => {
          cy.get(".oxd-select-dropdown.--positon-bottom").should("be.visible")
          cy.get(".oxd-select-option span").contains("Enabled").click({ force: true })
        })
      cy.get(".oxd-input-group .oxd-input").eq(0).type("Kanishka", { delay: 200 })
      cy.get(".oxd-input-group .oxd-input").eq(1).type("Test@1234", { delay: 200 })
      cy.get(".oxd-input-group .oxd-input").eq(2).type("Test@1234", { delay: 200 })
      cy.wait("@pass")
      cy.get(".orangehrm-left-space", { timeout: 7000 }).contains("Save").click({ force: true })
      cy.get("#oxd-toaster_1").should("be.visible")
      cy.wait("@pass")
    })
  })

  it("Validating that user can navigate to the Admin Tab and see the details of the page", () => {
    navigateToAdminTab()
  })
})

function navigateToAdminTab() {
  loginPage.getSideMenu().contains("Admin").click({ force: true })
  loginPage.getSideMenu().contains("Admin").should("have.class", "oxd-main-menu-item active")
}
