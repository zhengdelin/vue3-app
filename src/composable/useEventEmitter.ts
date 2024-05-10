type Func = (...args: any[]) => any;

export class EventEmitter<T extends string = string> {
  private _eventMap = {} as Record<T, Func[]>;
  on(eventName: T, callback: Func) {
    if (!this._eventMap[eventName]) {
      this._eventMap[eventName] = [];
    }
    this._eventMap[eventName].push(callback);
    return () => this.off(eventName, callback);
  }

  off(eventName: T, callback: Func) {
    if (!this._eventMap[eventName]) {
      return;
    }
    const index = this._eventMap[eventName].indexOf(callback);
    if (index > -1) {
      this._eventMap[eventName].splice(index, 1);
    }
  }

  emit(eventName: T, ...args: any[]) {
    if (!this._eventMap[eventName]) {
      return;
    }
    this._eventMap[eventName].forEach((callback) => {
      callback(...args);
    });
  }
}
