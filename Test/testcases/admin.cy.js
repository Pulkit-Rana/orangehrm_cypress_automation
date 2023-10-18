/// <reference types="Cypress" />
import { LoginPage } from "../support/pageobject/loginpage"

const loginPage = new LoginPage()

const encryptor = require("simple-encryptor")(Cypress.env("info"))

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
      cy.get(".oxd-table-body :nth-child(n+1) div:nth-child(2)").contains(data.searchUsername).parents(".oxd-table-row--with-border").find("div:nth-child(4) > div").invoke("text").as("empName") // I can use it as empName
        .then(empData => { //empDate == empName1 == Paul collins
          const empName = empData.split(" ")[0] //empName2 == empData == Paul
          cy.readFile("Test/fixtures/adminpage.json", error => {
            if (error) {
              return cy.log(error)
            }
          }).then(file => {
            file.empName = empName // "empName": "Pulkit"
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

  it("Verifying The Add User Functionality", () => {
    cy.intercept("POST", "/web/index.php/api/**/auth/public/validation/password").as("pass")
    cy.intercept("GET", "/web/index.php/api/**/pim/employees?**").as("empName")
    cy.get("@admindata").then(admindata => {
      //admindata.addPassword = 98bd0ec257ced605241c30f2108847e5dc75769c9c7ff92a65b44d8ffba3ff08aa96497f1850b18ad5962a343647299a1JOE1u+zQN4P0+ToU06qHQ==
      let decryptedPass = encryptor.decrypt(admindata.addPassword)
      //decryptedPass = Test@1234
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
      cy.get(".oxd-input-group .oxd-input").eq(0).type(admindata.AddedUserName, { delay: 200 })
      cy.get(".oxd-input-group .oxd-input").eq(1).type(decryptedPass, { delay: 200 })
      cy.get(".oxd-input-group .oxd-input").eq(2).type(decryptedPass, { delay: 200 })// Test@1234
      cy.wait("@pass")
      cy.get(".orangehrm-left-space", { timeout: 7000 }).contains("Save").click({ force: true })
      cy.get("#oxd-toaster_1").should("be.visible")
      cy.wait("@pass")
    })
  })

  it("Validating The Edit User Functionality", () => {
    cy.intercept("GET", "/web/index.php/api/**/admin/users/**").as("em")
    cy.intercept("GET", "/web/index.php/api/**/pim/employees?**").as("name")
    cy.intercept("GET", "/web/index.php/api/**/admin/validation/user-name?**").as("emp")
    navigateToAdminTab()
    cy.get("@admindata").then((adminData) => {
      cy.get(".oxd-table-row.oxd-table-row--with-border").contains(adminData.AddedUserName)
        .parents(".oxd-table-row.oxd-table-row--with-border").find(".bi-pencil-fill").click({ force: true })
      cy.get(".orangehrm-card-container h6", { timeout: 6000 }).should("have.text", "Edit User")
      cy.get(".oxd-select-text--arrow").first().click({ force: true }).then(() => {
        cy.wait("@em")
        cy.get(`[role="listbox"]`).should("be.visible").contains("ESS").click({ force: true })
      })
      cy.get(".oxd-autocomplete-wrapper input", { timeout: 6000 }).clearThenType(adminData.empName, { delay: 300 })
      cy.wait("@emp")
      // cy.get('[role="listbox"]', { timeout: 9000 }).should("be.visible").contains(adminData.empName).click({ timeout: 9000 })
      cy.wait("@name")
      cy.get(' .oxd-select-text--after > .oxd-icon').last().click({ force: true }).then(() => {
        cy.get(".oxd-select-dropdown.--positon-bottom").contains("Enabled").parent().should("have.class", "oxd-select-option --selected")
      })
      cy.get('.oxd-input').last().clearThenType(adminData.UpdatedUsername, { delay: 200 })
      cy.wait("@emp")
    })
  })

  it("Validating The Edit User Functionality", () => {
    cy.get("@admindata").then((adminData) => {
      navigateToAdminTab()
      cy.get(".oxd-table-row.oxd-table-row--with-border").contains(adminData.AddedUserName)
        .parentsUntil(".oxd-table-card").find(`[type="checkbox"]`).check({ force: true }).should("be.checked")
      cy.get(".oxd-button--label-danger i").click({ force: true })
      cy.get('.orangehrm-modal-footer > .oxd-button--label-danger > .oxd-icon').click({ force: true })
      cy.get("#oxd-toaster_1").should("be.visible")
    })
  })

})

function navigateToAdminTab() {
  loginPage.getSideMenu().contains("Admin").click({ force: true })
  loginPage.getSideMenu().contains("Admin").should("have.class", "oxd-main-menu-item active")
}
