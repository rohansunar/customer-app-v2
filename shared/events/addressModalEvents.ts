type AddressModalEvent = { mode: 'add' | 'list' };

/**
 * Lightweight event hub to open the address picker modal from anywhere
 * without coupling components to navigation.
 */
class AddressModalEventBus {
  private listeners = new Set<(event: AddressModalEvent) => void>();

  subscribe(listener: (event: AddressModalEvent) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  openAddAddress() {
    this.emit({ mode: 'add' });
  }

  private emit(event: AddressModalEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
}

export const addressModalEvents = new AddressModalEventBus();
