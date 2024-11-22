describe("Page d'accueil", () => {
  it('passes', () => {
    cy.visit('/');
    expect(cy.contains('Rechercher')).to.exist;
  });
});
