---
layout: ../../../layouts/WriteupLayout.astro
title: "01. Punteros y Gestión de Memoria Dinámica en C++"
date: "2026-10-17"
category: "C++ & Bajo Nivel"
description: "Clase técnica introductoria sobre direcciones de memoria física, operadores de dirección y desreferencia, segmentación Stack vs. Heap y prevención de memory leaks."
tags: ["C++", "Punteros", "Memoria Dinámica", "Stack vs Heap", "Seguridad", "Mentorías"]
backLink: "/mentorias/"
backText: "<- Volver a ~/Mentorias"
---

Bienvenido al primer módulo práctico de la mentoría de **C++ y Programación a Bajo Nivel**. Si vienes de lenguajes de alto nivel con recolector de basura (*Garbage Collector*) como Python o Java, la memoria siempre ha sido una caja negra administrada automáticamente. 

En C++, el programador tiene el control absoluto y la responsabilidad directa sobre cada byte asignado en la memoria RAM. Dominar los punteros no solo te convertirá en un mejor desarrollador, sino que es la base para comprender la arquitectura de computadores, el análisis de vulnerabilidades y la optimización de algoritmos.

---

## 1. ¿Qué es exactamente un Puntero?

Para el procesador, la memoria RAM es simplemente una secuencia lineal de casillas (bytes), donde cada casilla posee un identificador numérico único denominado **dirección de memoria** (usualmente expresada en hexadecimal, por ejemplo `0x7ffd5e3a8904`).

Cuando declaras una variable estándar:
```cpp
int edad = 20;
```
El compilador reserva 4 bytes contiguos en la memoria y asocia el nombre simbólico `edad` con esa dirección.

Un **puntero** no es más que una variable cuyo valor almacenado es **la dirección de memoria de otra variable**.

### Los dos operadores esenciales:

1. **Operador de Dirección (`&` - Address-of):** Obtiene la dirección de memoria física donde reside una variable.
2. **Operador de Desreferencia (`*` - Dereference):** Accede al valor real almacenado en la dirección a la que apunta el puntero.

```text
[ Variable edad: 20 ]  <---- Ubicada en 0x1000
         ▲
         │ apunta hacia
[ Puntero ptr: 0x1000 ] <--- Ubicado en 0x2000
```

---

## 2. Anatomía de la Memoria: Stack vs. Heap

Para escribir software seguro y eficiente, debes distinguir los dos segmentos principales de memoria donde residen tus datos:

| Segmento | ¿Quién lo gestiona? | Velocidad | Duración de vida | Riesgo principal |
| :--- | :--- | :--- | :--- | :--- |
| **Stack (Pila)** | CPU / Sistema de forma automática | Ultrarrápida (LIFO) | Mientras dure el ámbito (*scope*) local `{ }` | *Stack Overflow* (agotar el espacio fijo asignado al hilo) |
| **Heap (Montículo)** | El programador mediante código | Más lenta (requiere buscar bloques libres) | Hasta que invoques explícitamente `delete` | *Memory Leak* (fuga de memoria) o *Use-After-Free* |

* En el **Stack**, cuando una función termina, sus variables locales desaparecen automáticamente.
* En el **Heap**, los datos persisten indefinidamente hasta que liberes la memoria manualmente.

---

## 3. Ejemplo Práctico Comentado

A continuación tienes un ejemplo completo que demuestra:
1. El uso de los operadores `&` y `*`.
2. La reserva dinámica de un arreglo de enteros en el **Heap** mediante el operador `new`.
3. La liberación de memoria con `delete[]` y la neutralización del puntero con `nullptr` (buena práctica de ciberseguridad).

