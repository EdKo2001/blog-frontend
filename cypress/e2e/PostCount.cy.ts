it("Checking post count increment functionality", () => {
  cy.visit("/");

  cy.get(
    '[data-testid="post-card"] [data-testid="RemoveRedEyeOutlinedIcon"] + span '
  )
    .first()
    .then((element) => {
      let postCountBeforeVisiting = parseInt(element.text(), 10);
      let postSlug;
      cy.get('[data-testid="post-card"] a')
        .first()
        .invoke("attr", "href")
        .then((href) => {
          postSlug = href;
        });

      cy.get('[data-testid="post-card"] a')
        .first()
        .click()
        .then(() => {
          cy.url().should("include", "/posts/");
          // Cypress.env("REACT_APP_API_URL")
          let url = "http://localhost:8888/api" + postSlug;
          console.log("API URL:", url);

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
