---
layout: ../../layouts/WriteupLayout.astro
title: "Guía Completa de Instalación de Custom ROMs en Dispositivos Snapdragon"
date: "2026-04-14"
category: "Android & Modding"
description: "Manual técnico exhaustivo sobre cómo liberar el bootloader, preparar el entorno en Linux, entender la arquitectura de particiones, flashear un Custom Recovery e instalar una Custom ROM paso a paso sin riesgos de brickeo."
tags: ["Android", "Custom ROM", "Snapdragon", "PixelOS", "Evolution X", "LineageOS", "ADB", "Fastboot", "Linux"]
---

A medida que pasa el tiempo, muchos teléfonos móviles sufren una degradación artificial de rendimiento debido a las actualizaciones pesadas de las capas de personalización de fábrica (como MIUI, HyperOS, One UI o ColorOS), llenas de telemetría, publicidad y procesos en segundo plano (*bloatware*). Sin embargo, el hardware físico —especialmente en terminales con procesadores **Qualcomm Snapdragon**— suele tener potencia de sobra para seguir funcionando de manera fluida durante muchos años más.

La solución definitiva a esta obsolescencia es reemplazar el sistema operativo de fábrica por una **Custom ROM** basada en **AOSP** (*Android Open Source Project*), logrando un sistema limpio, seguro, actualizado a las últimas versiones de Android y con una gestión de batería y memoria RAM muy superior.

En esta guía documento el procedimiento técnico completo de principio a fin, explicando qué ocurre a bajo nivel en cada etapa y cómo ejecutarlo desde una estación de trabajo **Linux**.

---

## 1. Conceptos Fundamentales y Hardware Recomendado

Antes de tocar un solo comando en la terminal, es indispensable comprender las piezas que componen el arranque de un dispositivo Android:

* **Bootloader (Gestor de arranque):** Es el primer código que ejecuta el procesador al presionar el botón de encendido. Su función es verificar la firma criptográfica del kernel y del sistema operativo antes de iniciarlos. De fábrica viene **bloqueado** para impedir que se ejecute cualquier sistema no oficial.
* **Recovery (Entorno de recuperación):** Es una partición independiente que contiene un mini-sistema operativo de mantenimiento. El recovery de fábrica es muy limitado, por lo que lo reemplazaremos por un **Custom Recovery** (como **OrangeFox**, **TWRP** o el propio recovery de **PixelOS/LineageOS**) que nos permita formatear particiones e inyectar nuevos sistemas.
* **Firmware / Vendor:** Son los controladores de bajo nivel que permiten que Android se comunique con el módem (señal móvil, Wi-Fi, Bluetooth), la pantalla, los sensores y la cámara. Una Custom ROM reemplaza el sistema visual y lógico, pero necesita apoyarse en un firmware base compatible.
* **GApps (Google Apps):** AOSP puro no incluye los servicios propietarios de Google (Play Store, servicios de ubicación, sincronización). Algunas ROMs como **PixelOS** o **Evolution X** ya las traen integradas de fábrica, mientras que otras como **LineageOS** son *Vanilla* (limpias) y requieren flashear las GApps por separado si el usuario desea usarlas.

### ¿Por qué procesadores Qualcomm Snapdragon?
Qualcomm libera gran parte del código fuente y documentación de sus plataformas (*CAF / CodeLinaro*), lo que permite a la comunidad compilar árboles de dispositivos (*Device Trees*) y kernels personalizados estables. En cambio, procesadores como MediaTek o Exynos suelen tener código cerrado que dificulta el desarrollo comunitario.

Las marcas más recomendables para este proceso son **Google Pixel** (soporte nativo e inmediato), **Xiaomi / Redmi / POCO** (la comunidad de desarrollo más grande del mundo), **OnePlus** y **Motorola**.

---

## 2. Identificación Exacta del Dispositivo (*Codename*)

El error número uno que causa la muerte súbita de un teléfono (*hard brick*) es descargar archivos guiándose por el nombre comercial. Un mismo modelo comercial puede tener variantes regionales con placas base o chips NFC distintos.

