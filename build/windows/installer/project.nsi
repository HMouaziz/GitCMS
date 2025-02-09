Unicode true

####
## Please note: Template replacements don't work in this file. They are provided with default defines like
## mentioned underneath.
## If the keyword is not defined, "wails_tools.nsh" will populate them with the values from ProjectInfo.
## If they are defined here, "wails_tools.nsh" will not touch them. This allows to use this project.nsi manually
## from outside of Wails for debugging and development of the installer.
##
## For development first make a wails nsis build to populate the "wails_tools.nsh":
## > wails build --target windows/amd64 --nsis
## Then you can call makensis on this file with specifying the path to your binary:
## For a AMD64 only installer:
## > makensis -DARG_WAILS_AMD64_BINARY=..\..\bin\app.exe
## For a ARM64 only installer:
## > makensis -DARG_WAILS_ARM64_BINARY=..\..\bin\app.exe
## For a installer with both architectures:
## > makensis -DARG_WAILS_AMD64_BINARY=..\..\bin\app-amd64.exe -DARG_WAILS_ARM64_BINARY=..\..\bin\app-arm64.exe
####
## The following information is taken from the ProjectInfo file, but they can be overwritten here.
####
## !define INFO_PROJECTNAME    "MyProject" # Default "{{.Name}}"
## !define INFO_COMPANYNAME    "MyCompany" # Default "{{.Info.CompanyName}}"
## !define INFO_PRODUCTNAME    "MyProduct" # Default "{{.Info.ProductName}}"
## !define INFO_PRODUCTVERSION "1.0.0"     # Default "{{.Info.ProductVersion}}"
## !define INFO_COPYRIGHT      "Copyright" # Default "{{.Info.Copyright}}"
###
## !define PRODUCT_EXECUTABLE  "Application.exe"      # Default "${INFO_PROJECTNAME}.exe"
## !define UNINST_KEY_NAME     "UninstKeyInRegistry"  # Default "${INFO_COMPANYNAME}${INFO_PRODUCTNAME}"
####
## !define REQUEST_EXECUTION_LEVEL "admin"            # Default "admin"  see also https://nsis.sourceforge.io/Docs/Chapter4.html
####
## Include the wails tools
####
!include "wails_tools.nsh"
!include "nsDialogs.nsh"
!include "WinMessages.nsh"
!include "LogicLib.nsh"

Var GitPage
Var GitHeader
Var GitLabel

Var SSHPage
Var SSHHeader
Var SSHLabel

# The version information for this two must consist of 4 parts
VIProductVersion "${INFO_PRODUCTVERSION}.0"
VIFileVersion    "${INFO_PRODUCTVERSION}.0"

VIAddVersionKey "CompanyName"     "${INFO_COMPANYNAME}"
VIAddVersionKey "FileDescription" "${INFO_PRODUCTNAME} Installer"
VIAddVersionKey "ProductVersion"  "${INFO_PRODUCTVERSION}"
VIAddVersionKey "FileVersion"     "${INFO_PRODUCTVERSION}"
VIAddVersionKey "LegalCopyright"  "${INFO_COPYRIGHT}"
VIAddVersionKey "ProductName"     "${INFO_PRODUCTNAME}"

# Enable HiDPI support. https://nsis.sourceforge.io/Reference/ManifestDPIAware
ManifestDPIAware true

!include "MUI.nsh"

!define MUI_ICON "..\icon.ico"
!define MUI_UNICON "..\icon.ico"
!define MUI_WELCOMEPAGE_TEXT "Welcome to the GitCMS Installer$\r$\n$\r$\n\ GitCMS is a Git-based Content Management System that requires:$\r$\n\ - Git for version control$\r$\n\ - OpenSSH for secure repository access$\r$\n$\r$\n\ The setup will check your system for these dependencies and help you install them if needed.$\r$\n$\r$\n\ Click Next to begin the installation."
# !define MUI_WELCOMEFINISHPAGE_BITMAP "resources\leftimage.bmp" #Include this to add a bitmap on the left side of the Welcome Page. Must be a size of 164x314
!define MUI_FINISHPAGE_NOAUTOCLOSE # Wait on the INSTFILES page so the user can take a look into the details of the installation steps
!define MUI_ABORTWARNING # This will warn the user if they exit from the installer.

