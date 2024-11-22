describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:5173");
    expect(cy.contains("Rechercher")).to.exist;
  });
});
