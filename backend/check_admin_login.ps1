$body = '{"email":"admin@lumera.com","password":"Admin@123"}'
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/admin/login' -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing
    Write-Output $response.StatusCode.value__
    Write-Output $response.Content
} catch {
    $err = $_.Exception
    if ($err.Response -ne $null) {
        $reader = New-Object System.IO.StreamReader($err.Response.GetResponseStream())
        Write-Output $err.Response.StatusCode.Value__
        Write-Output $reader.ReadToEnd()
    } else {
        Write-Output $err.Message
    }
}
