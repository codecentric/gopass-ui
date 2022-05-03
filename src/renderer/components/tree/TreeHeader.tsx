import * as React from 'react'
import * as m from 'react-materialize'

import { deriveIconFromSecretName } from '../../secrets/deriveIconFromSecretName'

export const TreeHeader = ({ style, node }: any) => {
    let iconType = 'folder'

    const isLeaf = !node.children && node.path
    if (!node.children && node.path) {
        iconType = deriveIconFromSecretName(node.name)
    }
    return (
        <div style={style.base} className='icon-wrapper'>
            {node.children && (
                <div className={`chevron ${node.toggled && 'toggled'}`}>
                    <m.Icon small>chevron_right</m.Icon>
                </div>
            )}
            <m.Icon small>{iconType}</m.Icon>

            {node.name}
        </div>
    )
}
