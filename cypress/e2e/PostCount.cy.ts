it("Checking post count increment functionality", () => {
  cy.visit("/");

  cy.get(
    '[data-testid="post-card"] [data-testid="RemoveRedEyeOutlinedIcon"] + span '
  )
    .first()
    .then((element) => {
      let postCountBeforeVisiting = parseInt(element.text(), 10);
      let postSlug = "";
      cy.get('[data-testid="post-card"] a')
        .first()
        .invoke("attr", "href")
        .then((href) => {
          postSlug = href!;
        });

      cy.get('[data-testid="post-card"] a')
        .first()
        .click()
        .then(() => {
          cy.url().should("include", "/posts/");

          //@ts-ignore
          let url = Cypress.config().apiUrl + postSlug;

          cy.intercept("GET", url).as("FullPost");

          cy.wait("@FullPost"); // wait for the GET request to complete

          cy.get('[data-testid="RemoveRedEyeOutlinedIcon"] + span').then(
            (postCountAfterVisiting) => {
              expect(parseInt(postCountAfterVisiting.text(), 10)).equals(
                postCountBeforeVisiting + 1
              );
            }
          );
        });
    });
});
