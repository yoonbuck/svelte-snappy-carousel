export const key = Symbol("svelte-snappy-carousel");

export interface CarouselContext {
  register(): number;
  provideDOMElement(index: number, el: HTMLDivElement): void;
  destroy(index: number): void;
}
