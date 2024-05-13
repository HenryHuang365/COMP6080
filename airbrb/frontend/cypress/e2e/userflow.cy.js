import 'cypress-file-upload';

describe('user register/create happy path', () => {
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
      .type('Ma888@email.com')

    cy.get('textarea[name="UserNameInput"]')
      .focus()
      .type('Ma888')

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
    cy.get('button[name="switchHostList"]')
      .click();
    cy.url().should('include', 'http://localhost:3000/hostlist')
  })

  it('should go to the create page successfully', () => {
    cy.get('button[name="createButton"]')
      .click();
    cy.url().should('include', 'http://localhost:3000/createlisting')
  })

  it('should create a property successfully', () => {
    const title = 'testProperty';
    const address1 = 'testAddress1';
    const address2 = 'testAddress2';
    const city = 'Sydney';
    const country = 'AU';
    const postcode = '2018'
    const price = 233;
    const type = 'House';
    const nBath = 3;
    const nBed = 3;
    const amentities = 3;
    cy.get('input[name="createTitleInput"]')
      .focus()
      .type(title)
    cy.get('input[name="createAddressInput1"]')
      .focus()
      .type(address1)
    cy.get('input[name="createAddressInput2"]')
      .focus()
      .type(address2)
    cy.get('input[name="createCityInput"]')
      .focus()
      .type(city)
    cy.get('input[name="createCountryInput"]')
      .focus()
      .type(country)
    cy.get('input[name="createPostCodeInput"]')
      .focus()
      .type(postcode)
    cy.get('input[name="createPriceInput"]')
      .focus()
      .type(price)
    cy.get('input[name="createTypeInput"]')
      .focus()
      .type(type)
    cy.get('input[name="createNbathInput"]')
      .focus()
      .type(nBath)
    cy.get('input[name="createNbedInput"]')
      .focus()
      .type(nBed)
    cy.get('input[name="createNamennput"]')
      .focus()
      .type(amentities)

    // If the file is in your fixtures folder
    cy.get('[data-cy=uploadThumbnailCreate]').attachFile('examplehouse.jpg');
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
  })

  it('should update the thumbnail and title of the listing successfully', () => {
    cy.wait(1000)
    const title = 'testProperty';
    const modified = 'modifiedTitle'
    cy.get(`#editbut${title}`)
      .click()

    cy.get(`#editTitle${title}`).clear().type('modifiedTitle');
    cy.get(`[data-cy=${modified}editThumbnailCreate]`).attachFile('defaulthouse.jpg');
    cy.get(`#editsubmit${modified}`)
      .click()

    // modal should pop up with content success
    cy.get('#error-modal-modal-title').should('contain', 'Success');
    // close the modal
    cy.get('button[name="modalClose"]')
      .click();
    cy.url().should('include', 'http://localhost:3000/hostlist')
    // the new modified title must exist
    cy.get(`#${modified}-hostlistcard`).should('contain', `${modified}`);
  })

  it('should Logs out of the application successfully', () => {
    cy.wait(1000)
    cy.get('button[name="logoutbtn"]')
      .click()
    // after logout, user should be in the dashboard
    cy.url().should('include', 'http://localhost:3000/dashboard')

    // user can not visit hostlist page since they're not login
    cy.visit('http://localhost:3000/hostlist');
    cy.url().should('include', 'http://localhost:3000/login');
  })

  it('should Logs back into the application successfully', () => {
    cy.wait(1000)
    cy.visit('http://localhost:3000/login');

    cy.get('#loginEmail')
      .focus()
      .type('Ma888@email.com')

    cy.get('#loginPassword')
      .focus()
      .type('12345')

    cy.get('#loginbtn')
      .click()
    // now user can visit hostlist because they login
    cy.visit('http://localhost:3000/hostlist');
    cy.url().should('include', 'http://localhost:3000/hostlist');
  })
})
