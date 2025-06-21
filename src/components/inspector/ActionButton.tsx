import React from 'react'
import {
    Tooltip,
    IconButtonProps,
    IconButton,
    Icon,
    Spinner,
} from '@chakra-ui/react'

interface Props
    extends Omit<Tooltip.RootProps, 'label' | 'aria-label' | 'children' | 'onClick'> {
    icon: IconButtonProps['children']
    label: string
    as?: IconButtonProps['as']
    isLoading?: boolean
    onClick?: IconButtonProps['onClick']
    colorScheme?: IconButtonProps['colorScheme']
}

const ActionButton = ({
    icon,
    as,
    label,
    onClick,
    colorScheme,
    isLoading,
    ...props
}: Props) => {
    return (
        <Tooltip.Root hasArrow aria-label={label} label={label} zIndex={11} {...props}>
            <IconButton
                variant="ghost"
                loading={isLoading}
                onClick={onClick}
                aria-label={label}
                colorScheme={colorScheme}
                size="xs"
            >
                {isLoading ? (
                    <Spinner />
                ) : (
                    <Icon asChild>
                        {icon}
                    </Icon>
                )}
            </IconButton>
        </Tooltip.Root>
    )
}

export default ActionButton
