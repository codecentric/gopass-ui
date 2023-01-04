declare module 'promise-timeout' {
    namespace promiseTimeout {
        class TimeoutError extends Error {}

        function timeout<T>(promise: Promise<T>, timeoutMillis: number): Promise<T>
    }

    export = promiseTimeout
}
