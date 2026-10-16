---
layout: ../../layouts/WriteupLayout.astro
title: "Mitigación de Bufferbloat con OpenWrt y SQM (CAKE) en modo WISP"
date: "2026-10-15"
category: "Redes & Infraestructura"
description: "Guía técnica sobre cómo estabilizar la latencia bajo carga en enlaces inalámbricos utilizando colas inteligentes CAKE y filtrado DNS local."
tags: ["OpenWrt", "SQM", "CAKE", "Networking"]
---

En conexiones que operan mediante enlaces inalámbricos o modo **WISP** (Wireless Internet Service Provider), uno de los problemas más críticos es el **Bufferbloat**: el aumento drástico de la latencia (ping) cuando otro dispositivo en la red satura el ancho de banda de subida o bajada.

En esta nota documento cómo resolví este problema en un router **Cudy AX3000** corriendo firmware **OpenWrt**.

## 1. Diagnóstico del problema

Cuando un enlace se satura, los paquetes quedan esperando en colas demasiado grandes dentro del módem o router sin gestión de prioridades. Esto provoca que paquetes críticos (como tráfico SSH, DNS o voz en tiempo real) sufran retrasos de más de `150 ms`.

## 2. Implementación de SQM con el algoritmo CAKE

Para solucionarlo en OpenWrt, instalé el paquete de gestión inteligente de colas (**SQM - Smart Queue Management**):

```bash
opkg update
opkg install luci-app-sqm kmod-sched-cake
