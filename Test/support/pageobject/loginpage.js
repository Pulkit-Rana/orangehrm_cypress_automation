export class LoginPage {

    getLoginContainerUI() {
        return cy.get(".orangehrm-login-container")
    }

    getUserName() {
        return cy.get('[placeholder="Username"]')
    }

    getuserPassword() {
        return cy.get('[placeholder="Password"]')
    }

    getLoginSubmiButton() {
        return cy.get('[type="submit"]')
    }

    getSideMenu() {
        return cy.get(".oxd-main-menu-item-wrapper")
    }

    getProfileDropdown() {
        return cy.get(".oxd-userdropdown-tab")
    }
}