```cpp
#include <iostream>

int main() {
    // ==========================================
    // PARTE 1: Conceptos Básicos en el Stack
    // ==========================================
    int objetivo = 42;
    
    // Declaración e inicialización del puntero
    // El tipo debe coincidir con el dato al que apunta (int*)
    int* ptr = &objetivo;

    std::cout << "[STACK] Valor de la variable: " << objetivo << "\n";
    std::cout << "[STACK] Direccion de memoria (&objetivo): " << &objetivo << "\n";
    std::cout << "[STACK] Direccion contenida en ptr:      " << ptr << "\n";
    std::cout << "[STACK] Valor desreferenciado (*ptr):     " << *ptr << "\n";

    // Modificando el valor original a través del puntero
    *ptr = 100;
    std::cout << "[STACK] Nuevo valor de objetivo tras *ptr = 100: " << objetivo << "\n\n";

    // ==========================================
    // PARTE 2: Memoria Dinámica en el Heap
    // ==========================================
    int tamano = 0;
    std::cout << "Ingresa la cantidad de elementos a reservar en Heap: ";
    if (!(std::cin >> tamano) || tamano <= 0) {
        std::cerr << "Error: Tamano invalido.\n";
        return 1;
    }

    // 'new int[tamano]' solicita al SO un bloque contiguo en el Heap
    // 'buffer' es un puntero en el Stack que apunta al inicio de ese bloque en Heap
    int* buffer = new int[tamano];

    std::cout << "\n[HEAP] Bloque reservado con exito en direccion: " << buffer << "\n";

    // Llenamos el arreglo usando aritmética de punteros / indexación
    for (int i = 0; i < tamano; ++i) {
        buffer[i] = (i + 1) * 10;
    }

    // Mostramos los valores
    std::cout << "[HEAP] Valores cargados:\n";
    for (int i = 0; i < tamano; ++i) {
        std::cout << "  buffer[" << i << "] en " << (buffer + i) << " = " << *(buffer + i) << "\n";
    }

    // ==========================================
    // PARTE 3: Liberación y Buenas Prácticas
    // ==========================================
    // Regla de oro: Por cada 'new[]' DEBE haber un 'delete[]'
    delete[] buffer;

    // Hardening contra "Dangling Pointer" (puntero colgante):
    // Tras el delete, el puntero sigue recordando la dirección pero ya no nos pertenece.
    // Asignar nullptr evita accesos accidentales Use-After-Free (UAF).
    buffer = nullptr;

    std::cout << "\n[OK] Memoria liberada correctamente y puntero neutralizado a nullptr.\n";

    return 0;
}
```

### Cómo compilar y verificar en Linux:

Guarda el archivo como `punteros.cpp` y compílalo con advertencias estrictas en GCC:

```bash
g++ -std=c++17 -Wall -Wextra -Wpedantic punteros.cpp -o punteros
./punteros
```

Para verificar que no dejaste ninguna fuga de memoria (*memory leak*), ejecuta:

```bash
valgrind --leak-check=full ./punteros
```
Si el resultado indica `All heap blocks were freed -- no leaks are possible`, tu código es seguro.

---

## 4. Peligros Comunes en Ciberseguridad

1. **Puntero Colgante (*Dangling Pointer*):** Ocurre cuando liberas la memoria (`delete ptr;`) pero sigues utilizando `*ptr`. Si otro proceso o hilo escribe en esa dirección, el programa sufrirá una corrupción de memoria o un ataque de ejecución de código (*Use-After-Free*).
   * *Solución:* Asignar inmediatamente `ptr = nullptr;` después de cada `delete`.
2. **Fuga de Memoria (*Memory Leak*):** Ocurre cuando reservas memoria con `new` dentro de una función o bucle y pierdes el puntero sin haber llamado a `delete`. El sistema operativo nunca recupera esa memoria hasta que el proceso termina.
   * *Solución:* Gestionar el ciclo de vida o utilizar punteros inteligentes (*Smart Pointers: `std::unique_ptr`*) en C++ moderno.

---

## 5. Ejercicios Prácticos Propuestos

Resuelve estos dos ejercicios en tu entorno de desarrollo en Linux antes de la siguiente sesión:

### Ejercicio 1: Intercambio In-Place (`swap_ptr`)
Escribe una función con la firma:
```cpp
void intercambiar(int* a, int* b);
```
* **Requisitos:** La función debe intercambiar los valores de dos variables enteras de la función `main` utilizando exclusivamente punteros y el operador de desreferencia (sin usar variables globales ni referencias `&` de C++).
* **Pregunta de reflexión:** ¿Por qué si pasáramos `void intercambiar(int a, int b)` las variables originales no cambiarían su valor en `main`? Dibuja mentalmente la pila (*stack frame*).

### Ejercicio 2: Gestor de Calificaciones Dinámico
Desarrolla un programa de consola que:
1. Solicite al usuario la cantidad $N$ de estudiantes de un curso.
2. Reserve dinámicamente en el Heap un arreglo de `float` de tamaño $N$.
3. Lea las notas ingresadas por el usuario.
4. Calcule y muestre:
   * La nota promedio.
   * La nota más alta y la dirección de memoria exacta donde quedó guardada.
5. Libere la memoria correctamente y asegúrese con `valgrind` de que no exista ninguna fuga de memoria.

---

> **Próximo capítulo:** `02. Aritmética de Punteros Avanzada y Punteros a Funciones`.
