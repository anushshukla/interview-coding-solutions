/**
 * This is a function.
 *
 * @param {Promise} promise - Promise object
 * @param {string} [retryCount] - number of retries
 * @return {any} Promise output
 *
 * @example
 *
 *     const promiseOutput = retryPromiseWrapper(Promise.resolve(1), 3)
 */
async function retryPromiseWrapper<T = any>(promise: Promise<T>, retryCount: number) {
    for (let i = 0; i < retryCount; i++) {
        try {
            return await promise;
        } catch (e) {
            if (i === retryCount - 1) {
                throw e;
            }
        }
    }
}

;
