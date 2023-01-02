export default function exclude<T, K extends keyof T> (model: T, keysToExclude: K[]): Omit<T, K> {
    for (let key of keysToExclude) {
        delete model[key]
    };
    
    return model;
}