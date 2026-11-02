Add-Type -AssemblyName System.Drawing

function Generate-LogoBitmap([int]$size) {
    $bmp = [System.Drawing.Bitmap]::new($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::Transparent)

    $s = [double]$size / 36.0

    $brushBg = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 14, 16, 19))
    $penBorder = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 45, 51, 63), [float][Math]::Max(1.0, 1.2 * $s))

    $r = [float](8.0 * $s)
    $d = [float]($r * 2.0)
    $w = [float]($size - 2)
    $h = [float]($size - 2)

    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $path.AddArc([float]1, [float]1, $d, $d, 180, 90)
    $path.AddArc([float](1 + $w - $d), [float]1, $d, $d, 270, 90)
    $path.AddArc([float](1 + $w - $d), [float](1 + $h - $d), $d, $d, 0, 90)
    $path.AddArc([float]1, [float](1 + $h - $d), $d, $d, 90, 90)
    $path.CloseFigure()

    $g.FillPath($brushBg, $path)
    $g.DrawPath($penBorder, $path)

    $strokeW = [float][Math]::Max(2.0, 3.4 * $s)

    # Letter 'V' (Luminous Cyan #38BDF8)
    $penV = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 56, 189, 248), $strokeW)
    $penV.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penV.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penV.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $ptsV = @(
        [System.Drawing.PointF]::new([float](8.5 * $s), [float](11.5 * $s)),
        [System.Drawing.PointF]::new([float](14.5 * $s), [float](24.5 * $s)),
        [System.Drawing.PointF]::new([float](20.5 * $s), [float](11.5 * $s))
    )
    $g.DrawLines($penV, $ptsV)

    # Letter 'C' (Blaze Orange #FF6B00)
    $penC = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 255, 107, 0), $strokeW)
    $penC.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penC.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penC.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $pathC = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $pathC.AddBezier(
        [float](28.5 * $s), [float](12.5 * $s),
        [float](25.0 * $s), [float](10.5 * $s),
        [float](21.0 * $s), [float](12.2 * $s),
        [float](18.5 * $s), [float](15.0 * $s)
    )
    $pathC.AddBezier(
        [float](18.5 * $s), [float](15.0 * $s),
        [float](16.8 * $s), [float](17.5 * $s),
        [float](17.5 * $s), [float](20.5 * $s),
        [float](19.5 * $s), [float](23.0 * $s)
    )
    $pathC.AddBezier(
        [float](19.5 * $s), [float](23.0 * $s),
        [float](21.5 * $s), [float](25.5 * $s),
        [float](25.5 * $s), [float](24.8 * $s),
        [float](28.5 * $s), [float](23.0 * $s)
    )
    $g.DrawPath($penC, $pathC)

    # Accent Dot (#38BDF8)
    $dotR = [float][Math]::Max(1.0, 1.4 * $s)
    $brushDot = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
    $g.FillEllipse($brushDot, [float](20.8 * $s - $dotR), [float](18.0 * $s - $dotR), [float]($dotR * 2.0), [float]($dotR * 2.0))

    $g.Dispose()
    return $bmp
}

# 1. Generate 32x32 bitmap for standard favicon.ico
$bmp32 = Generate-LogoBitmap 32
$hIcon = $bmp32.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)

# Save to src/app/favicon.ico
$fsApp = [System.IO.File]::Create("d:\portfolio\src\app\favicon.ico")
$icon.Save($fsApp)
$fsApp.Close()

# Save to public/favicon.ico
$fsPub = [System.IO.File]::Create("d:\portfolio\public\favicon.ico")
$icon.Save($fsPub)
$fsPub.Close()

# 2. Generate high-res 180x180 for apple-touch-icon.png
$bmp180 = Generate-LogoBitmap 180
$bmp180.Save("d:\portfolio\public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 3. Clean up
$icon.Dispose()
$bmp32.Dispose()
$bmp180.Dispose()

Write-Host "ALL ICONS GENERATED SUCCESSFULLY"
