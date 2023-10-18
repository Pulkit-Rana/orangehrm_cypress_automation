import { DashboardPage } from "../support/pageobject/dashboardpage"

const dashboard = new DashboardPage()

describe("Test Cases to validate the Dashboard functionality", () => {
  before(() => {
    cy.login()
  })
 
  after(() => {
    cy.logout() 
  })

  it("Just Checking the configs and Custom Commands", () => {
    dashboard.getDashboardTiles().should("have.length", 7)
    dashboard
      .getDasboardTilesNames()
      .find("p")
      .then($ele => {
        expect($ele.text())
          .include("Time at Work")
          .and.include("My Actions")
          .and.include("Quick Launch")
          .and.include("Buzz Latest Posts")
          .and.include("Employees on Leave Today")
          .and.include("Employee Distribution by Sub Unit")
          .and.include("Employee Distribution by Location")
      })
  })
})