!insertmacro MUI_PAGE_WELCOME # Welcome to the installer page.
Page custom GitCheckPage LeaveGitCheckPage
Page custom SSHCheckPage LeaveSSHCheckPage
# !insertmacro MUI_PAGE_LICENSE "resources\eula.txt" # Adds a EULA page to the installer
!insertmacro MUI_PAGE_DIRECTORY # In which folder install page.
!insertmacro MUI_PAGE_INSTFILES # Installing page.
!insertmacro MUI_PAGE_FINISH # Finished installation page.

!insertmacro MUI_UNPAGE_INSTFILES # Uinstalling page

!insertmacro MUI_LANGUAGE "English" # Set the Language of the installer

## The following two statements can be used to sign the installer and the uninstaller. The path to the binaries are provided in %1
#!uninstfinalize 'signtool --file "%1"'
#!finalize 'signtool --file "%1"'

Name "${INFO_PRODUCTNAME}"
OutFile "..\..\bin\${INFO_PROJECTNAME}-${ARCH}-installer.exe" # Name of the installer's file.
InstallDir "$PROGRAMFILES64\${INFO_COMPANYNAME}\${INFO_PRODUCTNAME}" # Default installing folder ($PROGRAMFILES is Program Files folder).
ShowInstDetails show # This will always show the installation details.

Function GitCheckPage
    nsDialogs::Create 1018
    Pop $GitPage
    
    ${If} $GitPage == error
        Abort
    ${EndIf}

    ; Header
    ${NSD_CreateLabel} 0 0 100% 30u "Git Installation Check"
    Pop $GitHeader
    CreateFont $1 "$(^Font)" "12" "700"
    SendMessage $GitHeader ${WM_SETFONT} $1 1

    ; Status label with more detailed info
    ${NSD_CreateLabel} 10u 40u 90% 60u "The installer will now check if Git is installed on your system.$\n$\nGit is required for version control functionality."
    Pop $GitLabel

    nsDialogs::Show
FunctionEnd

Function LeaveGitCheckPage
    ; Actually perform the Git check
    ${NSD_SetText} $GitLabel "Checking Git version..."
    
    nsExec::ExecToStack 'powershell -Command "& {git --version}"'
    Pop $R0  ; Exit code
    Pop $R1  ; Git version output
    
    ${If} $R0 == "0"
        ${NSD_SetText} $GitLabel "Git is installed: $R1"
        MessageBox MB_OK|MB_ICONINFORMATION "Git is already installed: $R1"
    ${Else}
        ${NSD_SetText} $GitLabel "Git is not installed"
        
        MessageBox MB_YESNO|MB_ICONQUESTION "Git is required. Would you like to install it now?" IDYES DoInstallGit
        MessageBox MB_ICONSTOP "Installation Aborted: Git is required to continue."
        Abort
        
        DoInstallGit:
            ${NSD_SetText} $GitLabel "Installing Git..."
            nsExec::ExecToStack "cmd /c winget install --id Git.Git -e --silent"
            Pop $R0
            ${If} $R0 != 0
                MessageBox MB_RETRYCANCEL "Git installation failed. Retry?" IDRETRY DoInstallGit
                MessageBox MB_ICONSTOP "Installation aborted: Failed to install Git."
                Abort
            ${EndIf}
            MessageBox MB_OK|MB_ICONINFORMATION "Git has been successfully installed."
    ${EndIf}
FunctionEnd

