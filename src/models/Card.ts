export type Color = "red" | "black";

export default class Card {
  public value;
  public color;
  public presentation;
  public suits;

  constructor(value: number, color: Color, suits: string) {
    this.value = value;
    this.color = color;
    this.suits = suits;
    this.presentation = this.getPresentation();
  }

  getPresentation(): string {
    if (this.value === 1 || this.value === 14) return "A" + this.suits;

    if (this.value > 10) {
      switch (this.value) {
        case 11:
          return "J" + this.suits;
        case 12:
          return "Q" + this.suits;
        case 13:
          return "K" + this.suits;
      }
    }

    return `${this.value}${this.suits}`;
  }
}