En el mundo del desarrollo de Android, todo dispositivo se identifica por un **nombre en clave único (*codename*)**. Por ejemplo:
* Redmi Note 10 Pro $\rightarrow$ `sweet` (variante global) o `sweetin` (variante India).
* POCO X3 Pro $\rightarrow$ `vayu`.
* Xiaomi Mi 11X / POCO F3 $\rightarrow$ `alioth`.

### Cómo averiguar tu *codename* exacto:
1. En tu teléfono, entra a **Ajustes** $\rightarrow$ **Acerca del teléfono**.
2. Toca **7 veces seguidas** sobre **Número de compilación** (o *Versión de MIUI/HyperOS*) hasta que aparezca el mensaje *"¡Ya eres programador!"*.
3. Entra a **Ajustes adicionales** $\rightarrow$ **Opciones de desarrollador** y activa la **Depuración USB**.
4. Conecta el teléfono por cable a tu PC y ejecuta en la terminal:

```bash
adb devices
```
*(Acepta el cartel de autorización de huella RSA que aparecerá en la pantalla del teléfono marcando "Permitir siempre").*

5. Ahora consulta la propiedad exacta del hardware con:

```bash
adb shell getprop ro.product.device
```

La palabra que te devuelva la terminal es tu **codename**. Todo lo que descargues de ahora en adelante (Recovery, Firmware y Custom ROM) **debe coincidir estrictamente con ese nombre en clave**.

---

## 3. Preparación del Entorno en Linux

Trabajar desde Linux (como Arch Linux / EndeavourOS, Debian o Fedora) ofrece una ventaja enorme frente a Windows: el kernel de Linux ya gestiona de forma nativa la comunicación USB a bajo nivel, por lo que no tendrás problemas de pantallazos azules ni instaladores de drivers obsoletos.

### 1. Instalar herramientas ADB y Fastboot
* **ADB (*Android Debug Bridge*):** Permite enviar comandos e interactuar con el teléfono cuando está encendido o dentro del modo Recovery.
* **Fastboot:** Es el protocolo que se comunica directamente con el Bootloader cuando el sistema operativo no ha arrancado.

En distribuciones basadas en Arch Linux / EndeavourOS:
```bash
sudo pacman -S android-tools android-udev
```

En distribuciones basadas en Debian / Ubuntu:
```bash
sudo apt update && sudo apt install adb fastboot
```

### 2. Recargar las reglas `udev`
El paquete `android-udev` configura los permisos necesarios para que no tengas que usar `sudo` cada vez que interactúes con el puerto USB:

