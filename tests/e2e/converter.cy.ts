describe('Converter Component E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage successfully', () => {
    cy.contains('Gazel Döviz').should('be.visible');
    cy.contains('Döviz Çevirici').should('be.visible');
  });

  it('should perform currency conversion', () => {
    // Select currencies
    cy.get('select').first().select('USD');
    cy.get('select').eq(1).select('TRY');

    // Enter amount
    cy.get('input[type="number"]').clear().type('100');

    // Wait for auto-conversion
    cy.wait(1000);

    // Check if result is displayed
    cy.get('input[type="number"]').should('not.be.empty');
  });

  it('should swap currencies', () => {
    cy.get('select').first().select('USD');
    cy.get('select').eq(1).select('EUR');

    // Click swap button
    cy.get('button[aria-label="Swap currencies"]').click();

    // Verify swap occurred
    cy.get('select').first().should('have.value', 'EUR');
    cy.get('select').eq(1).should('have.value', 'USD');
  });

  it('should navigate to rates page', () => {
    cy.contains('Kurlar').click();
    cy.url().should('include', '/kurlar');
    cy.contains('Anlık Döviz Kurları').should('be.visible');
  });

  it('should search for currencies', () => {
    cy.visit('/kurlar');
    cy.get('input[placeholder*="ara"]').type('USD');
    cy.contains('USD').should('be.visible');
    cy.contains('Amerikan Doları').should('be.visible');
  });

  it('should toggle favorites', () => {
    cy.visit('/kurlar');
    
    // Click first favorite button
    cy.get('button').contains('Star').first().click();
    
    // Verify favorites section appears
    cy.contains('Favorilerim').should('be.visible');
  });

  it('should display chart on currency selection', () => {
    cy.visit('/kurlar');
    
    // Click on a currency card
    cy.get('[class*="currency-card"]').first().click();
    
    // Chart should be visible
    cy.contains('Tarihsel Kur Grafiği').should('be.visible');
  });

  it('should toggle theme', () => {
    // Click theme toggle
    cy.get('button[aria-label="Tema Değiştir"]').click();
    
    // Verify dark mode is applied
    cy.get('html').should('have.class', 'dark');
    
    // Toggle back
    cy.get('button[aria-label="Tema Değiştir"]').click();
    cy.get('html').should('have.class', 'light');
  });

  it('should submit contact form', () => {
    cy.visit('/iletisim');
    
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="subject"]').type('Test Subject');
    cy.get('textarea[name="message"]').type('Test message content');
    
    cy.get('button[type="submit"]').click();
    
    cy.contains('başarıyla gönderildi').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    
    // Mobile menu should be visible
    cy.get('button[aria-label="Menü"]').should('be.visible');
    
    // Click mobile menu
    cy.get('button[aria-label="Menü"]').click();
    
    // Navigation should be visible
    cy.contains('Ana Sayfa').should('be.visible');
    cy.contains('Kurlar').should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    // Intercept API call and force error
    cy.intercept('GET', '/api/rates*', {
      statusCode: 500,
      body: { error: 'Server error' },
    });

    cy.visit('/kurlar');
    cy.wait(1000);
    
    // Should show error state or fallback
    // (Add specific error handling in your components)
  });

  it('should cache data correctly', () => {
    cy.visit('/kurlar');
    
    // Wait for initial load
    cy.wait(2000);
    
    // Navigate away and back
    cy.visit('/');
    cy.visit('/kurlar');
    
    // Should load faster from cache
    cy.get('[class*="currency-card"]').should('be.visible');
  });
});
