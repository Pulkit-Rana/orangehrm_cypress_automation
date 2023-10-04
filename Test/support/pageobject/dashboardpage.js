export class DashboardPage {

    getDashboardTiles() {
        return cy.get(".oxd-sheet.oxd-sheet--rounded")
    }

    getDasboardTilesNames() {
        return cy.get(".orangehrm-dashboard-widget-name")
    }

}