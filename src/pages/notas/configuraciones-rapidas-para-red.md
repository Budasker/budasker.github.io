---
layout: ../../layouts/WriteupLayout.astro
title: "Mejoras Básicas y Hardening para tu Red Wi-Fi"
date: "2026-10-17"
category: "Redes & Infraestructura"
description: "Guía técnica de optimización y hardening para redes inalámbricas domésticas: mitigación de interferencias, selección de canales limpios, desactivación de WPS y filtrado DNS defensivo."
tags: ["Redes", "Wi-Fi", "Hardening", "WPA3", "DNS", "Seguridad", "Linux"]
backLink: "/#writeups"
backText: "<- Volver a ~/Writeups"
---

La mayoría de los enrutadores domésticos entregados por los proveedores de servicios de internet (ISP) vienen configurados de fábrica con parámetros genéricos pensados exclusivamente para facilitar la instalación rápida, sacrificando tanto la estabilidad del enlace inalámbrico como la seguridad perimetral de los dispositivos conectados.

En esta guía documento un conjunto de ajustes técnicos esenciales que puedes aplicar en cualquier router o punto de acceso (AP) —ya sea con firmware comercial o libre como **OpenWrt**— para maximizar el rendimiento, reducir la latencia y cerrar los vectores de intrusión más comunes en redes Wi-Fi.

---

## 1. Análisis del Espectro Radioeléctrico y Canales Limpios

El problema más frecuente en entornos urbanos saturados es la **interferencia co-canal**, originada cuando múltiples routers emiten en frecuencias superpuestas.

### Banda de 2.4 GHz: La regla de los canales no solapados
En la banda de 2.4 GHz, cada canal tiene un ancho estándar de 20 MHz, pero están separados entre sí por apenas 5 MHz. Esto significa que canales contiguos como el 2, 3 o 4 interfieren destructivamente con el canal 1.

* **Los únicos tres canales independientes y no superpuestos son: `1`, `6` y `11`.**
* **Acción requerida:** Fija manualmente el canal en el valor menos ocupado entre `1`, `6` y `11`. Nunca uses el modo "Automático", ya que muchos enrutadores terminan seleccionando canales solapados (como el 3 o el 9).
* **Ancho de canal (*Channel Width*):** Mantén estrictamente **20 MHz** en 2.4 GHz. Forzar 40 MHz duplica la superficie de colisiones y genera mayor degradación que beneficio.

### Banda de 5 GHz: Velocidad sin colisiones
La banda de 5 GHz ofrece mayor cantidad de canales que no se solapan y menor atenuación por obstáculos de baja densidad.

* **Ancho recomendado:** **80 MHz** para el equilibrio ideal entre tasa de transferencia y sensibilidad al ruido.
* **Canales recomendados:** Canales estándar UNII-1 (36, 40, 44, 48) para evitar desconexiones provocadas por radares meteorológicos (canales DFS).

### Diagnóstico desde la terminal de Linux
Puedes auditar las redes vecinas y sus canales sin instalar aplicaciones de terceros mediante `iw`:

```bash
# Identificar la interfaz inalámbrica
ip link

# Escanear el espectro y filtrar SSID y canal
sudo iw dev wlan0 scan | grep -E "(SSID|primary channel)"
```

---

## 2. Hardening Criptográfico del Punto de Acceso

Muchos routers aún mantienen activos protocolos y funciones obsoletas que comprometen la red en cuestión de segundos:

### 1. Desactivar inmediatamente WPS (*Wi-Fi Protected Setup*)
WPS permite conectar dispositivos mediante un PIN de 8 dígitos. Debido a una falla fundamental en el diseño del protocolo, el router valida el PIN en dos mitades independientes, reduciendo el espacio de búsqueda a tan solo $10^4 + 10^3 = 11{,}000$ combinaciones. Herramientas automatizadas como `reaver` o ataques *Pixie Dust* pueden vulnerar una red protegida por WPS en menos de 5 minutos, sin importar la complejidad de la contraseña WPA2.

* **Acción:** Entra al panel de administración y desmarca por completo la opción **WPS / QSS**.

