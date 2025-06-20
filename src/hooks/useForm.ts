import { ChangeEvent, useCallback } from 'react'
import useDispatch from './useDispatch'
import { useSelectedComponentId } from './useKarmycStore'

export const useForm = () => {
  const dispatch = useDispatch()
  const componentId = useSelectedComponentId()

  const setValueFromEvent = ({
    target: { name, value },
  }: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setValue(name, value)
  }

  const setValue = useCallback(
    (name: string, value: any) => {
      dispatch.components.updateProps({
        id: componentId,
        name,
        value,
      })
    },
    [componentId, dispatch.components],
  )

  return { setValue, setValueFromEvent }
}
