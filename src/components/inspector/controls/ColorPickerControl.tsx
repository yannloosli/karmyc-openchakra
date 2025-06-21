import React, { ChangeEvent } from 'react'
import {
    Popover,
    Box,
    Tabs,
    Input,
    Portal,
} from '@chakra-ui/react'
import { Sketch } from '@uiw/react-color'
import HuesPickerControl from './HuesPickerControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'

type ColorPickerPropType = {
    withFullColor?: boolean
    name: string
    gradient: boolean
    gradientColor?: string
    index?: number
    updateGradient?: (value: string, index: number) => Promise<void>
}

const ColorPickerControl = (props: ColorPickerPropType) => {
    // Utiliser les couleurs par défaut de Chakra UI v3
    const themeColors: any = {
        gray: { 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' },
        red: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a' },
        orange: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407' },
        yellow: { 50: '#fefce8', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03' },
        green: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' },
        teal: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e' },
        blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
        cyan: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344' },
        purple: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764' },
        pink: { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724' },
    }

    const { setValue, setValueFromEvent } = useForm()
    const value = usePropsSelector(props.name)

    let propsIconButton: any = { bg: value }
    if (value && themeColors[value]) {
        propsIconButton = { colorScheme: value }
    }

    return (
        <>
            <Popover.Root placement="bottom">
                <Popover.Trigger>
                    {props.gradient ? (
                        <Box
                            mr={2}
                            boxShadow="md"
                            border={props.gradientColor ? 'none' : '2px solid grey'}
                            borderRadius="full"
                            aria-label="Color"
                            bg={props.gradientColor}
                            width="20px"
                            height="20px"
                        />
                    ) : (
                        <Box
                            mr={2}
                            boxShadow="md"
                            border={value ? 'none' : '2px solid grey'}
                            borderRadius="full"
                            aria-label="Color"
                            width="20px"
                            height="20px"
                            {...propsIconButton}
                        />
                    )}
                </Popover.Trigger>
                <Popover.Content>
                    <Popover.Arrow />
                    <Popover.Body>
                        {props.withFullColor ? (
                            <Tabs.Root size="sm" colorScheme="green" defaultValue="theme">
                                <Tabs.List>
                                    <Tabs.Trigger value="theme">Theme</Tabs.Trigger>
                                    <Tabs.Trigger value="all">All</Tabs.Trigger>
                                </Tabs.List>
                                <Tabs.Content value="theme">
                                    {props.gradient ? (
                                        <HuesPickerControl
                                            name={props.name}
                                            themeColors={themeColors}
                                            enableHues
                                            setValue={setValue}
                                            gradient={true}
                                            index={props.index}
                                            updateGradient={props.updateGradient}
                                        />
                                    ) : (
                                        <HuesPickerControl
                                            name={props.name}
                                            themeColors={themeColors}
                                            enableHues
                                            setValue={setValue}
                                            gradient={props.gradient}
                                        />
                                    )}
                                </Tabs.Content>

                                <Tabs.Content value="all">
                                    <Box position="relative" height="200px">
                                        <Sketch
                                            color={props.gradient ? props.gradientColor : value}
                                            onChange={(color) => {
                                                props.gradient
                                                    ? props.updateGradient!(
                                                        color.hex,
                                                        props.index!,
                                                    )
                                                    : setValue(props.name, color.hex)
                                            }}
                                            presetColors={[]}
                                            disableAlpha={true}
                                        />
                                    </Box>
                                </Tabs.Content>
                            </Tabs.Root>
                        ) : props.gradient ? (
                            <HuesPickerControl
                                name={props.name}
                                themeColors={themeColors}
                                enableHues
                                setValue={setValue}
                                gradient={true}
                                index={props.index}
                                updateGradient={props.updateGradient}
                            />
                        ) : (
                            <HuesPickerControl
                                name={props.name}
                                themeColors={themeColors}
                                enableHues={false}
                                setValue={setValue}
                                gradient={props.gradient}
                            />
                        )}
                    </Popover.Body>
                </Popover.Content>
            </Popover.Root>
            {props.gradient ? (
                <Input
                    width="100px"
                    size="sm"
                    name={props.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        props.gradient
                            ? props.updateGradient!(e.target.value, props.index!)
                            : setValue(props.name, e.target.value)
                    }}
                    value={props.gradientColor}
                />
            ) : (
                <Input
                    width="100px"
                    size="sm"
                    name={props.name}
                    onChange={setValueFromEvent}
                    value={value}
                />
            )}
        </>
    )
}

export default ColorPickerControl
