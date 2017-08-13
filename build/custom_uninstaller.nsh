!macro customUnInstall
  # MessageBox MB_OK "customUnInstall"
!macroend

!macro customInstall
  # MessageBox MB_OK "customInstall"
!macroend

!macro customInit
  # incase we are installing and service is already running from previous install
  nsExec::Exec '"$INSTDIR\resources\app\service\service-uninstall-full.bat"'
  # MessageBox MB_OK "customInit, done uninstall"
!macroend

!macro preInit
  # MessageBox MB_OK "preInit"
!macroend

!macro customUnInit
  # incase we are uninstalling and service is running
  nsExec::Exec '"$INSTDIR\resources\app\service\service-uninstall-full.bat"'
  # MessageBox MB_OK "customUnInit"
!macroend

!macro customRemoveFiles
  # MessageBox MB_OK "customRemoveFiles"
!macroend
