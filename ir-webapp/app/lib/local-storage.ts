import { ObjectHash } from "./helpers";

// https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
const isAvailable = () => {
  const testVal = "test";
  try {
    localStorage.setItem(testVal, testVal);
    const response = localStorage.getItem(testVal);
    localStorage.removeItem(testVal);
    return response === testVal;
  } catch (e) {
    return false;
  }
};

const engine = isAvailable()
  ? localStorage
  : {
      getItem: () => null,
      setItem: () => null,
      removeItem: () => null,
      clear: () => null,
    };

const get = (key: string, parse?: boolean): any => {
  const val = engine.getItem(key);

  if (parse) {
    try {
      return JSON.parse(String(val));
    } catch (err) {
      return null;
    }
  }

  return val;
};

const set = (key: string, val: string | number | object): void => {
  if (typeof val === "object") {
    val = JSON.stringify(val);
  }

  try {
    engine.setItem(key, String(val));
  } catch (err) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
    console.error(err);
  }
};

const remove = (key: string): void => {
  engine.removeItem(key);
};

const clear = (): void => {
  engine.clear();
};

export { get, set, remove, clear, isAvailable };
