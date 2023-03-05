export interface GlobalGameStateI {
  selectedFactoryType: null | string;
  selectFactoryType: (factoryType: string) => void;
}

export class GlobalGameState implements GlobalGameStateI {
  selectedFactoryType: null | string = null;

  selectFactoryType(factoryType: string) {
    document.body.classList.remove(
      `factory-type-selected--${this.selectedFactoryType}`
    );
    this.selectedFactoryType = factoryType;

    if (!factoryType) return;

    document.body.classList.add(`factory-type-selected--${factoryType}`);
  }
}