```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

> **Consejo físico importante:** Utiliza siempre un cable USB de buena calidad y conéctalo preferiblemente a un puerto **USB 2.0** o directamente a la placa base. Si mientras el teléfono está en modo Fastboot se desconecta solo o da el error `press any key to shutdown`, suele deberse a picos de frecuencia en controladores USB 3.0 modernos; usar un pequeño adaptador o hub USB 2.0 soluciona el problema por completo.

---

## 4. Copia de Seguridad y Preparación de Cuentas

Abrir el bootloader borrará absolutamente toda la memoria interna del dispositivo por diseño de seguridad criptográfica.

1. **Respalda tus archivos personales:** Copia tus fotos, documentos, música y bases de datos locales (como carpetas de WhatsApp o llaves 2FA) a tu computadora.
2. **Anula o recuerda tu cuenta de Google:** Es recomendable quitar la cuenta de Google del teléfono antes de empezar para evitar el bloqueo antirrobo **FRP (*Factory Reset Protection*)** en caso de que olvides la contraseña tras formatear.
3. **Batería superior al 60%:** Nunca inicies un proceso de flasheo con la batería baja; si el teléfono se apaga mientras escribe la tabla de particiones o el bootloader, quedará inutilizable.

---

## 5. Desbloqueo del Bootloader

### Paso A: Habilitar el permiso en el sistema
1. Ve a **Opciones de desarrollador** en el teléfono.
2. Activa la casilla **Desbloqueo OEM** (*OEM Unlocking*). Si está en gris, conéctate a internet y espera unos minutos.

### Paso B: Procedimiento según el fabricante

#### En Google Pixel, Motorola y OnePlus:
1. Reinicia el teléfono en modo Fastboot desde la terminal:
   ```bash
   adb reboot bootloader
   ```
2. Verifica que la computadora lo detecte:
   ```bash
   fastboot devices
   ```
3. Ejecuta el comando de liberación:
   ```bash
   fastboot flashing unlock
   ```
   *(En equipos más antiguos puede ser `fastboot oem unlock`)*.
4. En la pantalla del teléfono aparecerá una advertencia. Usa las teclas de volumen para seleccionar **Unlock the bootloader** y confirma con el botón de encendido. El teléfono se formateará y reiniciará con el bootloader abierto.

#### En Xiaomi, Redmi y POCO:
Xiaomi implementa un sistema de validación por servidor:
1. En **Opciones de desarrollador**, entra al apartado **Estado de Mi Unlock**.
2. Desactiva el Wi-Fi, activa tus **datos móviles** y presiona en **Añadir cuenta y dispositivo** (debes tener insertada tu tarjeta SIM vinculada a una cuenta Mi activa).
3. Una vez vinculado con éxito, apaga el teléfono y enciéndelo manteniendo presionados **Volumen Abajo + Botón de Encendido** para entrar en modo `FASTBOOT`.
4. Utiliza la herramienta oficial **Mi Unlock** (o su equivalente comunitario en Linux como `XiaoMiToolV2` / máquina virtual con USB passthrough) para autenticar tu cuenta y ejecutar el desbloqueo. Si el servidor indica un tiempo de espera (por ejemplo, 72 o 168 horas), usa el teléfono normalmente sin cerrar la sesión de tu cuenta Mi ni desactivar las opciones de desarrollador hasta que se cumpla el plazo.

---

## 6. Arquitectura de Particiones: A-Only vs. A/B (Virtual A/B)

Entender qué esquema de particiones usa tu dispositivo es vital porque cambia la forma en que se instala el Recovery:

1. **Dispositivos con partición `recovery` dedicada (Esquema clásico o A-Only / Dynamic Partitions con recovery separado, como el Redmi Note 10 Pro `sweet`):**
   Tienen un bloque de memoria exclusivo llamado `recovery`. El comando de flasheo escribe directamente sobre esa partición.
2. **Dispositivos A/B sin partición recovery dedicada (*Seamless Updates*):**
   El código del recovery vive dentro de la partición `boot` o `vendor_boot`. En estos equipos no se hace `fastboot flash recovery`, sino que se flashea `boot` / `vendor_boot` o se arranca la imagen temporalmente en memoria RAM con `fastboot boot recovery.img`.

---

## 7. Descarga de los Archivos Necesarios

En tu computadora, crea una carpeta limpia para trabajar (por ejemplo `~/rom-flash/`) y descarga estos tres elementos verificando que correspondan a tu **codename**:

1. **La Custom ROM (`.zip`):**
   * **PixelOS:** Basada en la experiencia de los Google Pixel, muy estable, incluye aplicaciones de Google y parches de seguridad al día.
   * **Evolution X:** Similar a PixelOS pero con un panel extenso de personalización visual, ajustes de rendimiento y opciones para juegos.
   * **LineageOS:** Extremadamente ligera, enfocada en privacidad y libre de servicios de Google por defecto.
2. **El Custom Recovery (`.img`):**
   * **OrangeFox Recovery** o **TWRP**, o bien el archivo `recovery.img` que el propio mantenedor de la ROM publica junto al enlace de descarga de la ROM (muchos mantenedores actuales recomiendan usar el recovery propio de la ROM para garantizar el soporte de desencriptado de Android 14/15/16/17).
3. **El Firmware Regional (`.zip` — Opcional pero muy recomendado):**
   En sitios como *Xiaomi Firmware Updater* puedes descargar un paquete ligero (de unos 80 MB a 150 MB) que contiene únicamente los controladores base actualizados de tu región (Global `MI`, Europa `EU`, etc.) sin necesidad de bajar toda la ROM oficial de 5 GB.

### Verificación de integridad (Checksums SHA-256)
Un archivo `.zip` descargado con un solo bit corrupto hará que la instalación falle a mitad de camino. Antes de flashear, comprueba siempre la suma criptográfica en tu terminal:

```bash
sha256sum nombre-de-la-rom.zip
```
Compara el código alfanumérico resultante con el que publica el desarrollador en la página oficial de descarga. Si son idénticos, el archivo está 100% íntegro.

---

## 8. Flasheo del Custom Recovery

1. Conecta el teléfono encendido o apágalo y entra al modo **Fastboot** (**Volumen Abajo + Encendido**, o `adb reboot bootloader`).
2. Comprueba la conexión en la terminal:
   ```bash
   fastboot devices
   ```
   *(Debe aparecer el número de serie seguido de la palabra `fastboot`)*.

3. **Flashea la imagen del recovery:**
   * Si tu teléfono tiene partición recovery dedicada (el caso más común en gama media Snapdragon):
     ```bash
     fastboot flash recovery recovery.img
     ```
   * *(Nota: Si la documentación específica de tu modelo indica que usa `vendor_boot` o `boot`, reemplaza la palabra `recovery` por la partición que indique el mantenedor).*

4. **Reiniciar directamente al Recovery (Paso Crítico):**
   Si después de flashear el recovery dejas que el teléfono inicie en el sistema original de fábrica, el sistema original sobrescribirá tu nuevo recovery por seguridad. Por lo tanto, debes forzar el arranque directo hacia el recovery:
   ```bash
   fastboot reboot recovery
   ```
   *(Si tu versión de fastboot no soporta ese comando, ejecuta `fastboot reboot` e inmediatamente mantén presionado **Volumen Arriba + Encendido** hasta que aparezca el logo de OrangeFox / TWRP / PixelOS Recovery).*

---

## 9. Instalación Paso a Paso de la Custom ROM (*Clean Flash*)

Una vez dentro del entorno Recovery, realizaremos una **instalación limpia (*Clean Flash*)** utilizando el método **ADB Sideload**. Este método es el más seguro y limpio porque transmite el paquete directamente desde la memoria de tu PC a través del cable USB sin depender de que la memoria interna del teléfono esté desencriptada.

### Paso 1: Actualizar el Firmware base (Si aplica)
Si el desarrollador de la ROM pide una versión específica de firmware:
1. En el Recovery, activa el modo **ADB Sideload** (en OrangeFox/TWRP está en *Advanced* $\rightarrow$ *ADB Sideload*; en el recovery de AOSP/PixelOS está en *Apply Update* $\rightarrow$ *Apply from ADB*).
2. En la terminal de tu PC, envía el firmware:
   ```bash
   adb sideload fw_tu_dispositivo_global.zip
   ```

### Paso 2: Flashear la Custom ROM
1. Vuelve a activar el modo **ADB Sideload** en el menú del Recovery.
2. En la terminal de tu computadora, ejecuta:
   ```bash
   adb sideload NombreDeLaCustomROM.zip
   ```
3. Verás un porcentaje de progreso en tu terminal y mensajes en la pantalla del teléfono (`Patching system image unconditionally...`, `Verifying update package...`).
   > **Nota sobre el 47%:** En la terminal de la PC, es completamente normal que el progreso se detenga en `47%` y al finalizar muestre el mensaje `Total xfer: 1.00x`. No es un error; así reporta ADB el cierre del flujo de bloques cuando el paquete termina de transferirse.

### Paso 3: Instalar complementos (Solo si tu ROM es Vanilla)
* Si instalaste **PixelOS** o **Evolution X**, **salta este paso** (ya traen todo lo de Google integrado).
* Si instalaste **LineageOS** y deseas la Play Store, el propio recovery te preguntará si deseas reiniciar en el recovery para instalar paquetes adicionales (*Reboot to recovery*). Acepta y haz `adb sideload MindTheGapps.zip`.

### Paso 4: Ejecutar `Format Data` (Obligatorio en instalación limpia)
Como venimos de otro sistema operativo, la partición de usuario (`/data`) sigue cifrada con las llaves criptográficas del sistema anterior. Si reinicias sin formatear datos, el teléfono se quedará atrapado en el logo de inicio (*bootloop*).

1. En **OrangeFox / TWRP**:
   * Ve a **Wipe** (o *Manage Partitions* $\rightarrow$ *Data*) $\rightarrow$ selecciona **Format Data**.
   * Escribe la palabra **`yes`** en el teclado en pantalla y confirma.
2. En **AOSP / PixelOS / LineageOS Recovery**:
   * Regresa al menú principal con la flecha superior.
   * Selecciona **Factory reset** $\rightarrow$ **Format data / factory reset** y confirma con **Format data**.

---

## 10. Primer Arranque y Verificación Post-Instalación

1. En el menú principal del Recovery, selecciona **Reboot system now** (Reiniciar sistema).
2. **Paciencia en el primer encendido:** El primer arranque tarda entre **3 y 6 minutos** mientras el sistema compila la caché inicial de servicios (`dalvik/ART`) y genera las nuevas llaves de encriptación Basadas en Archivos (*File-Based Encryption - FBE*).
3. Aparecerá el asistente de configuración inicial de Android. Conéctate a tu red Wi-Fi, configura tu huella dactilar y termina los ajustes básicos.

### Qué revisar al terminar:
* **Tasa de refresco de pantalla:** Entra a *Ajustes* $\rightarrow$ *Pantalla* y activa los **120 Hz** (o tasa adaptativa) si tu panel lo soporta.
* **Cámara:** Muchas Custom ROMs en procesadores Snapdragon modernos ya incluyen **Leica Cam / MIUI Camera** preinstalada con soporte completo para todos los lentes, o puedes instalar un port optimizado de **GCam (Google Camera)** con su respectivo archivo de configuración `.xml` para mejorar drásticamente el procesamiento fotográfico nocturno y el rango dinámico (HDR+).
* **Integridad del sistema (Play Integrity):** ROMs activas suelen incluir parches actualizados para pasar la validación básica del sistema, permitiendo el uso normal de aplicaciones cotidianas.

---

## 11. Solución de Problemas Comunes (*Troubleshooting*)

| Problema | Causa probable | Solución técnica |
| :--- | :--- | :--- |
| **`<waiting for any device>` en Fastboot** | Permisos USB en Linux o cable/puerto defectuoso. | Instalar `android-udev`, cambiar de cable o usar un puerto USB 2.0. |
| **El teléfono reinicia solo al Recovery tras instalar la ROM** | Olvidaste hacer **Format Data** o el firmware base es incompatible. | Entrar al recovery, hacer *Format Data* escribiendo `yes` y verificar que usaste el firmware de la región correcta. |
| **Error `kInstallDeviceOpenError` o `Error 7` en Sideload** | Estás usando un Recovery desactualizado o una ROM para otro *codename*. | Comprobar el *codename* y flashear la versión más reciente de OrangeFox o del recovery oficial de la ROM. |
| **Se queda pegado en el logo de inicio más de 15 minutos (*Bootloop*)** | Partición `/data` corrupta o mezcla de archivos de un sistema anterior. | Forzar entrada al Recovery (**Volumen Arriba + Encendido**), hacer *Format Data* y volver a enviar la ROM por `adb sideload`. |

---

## Conclusión

Cambiar el sistema operativo de fábrica por una Custom ROM en un dispositivo con procesador Snapdragon transforma por completo la experiencia de uso: el consumo de memoria RAM en reposo disminuye notablemente, la interfaz responde de forma instantánea sin publicidad incrustada y el dispositivo recibe nuevas versiones de Android mucho después de que el fabricante oficial lo haya abandonado. Con un flujo de trabajo ordenado desde la terminal de Linux y respetando las verificaciones de *codename* y *Format Data*, el procedimiento es limpio, reproducible y totalmente seguro.
