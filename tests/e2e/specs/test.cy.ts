/*describe('My First Test', () => {
  it('Tests the home button', () => {
    cy.visit('http://localhost:8100/M4A')

    cy.get('#homeButton').click()

    cy.url().should('eq', 'http://localhost:8100/Jesus')
    cy.pause()
  })
})*/

describe('My Youtube Bot Helper', () => {
  it('Helps Youtube bottinger', () => {
    cy.visit('https://www.youtube.com/@SecularTalk/Videos')

    cy.get(':nth-child(1) > :nth-child(3) > .ytd-item-section-renderer > :nth-child(1) > #contents > .ytd-shelf-renderer > #scroll-outer-container > #scroll-container > #items > :nth-child(1) > #dismissible > ytd-thumbnail.style-scope > #thumbnail > yt-image.style-scope > .ytCoreImageHost').click()
    cy.pause()

    //cy.get('#homeButton').click()
    cy.get('[tab-title="Videos"] > .yt-tab-shape-wiz__tab').click()
    //cy.get(':nth-child(1) > #content > .ytd-rich-item-renderer > #dismissible > :nth-child(1) > ytd-thumbnail.style-scope > #thumbnail > yt-image.style-scope > .yt-core-image').click()
    //cy.get('.ytp-play-button').click()
    //cy.get('#description-inline-expander > #expand').click()
    //cy.get('#structured-description > div.ytd-structured-description-content-renderer > ytd-video-description-transcript-section-renderer.style-scope > #button-container > #primary-button > .style-scope > yt-button-shape > .yt-spec-button-shape-next > yt-touch-feedback-shape > .yt-spec-touch-feedback-shape > .yt-spec-touch-feedback-shape__fill').click()
    
    //if( != null)
    try
    {
      //cy.get('[target-id="engagement-panel-searchable-transcript"]').contains("Trump took over is like")
      cy.get('[target-id="engagement-panel-searchable-transcript"]').contains("afdsafdfsafsda")
      cy.url().then((url) => {
        cy.log('Current URL is: ' + url)
      })
    }
    catch
    {
      cy.log('Text Not Found')
    }

    //cy.url().should('eq', 'http://localhost:8100/Jesus')
    cy.pause()
  })
})
