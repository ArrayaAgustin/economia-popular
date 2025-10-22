# Configuración para certificados autofirmados
$domain = "localhost.cba.gov.ar"
$certsDir = ".\certs"
$keyFile = "$certsDir\localhost-key.pem"
$certFile = "$certsDir\localhost.pem"

# Asegurarse de que el directorio existe
if (-not (Test-Path $certsDir)) {
    New-Item -ItemType Directory -Force -Path $certsDir
}

# Generar clave privada
openssl genrsa -out $keyFile 2048

# Generar certificado
openssl req -new -x509 -key $keyFile -out $certFile -days 365 -subj "/CN=$domain" -addext "subjectAltName=DNS:$domain,DNS:localhost,IP:127.0.0.1"

Write-Host "Certificados generados en: $certsDir"
Write-Host "Key file: $keyFile"
Write-Host "Certificate file: $certFile"
Write-Host ""
Write-Host "IMPORTANTE: Para que los navegadores confíen en este certificado, deberás añadirlo a tu almacén de certificados confiables."
