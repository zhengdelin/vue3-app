export class Box {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get top() {
    return this.x;
  }

  get left() {
    return this.y;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }
}

export function getTargetBox(target: HTMLElement | [x: number, y: number]) {
  if (Array.isArray(target)) {
    return new Box({ x: target[0], y: target[1], width: 0, height: 0 });
  }
  return target.getBoundingClientRect();
}
