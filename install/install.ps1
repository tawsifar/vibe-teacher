# VIBE Teacher installer for Windows (Windows PowerShell 5.1 and PowerShell 7+).
# Copies skills/vibe-teacher into the folders AI coding tools read skills from.
# No admin rights, no symlinks. Read it before running - piping scripts into a shell is a trust decision.
#
#   irm https://raw.githubusercontent.com/tawsifar/vibe-teacher/main/install/install.ps1 | iex
#
# With options (piped):
#   & ([scriptblock]::Create((irm https://raw.githubusercontent.com/tawsifar/vibe-teacher/main/install/install.ps1))) --only claude
# With options (downloaded file):
#   .\install.ps1 --only claude|agents|antigravity
#   .\install.ps1 --project      (install into .\.claude\skills and .\.agents\skills of this folder)
#   .\install.ps1 --uninstall
#   .\install.ps1 --source DIR   (use a local copy of the repo instead of downloading)

function Install-VibeTeacher {
    param([string[]]$Arguments)

    $ErrorActionPreference = 'Stop'
    $Repo = 'tawsifar/vibe-teacher'
    $Branch = 'main'
    if ($env:VIBE_TEACHER_BRANCH) { $Branch = $env:VIBE_TEACHER_BRANCH }
    $Skill = 'vibe-teacher'
    $Only = ''
    $Mode = 'install'
    $Scope = 'global'
    $Source = ''

    $i = 0
    while ($i -lt $Arguments.Count) {
        $a = $Arguments[$i]
        switch ($a) {
            '--only'      { $i++; if ($i -ge $Arguments.Count) { Write-Host 'Oops: --only needs claude, agents or antigravity'; return }; $Only = $Arguments[$i] }
            '--project'   { $Scope = 'project' }
            '--uninstall' { $Mode = 'uninstall' }
            '--source'    { $i++; if ($i -ge $Arguments.Count) { Write-Host 'Oops: --source needs a folder'; return }; $Source = $Arguments[$i] }
            '--help'      { Write-Host 'Options: --only claude|agents|antigravity, --project, --uninstall, --source DIR'; return }
            default       { Write-Host "Oops: unknown option '$a' (try --help)"; return }
        }
        $i++
    }
    if (@('', 'claude', 'agents', 'antigravity') -notcontains $Only) {
        Write-Host 'Oops: --only must be claude, agents or antigravity'
        return
    }

    # Home folder: USERPROFILE on Windows, HOME elsewhere (PowerShell 7 on macOS/Linux).
    $UserHome = $env:USERPROFILE
    if (-not $UserHome) { $UserHome = $HOME }

    $Targets = @()
    if ($Scope -eq 'project') {
        $here = (Get-Location).Path
        if ($Only -eq '' -or $Only -eq 'claude') { $Targets += (Join-Path $here '.claude\skills') }
        if ($Only -eq '' -or $Only -eq 'agents' -or $Only -eq 'antigravity') { $Targets += (Join-Path $here '.agents\skills') }
    } else {
        if ($Only -eq '' -or $Only -eq 'claude') { $Targets += (Join-Path $UserHome '.claude\skills') }
        if ($Only -eq '' -or $Only -eq 'agents') { $Targets += (Join-Path $UserHome '.agents\skills') }
        if ($Only -eq '' -or $Only -eq 'antigravity') {
            $Targets += (Join-Path $UserHome '.gemini\config\skills')
            $Targets += (Join-Path $UserHome '.gemini\antigravity\skills')
        }
    }

    if ($Mode -eq 'uninstall') {
        Write-Host 'Removing VIBE Teacher...'
        foreach ($t in $Targets) {
            $dest = Join-Path $t $Skill
            if (Test-Path $dest) { Remove-Item -Recurse -Force $dest; Write-Host "  removed  $dest" }
            if (Test-Path "$dest.bak") { Write-Host "  (kept backup $dest.bak - delete it if you don't need it)" }
        }
        Write-Host 'Done. Restart your AI tool.'
        return
    }

    $tmp = $null
    try {
        if ($Source) {
            $src = Join-Path (Resolve-Path $Source).Path "skills\$Skill"
        } else {
            $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("vibe-teacher-" + [System.Guid]::NewGuid().ToString('N'))
            New-Item -ItemType Directory -Force $tmp | Out-Null
            $zip = Join-Path $tmp 'repo.zip'
            $zipUrl = "https://github.com/$Repo/archive/refs/heads/$Branch.zip"
            Write-Host "Downloading VIBE Teacher from github.com/$Repo ..."
            $downloaded = $false
            try {
                [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
                $oldProgress = $ProgressPreference
                $ProgressPreference = 'SilentlyContinue'
                Invoke-WebRequest -Uri $zipUrl -OutFile $zip -UseBasicParsing
                $ProgressPreference = $oldProgress
                Expand-Archive -Path $zip -DestinationPath $tmp -Force
                $downloaded = $true
            } catch {
                Write-Host "Download failed ($($_.Exception.Message)). Trying git..."
            }
            if (-not $downloaded) {
                if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
                    Write-Host 'Oops: could not download, and git is not installed. Check your internet connection and try again.'
                    return
                }
                & git clone --quiet --depth 1 --branch $Branch "https://github.com/$Repo.git" (Join-Path $tmp 'repo')
            }
            $skillFile = Get-ChildItem -Path $tmp -Recurse -Filter 'SKILL.md' |
                Where-Object { $_.Directory.Name -eq $Skill -and $_.Directory.Parent.Name -eq 'skills' } |
                Select-Object -First 1
            if (-not $skillFile) { Write-Host "Oops: could not find skills\$Skill\SKILL.md in the download."; return }
            $src = $skillFile.Directory.FullName
        }

        if (-not (Test-Path (Join-Path $src 'SKILL.md'))) { Write-Host "Oops: $src has no SKILL.md"; return }

        Write-Host 'Installing VIBE Teacher...'
        foreach ($t in $Targets) {
            New-Item -ItemType Directory -Force $t | Out-Null
            $dest = Join-Path $t $Skill
            if (Test-Path $dest) {
                if (Test-Path "$dest.bak") { Remove-Item -Recurse -Force "$dest.bak" }
                Move-Item $dest "$dest.bak"
            }
            Copy-Item -Recurse -Force $src $dest
            Write-Host "  installed  $dest"
        }

        Write-Host ''
        Write-Host "All set! VIBE Teacher is installed in $($Targets.Count) place(s)."
        Write-Host 'Restart your AI tool, then type:  vibe teacher'
        Write-Host '(Claude Code: /vibe-teacher   Codex: $vibe-teacher   Others: just ask "vibe teacher, give me a tour")'
    } finally {
        if ($tmp -and (Test-Path $tmp)) { Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }
    }
}

$vibeArgs = @($args)
if ($vibeArgs.Count -eq 0 -and $env:VIBE_TEACHER_ARGS) { $vibeArgs = $env:VIBE_TEACHER_ARGS -split '\s+' }
Install-VibeTeacher -Arguments $vibeArgs
