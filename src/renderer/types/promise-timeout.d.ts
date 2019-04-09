declare module 'promise-timeout' {
    namespace promiseTimeout {
        class TimeoutError extends Error {}

        function timeout(promise: Promise<any>, timeoutMillis: number): Promise<any>
    }

    export = promiseTimeout
}
