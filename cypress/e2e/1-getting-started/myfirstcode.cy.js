
describe("This is my first Test Set", () => {

    it("My very first test case", () => {
        expect(true).to.equal(true)
        cy.log("This is my very first test case.")
    })

    it("My Second test case", () => {
        expect(true).to.equal(false)
        cy.log("This is my very first test case.")
    })


})

