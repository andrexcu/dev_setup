$defaultPath = "D:\projects"

if (
    -not $env:VSCODE_PID -and
    $PWD.Path -eq "C:\Windows\System32" -and
    (Test-Path $defaultPath)
) {
    Set-Location $defaultPath
}

Clear-Host
Remove-Item Alias:ls -Force
function l { lsd @args }
function ls { lsd -l @args }
function la { lsd -a @args }
function lla { lsd -la @args }
function lt { lsd --tree @args }

oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/catppuccin_macchiato_custom.omp.json" | Invoke-Expression