### 2. Migrar a WPA2-AES (CCMP) o WPA3-SAE
* **Prohibido:** WPA/TKIP o modos mixtos antiguos. TKIP utiliza el algoritmo RC4 y es susceptible a inyección de paquetes.
* **Estándar sólido:** **WPA2-PSK (AES/CCMP)** con una contraseña de al menos 16 caracteres generada aleatoriamente.
* **Óptimo:** Si tus dispositivos lo soportan, activa **WPA3-Personal (SAE)**. El protocolo *Simultaneous Authentication of Equals* (SAE) previene los ataques de diccionario fuera de línea (*offline dictionary attacks*) y garantiza secreto perfecto hacia adelante (*Forward Secrecy*).

---

## 3. Segmentación: La Red de Invitados como DMZ de IoT

Los dispositivos del Internet de las Cosas (Smart TVs, cámaras IP, bombillas inteligentes, enchufes Wi-Fi) rara vez reciben actualizaciones de seguridad de sus fabricantes y suelen contar con vulnerabilidades críticas en sus firmwares.

Si una cámara IP conectada a tu red principal es comprometida, el atacante puede realizar un escaneo lateral (`nmap`, `arp-scan`) para atacar tu estación de trabajo, servidores locales o almacenamiento NAS.

### Medida de contención:
1. Activa la función de **Red de Invitados (*Guest Network*)**.
2. Asegúrate de que la casilla **Aislamiento de Clientes (*Client Isolation / AP Isolation*)** esté habilitada.
3. Conecta todos los dispositivos domóticos y de visitas a esta red secundaria. De este modo, aunque un dispositivo IoT sea infectado, el router bloqueará cualquier intento de comunicación hacia tu red de trabajo.

---

## 4. Filtrado DNS Defensivo y Mitigación de Rastreadores

El router asigna por defecto los servidores DNS de tu proveedor de internet (ISP), los cuales no filtran dominios maliciosos y suelen registrar todo tu historial de navegación para fines comerciales.

Configurar resolución DNS defensiva a nivel de enrutador protege a **todos** los dispositivos de la casa sin necesidad de instalar software en cada cliente:

| Proveedor | Dirección IP Primaria | Dirección IP Secundaria | Perfil de Seguridad |
| :--- | :--- | :--- | :--- |
| **Quad9 (Recomendado)** | `9.9.9.9` | `149.112.112.112` | Bloqueo estricto de malware, phishing y dominios C2 (*Command & Control*). Cero registro de IP. |
| **Cloudflare Security** | `1.1.1.2` | `1.0.0.2` | Filtrado automatizado de malware con la menor latencia de resolución global. |
| **NextDNS** | Personalizado | Personalizado | Control granular de listas de bloqueo (AdGuard, EasyList, telemetría de Smart TVs). |

### Verificación de resolución desde Linux:

```bash
# Consultar el resolvedor actual y medir tiempo de respuesta
dig @9.9.9.9 budasker.github.io +stats | grep "Query time"
```

---

## 5. Control de Cobertura y Potencia de Transmisión (*Tx Power*)

Un error común es configurar la potencia de transmisión de las antenas al 100% (*High* / 30 dBm). 
* Una potencia excesiva no aumenta la velocidad de subida de tu teléfono hacia el router (la antena del móvil sigue teniendo poca potencia de emisión), pero sí incrementa la distorsión del amplificador del router y **extiende la señal de tu red cientos de metros hacia la calle**, atrayendo intentos de autenticación no autorizados.
* **Recomendación:** Ajusta la potencia a **Media (*Medium* o 15-18 dBm)**. La red debe cubrir el perímetro de tu vivienda, no la acera de enfrente.

---

## Resumen del Checklist de Hardening

1. [x] Canal fijo en 2.4 GHz (`1`, `6` o `11`) con ancho estricto de `20 MHz`.
2. [x] WPS desactivado de forma permanente.
3. [x] Modo de cifrado configurado en WPA2-AES o WPA3-SAE.
4. [x] Dispositivos IoT aislados en la red de invitados con Client Isolation.
5. [x] Servidores DNS configurados con filtrado de malware (Quad9 / Cloudflare Security).
6. [x] Contraseña de administración del router cambiada y acceso WAN remoto deshabilitado.

Aplicar estos pasos toma menos de 15 minutos en cualquier interfaz web y transforma una red hogareña vulnerable en una infraestructura inalámbrica estable, rápida y protegida contra las amenazas más comunes.
