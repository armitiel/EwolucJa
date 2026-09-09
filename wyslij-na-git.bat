@echo off
chcp 65001 >nul
setlocal

rem ===========================================================================
rem  PRZEKIEROWANIE. Prawdziwa logika wysylki stoi JEDEN raz, wspolnie dla
rem  wszystkich projektow:  %USERPROFILE%\Narzedzia\wyslij-na-git.bat
rem
rem  Dlaczego nie kopia w kazdym repo: bo tak bylo wczesniej i poprawki sie
rem  rozjezdzaly. Push wiszacy na Git Credential Managerze naprawiono tutaj,
rem  a MuralPilot dalej wisial, bo mial wlasna, starsza kopie tego samego pliku.
rem  Ten plik zostaje w repo tylko po to, zeby "wyslij-na-git" dzialalo takze
rem  z wnetrza projektu, nie tylko z pulpitu.
rem ===========================================================================

set WSPOLNY=%USERPROFILE%\Narzedzia\wyslij-na-git.bat

if not exist "%WSPOLNY%" (
  echo.
  echo  [BLAD] Nie ma wspolnego skryptu wysylki:
  echo    %WSPOLNY%
  echo.
  echo  To jest narzedzie z tej maszyny, a nie czesc projektu. Na nowym
  echo  komputerze wysylaj recznie:  git add -u ^&^& git commit ^&^& git push
  echo.
  pause
  goto :eof
)

call "%WSPOLNY%" "%~dp0."
endlocal
