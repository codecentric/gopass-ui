declare module 'string-replace-to-array' {
    function replace(haystack: string, needle: RegExp | string, newVal: string | ((...args: any[]) => any)): any[]

    namespace replace {}
    export = replace
}
