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

import { LoginPage } from "./pageobject/loginpage"
const encryptor = require("simple-encryptor")(Cypress.env("info"))

const loginPage = new LoginPage()

Cypress.Commands.add('login', () => {
    cy.visit("/")
    loginPage.getLoginContainerUI().should("be.visible")
    loginPage.getUserName().type(Cypress.env("userName"), { log: false })
    loginPage.getuserPassword().type(encryptor.decrypt(Cypress.env("password")), { log: false })
    loginPage.getLoginSubmiButton().click({ force: true })
    loginPage.getSideMenu().contains("Dashboard").should("have.class", "oxd-main-menu-item active")
})

Cypress.Commands.add('logout', () => {
    loginPage.getProfileDropdown().click({ force: true })
    cy.get(".oxd-topbar-header-userarea ul li").should("have.class", "--active oxd-userdropdown")
    cy.get('[href="/web/index.php/auth/logout"]').click({ force: true })
})

Cypress.Commands.add("clearThenType", { prevSubject: true }, (locator, text) => { // text = New Text entered , locator = #someLocator
    cy.get(locator).clear({ force: true })
    cy.type(locator).type(text, { force: true })
})  