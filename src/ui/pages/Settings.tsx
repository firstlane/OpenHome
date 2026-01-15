import { BackendContext } from '@openhome-ui/backend/backendContext'
import { AddFolderIcon } from '@openhome-ui/components/Icons'
import useDisplayError from '@openhome-ui/hooks/displayError'
import { AppInfoContext } from '@openhome-ui/state/appInfo'
import { Button, Card, RadioGroup } from '@radix-ui/themes'
import * as E from 'fp-ts/lib/Either'
import { useContext, useEffect } from 'react'

export default function Settings() {
  const [appInfoState, dispatchAppInfoState] = useContext(AppInfoContext)
  const backend = useContext(BackendContext)
  const displayError = useDisplayError()

  useEffect(() => {
    backend.updateSettings(appInfoState.settings).catch(console.error)
  }, [appInfoState.settings, backend])

  // const handleError = useCallback(
  //   (title: string, messages: string | string[]) => {
  //     setError(true)
  //     displayError(title, messages)
  //   },
  //   [displayError]
  // )

  // const setStorageFolder = useCallback(
  //   () =>
  //     backend.pickFolder().then(
  //       E.match(
  //         (err) => handleError('Error picking folder', err),
  //         (dir) => setPendingDirPath(dir)
  //       )
  //     ),
  //   [backend, handleError]
  // )

  return (
    <div>
      <Card style={{ margin: 8, maxWidth: 400 }}>
        <b>Enabled ROM Hack Formats</b>
        <div style={{ margin: 8 }}>
          {appInfoState.extraSaveTypes.map((saveType) => (
            <label className="flex-row" key={saveType.saveTypeName}>
              <input
                type="checkbox"
                onChange={(e) =>
                  dispatchAppInfoState({
                    type: 'set_savetype_enabled',
                    payload: { saveType, enabled: e.target.checked },
                  })
                }
                checked={appInfoState.settings.enabledSaveTypes[saveType.saveTypeID]}
              />
              {saveType.saveTypeName}
            </label>
          ))}
        </div>

        <b>App Theme</b>
        <RadioGroup.Root
          onValueChange={(newValue: 'light' | 'dark' | 'system') => {
            if (!newValue) return
            backend.setTheme(newValue)
            dispatchAppInfoState({ type: 'set_app_theme', payload: newValue })
          }}
          value={appInfoState.settings.appTheme}
          style={{ margin: 8 }}
        >
          <RadioGroup.Item value="system">System</RadioGroup.Item>
          <RadioGroup.Item value="light">Light</RadioGroup.Item>
          <RadioGroup.Item value="dark">Dark</RadioGroup.Item>
        </RadioGroup.Root>

        <b>OpenHome Pokemon Storage Folder</b>
          <Button onClick={() => {
              backend.pickFolder().then(
                E.match(
                  (err) => {
                    displayError("Error changing pokemon storage folder", err)
                  },
                  (folder) => {
                    // TODO: actually change storage directory. Create backups of files before move.
                    displayError("SUCCESS", folder)
                  }
                )
              )
            }}
            variant="solid"
          >
          <AddFolderIcon />
          Set Folder
        </Button>
      </Card>
    </div>
  )
}
