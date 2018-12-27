import * as React from 'react'

const ActionNavigationWrapper = ({ children }: { children: any[] | any }) => {
    const btnStyle = { marginLeft: '20px' }
    const definedChildren = Array.isArray(children) ? children.filter((child: any) => !!child) : [children]

    return (
        <div style={{ padding: '20px 10px 10px 10px' }}>
            {
                /* provide 'btnStyle' to all children except the first one */
                React.Children.map(definedChildren, (child: any, i) => {
                    if (i === 0) {
                        return child
                    }
                    return React.cloneElement(child, { style: btnStyle })
                })
            }
        </div>
    )
}

export default ActionNavigationWrapper
