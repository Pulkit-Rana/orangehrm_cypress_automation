import { LoginPage } from "../support/pageobject/loginpage"

const loginPage = new LoginPage()

describe("Automating Admin Tab", () => {

    beforeEach(() => {
        cy.login()
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

    it("Validating the headers on the admin page.", () => {
        navigateToAdminTab()
    })

    it("Validating that user can navigate to the Admin Tab and see the details of the page", () => {
        navigateToAdminTab()
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
