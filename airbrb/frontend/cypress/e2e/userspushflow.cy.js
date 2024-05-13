describe('multiple user see push behavior', () => {
  it('navigate to rootpage', () => {
    // when visit root page
    cy.visit('http://localhost:3000/')
    //  it should go to the dash board
    cy.url().should('include', 'http://localhost:3000/dashboard')
  })

  it('navigate to register by clicking login then sign up', () => {
    cy.get('button[name="headerLogin"]')
      .click();
    cy.url().should('include', 'http://localhost:3000/login')

    cy.get('button[name="signUpButton"]')
      .click();
    cy.url().should('include', 'http://localhost:3000/register')
  })

  it('should register successfully', () => {
    cy.get('textarea[name="EmailInput"]')
      .focus()
      .type('Ma999@email.com')

    cy.get('textarea[name="UserNameInput"]')
      .focus()
      .type('Ma999')

    cy.get('input[name="PasswordInput"]')
      .focus()
      .type('12345')

    cy.get('input[name="PasswordInputTwice"]')
      .focus()
      .type('12345')

    cy.get('button[name="registerButton"]')
      .click()

    cy.url().should('include', 'http://localhost:3000/dashboard')
  })
  it('should go to the host listing page successfully', () => {
    // switch to all list page first, there should be nothing
    cy.get('button[name="switchAllList"]')
      .click();
    cy.url().should('include', 'http://localhost:3000/dashboard')
    // there should be nothing here

    cy.get('button[name="switchHostList"]')
      .click();
    cy.url().should('include', 'http://localhost:3000/hostlist')
  })

  it('should go to the create page successfully', () => {
    cy.get('button[name="createButton"]')
      .click();
    cy.url().should('include', 'http://localhost:3000/createlisting')
  })

  it('should create/push a property successfully', () => {
    const title = 'testProperty2';
    const price = 233;
    cy.get('input[name="createTitleInput"]')
      .focus()
      .type(title)
    cy.get('input[name="createPriceInput"]')
      .focus()
      .type(price)
    // submit and go back to the hostlisted page
    cy.get('button[name="submitCreate"]')
      .click();
    // modal should pop up with content success
    cy.get('#error-modal-modal-title').should('contain', 'Success');

    // close the modal
    cy.get('button[name="modalClose"]')
      .click();

    // should be in the hosted listing page now
    cy.url().should('include', 'http://localhost:3000/hostlist')
    cy.wait(1000)
    // the new card created by the user must exist
    cy.get(`#${title}-hostlistcard`).should('contain', `${title}`);

    // press the push button
    cy.get(`#${title}pushbtn`)
      .click();
    cy.get('input[placeholder="MM/DD/YYYY"]').eq(0).clear().type('11/24/2002');
    cy.get('input[placeholder="MM/DD/YYYY"]').eq(1).clear().type('11/26/2002');
    cy.wait(1000)

    // push the property
    cy.get(`#${title}livebtn`)
      .click();

    // modal should pop up with content success
    cy.get('#error-modal-modal-title').should('contain', 'Success');

    // close the modal
    cy.get('button[name="modalClose"]')
      .click();

    // switch to all listing and we can see the pushed property
    cy.get('button[name="switchAllList"]')
      .click();
    cy.url().should('include', 'http://localhost:3000/dashboard')

    // the new pushed card must exist
    cy.get(`#${title}-alllistcard`).should('contain', `${title}`);


    // when user logout, they can still see the published channel

    cy.get('button[name="logoutbtn"]')
      .click()
    // after logout, user should be in the dashboard
    cy.url().should('include', 'http://localhost:3000/dashboard')

    // user can not visit hostlist page since they're not login
    cy.visit('http://localhost:3000/hostlist');
    cy.url().should('include', 'http://localhost:3000/login');

    // when user visit root, they should go to the dashboard path(all listing)
    cy.visit('http://localhost:3000/');
    cy.url().should('include', 'http://localhost:3000/dashboard');
    // the new pushed card must exist is visible for the user who does not login
    cy.get(`#${title}-alllistcard`).should('contain', `${title}`);


  })
})