import LocalForage, { createInstance } from 'localforage';

class Store {
  store: LocalForage;

  constructor(s: LocalForage) {
    this.store = s;
  }

  async restore(): Promise<string> {
    try {
      const saving = await this.store.getItem('save');
      return (saving as string) || '';
    } catch (error) {
      console.debug(error);
    }
  }

  async save(saving) {
    try {
      const result = this.store.setItem('save', saving);
      return result;
    } catch (error) {
      console.debug(error);
    }
  }

  clear() {
    return this.store.clear();
  }
}

const config = { name: 'factory-game', version: 0.1 };
const store = createInstance(config);

export const storage = new Store(store);
