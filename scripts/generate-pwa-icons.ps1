Add-Type -AssemblyName System.Drawing

function New-RoundedRectanglePath {
  param(
    [System.Drawing.RectangleF]$Rectangle,
    [single]$Radius
  )

  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $Radius * 2
  $path.AddArc($Rectangle.X, $Rectangle.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rectangle.Right - $diameter, $Rectangle.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($Rectangle.Right - $diameter, $Rectangle.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($Rectangle.X, $Rectangle.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-AdecPwaIcon {
  param(
    [int]$Size,
    [string]$OutputPath,
    [switch]$Maskable
  )

  $bitmap = [System.Drawing.Bitmap]::new($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.Color]::FromArgb(19, 155, 215))

  $inset = if ($Maskable) { 0.20 } else { 0.10 }
  $card = [System.Drawing.RectangleF]::new($Size * $inset, $Size * $inset, $Size * (1 - (2 * $inset)), $Size * (1 - (2 * $inset)))
  $cardPath = New-RoundedRectanglePath -Rectangle $card -Radius ($Size * 0.10)
  $graphics.FillPath([System.Drawing.Brushes]::White, $cardPath)
  $cardPath.Dispose()

  $fontSize = $Size * $(if ($Maskable) { 0.19 } else { 0.24 })
  $font = [System.Drawing.Font]::new('Arial', $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $textBounds = [System.Drawing.RectangleF]::new($Size * 0.16, $Size * 0.28, $Size * 0.68, $Size * 0.42)
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $brandBlue = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(19, 155, 215))
  $graphics.DrawString('Adec', $font, $brandBlue, $textBounds, $format)

  $swooshPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(148, 163, 184), $Size * 0.018)
  $swooshPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $swooshPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawBezier($swooshPen, $Size * 0.24, $Size * 0.70, $Size * 0.42, $Size * 0.77, $Size * 0.62, $Size * 0.68, $Size * 0.78, $Size * 0.58)

  $accentPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(234, 88, 12), $Size * 0.018)
  $accentPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $accentPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawBezier($accentPen, $Size * 0.38, $Size * 0.70, $Size * 0.43, $Size * 0.68, $Size * 0.48, $Size * 0.69, $Size * 0.53, $Size * 0.70)

  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $accentPen.Dispose()
  $swooshPen.Dispose()
  $brandBlue.Dispose()
  $format.Dispose()
  $font.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

New-AdecPwaIcon -Size 192 -OutputPath 'public/pwa-192x192.png'
New-AdecPwaIcon -Size 512 -OutputPath 'public/pwa-512x512.png'
New-AdecPwaIcon -Size 512 -OutputPath 'public/pwa-512x512-maskable.png' -Maskable
New-AdecPwaIcon -Size 180 -OutputPath 'public/apple-touch-icon.png'
