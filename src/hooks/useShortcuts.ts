import useDispatch from './useDispatch'
import { useSelectedComponent } from './useKarmycStore'
import { useHotkeys } from 'react-hotkeys-hook'
import { useOpenChakraUndoRedo } from './useOpenChakraUndoRedo'

const keyMap = {
  DELETE_NODE: 'Backspace, del',
  TOGGLE_BUILDER_MODE: 'b',
  TOGGLE_CODE_PANEL: 'c',
  UNDO: 'ctrl+z, command+z',
  REDO: 'ctrl+y, cmd+y',
  UNSELECT: 'esc',
  PARENT: 'p',
  DUPLICATE: 'ctrl+d, command+d',
  KONAMI_CODE:
    'up up down down left right left right b a, up up down down left right left right B A',
}

const hasNoSpecialKeyPressed = (event: KeyboardEvent | undefined) =>
  !event?.metaKey && !event?.shiftKey && !event?.ctrlKey && !event?.altKey

const useShortcuts = () => {
  const dispatch = useDispatch()
  const selected = useSelectedComponent()
  const { undo: spaceUndo, redo: spaceRedo } = useOpenChakraUndoRedo()

  const deleteNode = (event: KeyboardEvent | undefined) => {
    if (event) {
      event.preventDefault()
    }
    dispatch.components.deleteComponent(selected.id)
  }

  const toggleBuilderMode = (event: KeyboardEvent | undefined) => {
    if (event && hasNoSpecialKeyPressed(event)) {
      event.preventDefault()
      dispatch.app.toggleBuilderMode()
    }
  }

  const toggleCodePanel = (event: KeyboardEvent | undefined) => {
    if (event && hasNoSpecialKeyPressed(event)) {
      event.preventDefault()
      dispatch.app.toggleCodePanel()
    }
  }

  const undo = (event: KeyboardEvent | undefined) => {
    if (event) {
      event.preventDefault()
    }

    spaceUndo()
  }

  const redo = (event: KeyboardEvent | undefined) => {
    if (event) {
      event.preventDefault()
    }

    spaceRedo()
  }

  const onUnselect = () => {
    dispatch.components.unselect()
  }

  const onSelectParent = (event: KeyboardEvent | undefined) => {
    if (event && hasNoSpecialKeyPressed(event)) {
      event.preventDefault()
      dispatch.components.selectParent()
    }
  }

  const onDuplicate = (event: KeyboardEvent | undefined) => {
    if (event) {
      event.preventDefault()
    }

    dispatch.components.duplicate()
  }

  const onKonamiCode = () => {
    dispatch.components.loadDemo('secretchakra')
  }

  useHotkeys(keyMap.DELETE_NODE, deleteNode, {}, [selected.id])
  useHotkeys(keyMap.TOGGLE_BUILDER_MODE, toggleBuilderMode)
  useHotkeys(keyMap.TOGGLE_CODE_PANEL, toggleCodePanel)
  useHotkeys(keyMap.UNDO, undo)
  useHotkeys(keyMap.REDO, redo)
  useHotkeys(keyMap.UNSELECT, onUnselect)
  useHotkeys(keyMap.PARENT, onSelectParent)
  useHotkeys(keyMap.DUPLICATE, onDuplicate)
  useHotkeys(keyMap.KONAMI_CODE, onKonamiCode)
}

export default useShortcuts
