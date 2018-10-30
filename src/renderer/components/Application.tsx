import * as React from 'react'
import * as m from 'react-materialize'
import SecretExplorer from './explorer/SecretExplorer'

const Application = () => (
    <m.Row>
        <m.Col s={4}>
            <SecretExplorer />
        </m.Col>
        <m.Col s={8}>Content</m.Col>
    </m.Row>
)

export default Application