Function SSHCheckPage
    nsDialogs::Create 1018
    Pop $SSHPage
    
    ${If} $SSHPage == error
        Abort
    ${EndIf}

    ; Header
    ${NSD_CreateLabel} 0 0 100% 30u "OpenSSH Installation Check"
    Pop $SSHHeader
    CreateFont $1 "$(^Font)" "12" "700"
    SendMessage $SSHHeader ${WM_SETFONT} $1 1

    ; Status label with more detailed info
    ${NSD_CreateLabel} 10u 40u 90% 60u "The installer will now check if OpenSSH is installed on your system.$\n$\nOpenSSH is required for secure repository access."
    Pop $SSHLabel

    nsDialogs::Show
FunctionEnd

Function LeaveSSHCheckPage
    ; Perform the OpenSSH check
    ${NSD_SetText} $SSHLabel "Checking OpenSSH service..."
    
    nsExec::ExecToStack 'powershell -Command "& {Get-Service ssh-agent -ErrorAction SilentlyContinue}"'
    Pop $R0  ; Exit code
    Pop $R1  ; Service status output
    
    ${If} $R0 == "0"
        ${NSD_SetText} $SSHLabel "OpenSSH is installed and running"
        MessageBox MB_OK|MB_ICONINFORMATION "OpenSSH is already installed and configured."
    ${Else}
        ${NSD_SetText} $SSHLabel "OpenSSH is not installed"
        
        MessageBox MB_YESNO|MB_ICONQUESTION "OpenSSH is required. Would you like to install it now?" IDYES DoInstallSSH
        MessageBox MB_ICONSTOP "Installation Aborted: OpenSSH is required to continue."
        Abort
        
        DoInstallSSH:
            ${NSD_SetText} $SSHLabel "Installing OpenSSH..."
            nsExec::ExecToStack "powershell -Command Add-WindowsFeature -Name OpenSSH-Client"
            Pop $R0
            ${If} $R0 != 0
                MessageBox MB_ICONSTOP "Failed to install OpenSSH. Please install it manually."
                Abort
            ${EndIf}
            nsExec::ExecToStack "powershell -Command Start-Service ssh-agent"
            SetRebootFlag true
            MessageBox MB_OK|MB_ICONINFORMATION "OpenSSH has been successfully installed."
    ${EndIf}
FunctionEnd

Function .onInit
    !insertmacro wails.checkArchitecture
    
    # Check if running as admin
    UserInfo::GetAccountType
    Pop $0
    ${If} $0 != "admin"
        MessageBox MB_ICONSTOP "Administrator rights required!"
        SetErrorLevel 740 ; ERROR_ELEVATION_REQUIRED
        Quit
    ${EndIf}
FunctionEnd

Section
    !insertmacro wails.setShellContext

    !insertmacro wails.webview2runtime

    SetOutPath $INSTDIR

    !insertmacro wails.files

    CreateShortcut "$SMPROGRAMS\${INFO_PRODUCTNAME}.lnk" "$INSTDIR\${PRODUCT_EXECUTABLE}"
    CreateShortCut "$DESKTOP\${INFO_PRODUCTNAME}.lnk" "$INSTDIR\${PRODUCT_EXECUTABLE}"

    !insertmacro wails.associateFiles
    !insertmacro wails.associateCustomProtocols

    !insertmacro wails.writeUninstaller
SectionEnd

Section "uninstall"
    !insertmacro wails.setShellContext

    RMDir /r "$AppData\${PRODUCT_EXECUTABLE}" # Remove the WebView2 DataPath

    RMDir /r $INSTDIR

    Delete "$SMPROGRAMS\${INFO_PRODUCTNAME}.lnk"
    Delete "$DESKTOP\${INFO_PRODUCTNAME}.lnk"

    !insertmacro wails.unassociateFiles
    !insertmacro wails.unassociateCustomProtocols

    !insertmacro wails.deleteUninstaller
SectionEnd
