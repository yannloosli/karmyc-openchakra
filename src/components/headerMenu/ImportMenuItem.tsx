import React from 'react'
import { Menu, Box } from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'
import { loadFromJSON } from '~utils/import'
import useDispatch from '~hooks/useDispatch'

const ImportMenuItem = () => {
    const dispatch = useDispatch()

    return (
        <Menu.Item>
            <Box
                onClick={async () => {
                    const components = await loadFromJSON()
                    dispatch.components.reset(components)
                }}
                mr={2} as={FiUpload} />
            Import components
        </Menu.Item>
    )
}

export default ImportMenuItem
