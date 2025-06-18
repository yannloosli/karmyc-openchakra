import React from 'react'
import * as Chakra from '@chakra-ui/react'

import {
    BoxProps,
    ButtonProps,
    ImageProps,
    LinkProps,
    FlexProps,
    TabListProps,
    TabPanelProps,
    TabPanelsProps,
    TabsProps,
    MenuProps,
    TextProps,
    TabProps,
} from '@chakra-ui/react'

import iconsList from '~iconsList'

type PropsWithForm<T> = T & { form?: T }

type PreviewDefaultProps = {
    Box?: PropsWithForm<BoxProps>
    Button?: PropsWithForm<ButtonProps>
    Image?: PropsWithForm<ImageProps>
    Text?: PropsWithForm<TextProps>
    Link?: PropsWithForm<LinkProps>
    Flex?: PropsWithForm<FlexProps>
    TabList?: PropsWithForm<TabListProps>
    TabPanel?: PropsWithForm<TabPanelProps>
    TabPanels?: PropsWithForm<TabPanelsProps>
    Tab?: PropsWithForm<TabProps>
    Tabs?: PropsWithForm<TabsProps>
    Menu?: PropsWithForm<MenuProps>
}

export const DEFAULT_PROPS: PreviewDefaultProps = {
    Button: {
        children: 'Button text',
        variant: 'solid',
        size: 'md',
    },
    Flex: {
        form: {
            display: 'flex',
        },
    },
    Image: {
        height: '100px',
        width: '100px',
    },
    Link: { children: 'Link text' },
    Tab: { children: 'Tab' },
    Tabs: { children: '', size: 'md' },
    TabPanel: { children: 'Tab' },
    Text: { children: 'Text value' },
}

export const getDefaultFormProps = (type: ComponentType) => {
    //@ts-ignore
    const chakraDefaultProps = Chakra[type].defaultProps
    // @ts-ignore
    return { ...chakraDefaultProps, ...DEFAULT_PROPS[type]?.form }
}
