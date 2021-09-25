describe('UI Base Test', () => {
    beforeEach(() => {
        cy.visit('/index.html')
    })

    it('Header has container', () => {
        cy.get('[data-e2e=header] [data-e2e=header-title]').should('exist')
    })

    it('Content has h1', () => {
        cy.get('[data-e2e=content] h1').should('exist')
    })
})
