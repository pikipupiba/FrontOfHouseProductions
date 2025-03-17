// Basic test to ensure Jest is working correctly
describe('Basic Jest Configuration', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have jest-dom assertions available', () => {
    // Create a DOM element to test jest-dom assertions
    const element = document.createElement('div');
    element.textContent = 'Hello World';
    
    expect(element).toHaveTextContent('Hello World');
    expect(element).not.toBeEmpty();
  });
});
