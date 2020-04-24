import * as React from 'react'
import * as m from 'react-materialize'

import { deriveIconFromSecretName } from '../../secrets/deriveIconFromSecretName'

export const TreeHeader = ({ style, node }: any) => {
    let iconType = node.toggled ? 'chevron_right' : 'folder'

    if (!node.children && node.path) {
        iconType = deriveIconFromSecretName(node.name)
    }

    return (
        <div style={style.base}>
            <m.Icon small>{iconType}</m.Icon>

            {node.name}
        </div>
    )
}
