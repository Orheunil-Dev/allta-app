import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const mmkvStorage = {
  setJson: (key: string, value: any) => {
    return storage.set(key, JSON.stringify(value));
  },
  setString: (key: string, value: string) => {
    return storage.set(key, value);
  },
  setBoolean: (key: string, value: boolean) => {
    return storage.set(key, value);
  },
  getJson: (key: string) => {
    const str = storage.getString(key);
    return str ? JSON.parse(str) : null;
  },
  getString: (key: string) => {
    return storage.getString(key);
  },
  getBoolean: (key: string) => {
    return storage.getBoolean(key);
  },
  getInt: (key: string) => {
    return storage.getNumber(key);
  },
  removeItem: (key: string) => {
    return storage.delete(key);
  },
};

export default mmkvStorage;
