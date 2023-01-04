const white = '#FFFFFF'
const none = 'none'

export const globalStyle = {
    tree: {
        base: {
            listStyle: none,
            backgroundColor: white,
            margin: 0,
            padding: 0,
            color: '#000000',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;',
            fontSize: '18px'
        },
        node: {
            base: {
                position: 'relative',
                borderLeft: '1px solid #ececec',
                padding: '4px 12px 4px',
                marginLeft: '8px'
            },
            link: {
                cursor: 'pointer',
                position: 'relative',
                display: 'block'
            },
            activeLink: {
                background: white
            },
            toggle: {
                base: {
                    display: none
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 0,
                width: 0,
                arrow: {
                    fill: white,
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: '#555',
                    cursor: 'pointer'
                }
            },
            subtree: {
                listStyle: none,
                paddingLeft: '60px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    }
}
