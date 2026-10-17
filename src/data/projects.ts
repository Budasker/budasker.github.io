import type { Project } from '../types/portfolio';

export const projects: Project[] = [
  {
    title: 'Optimización de Red y Mitigación de Bufferbloat',
    category: 'Redes & Infraestructura',
    description: 'Despliegue de firmware OpenWrt en un enrutador Cudy AX3000 operando en modo WISP, enfocado en estabilidad de latencia bajo carga y filtrado de red local.',
    metrics: [
      'Control de tráfico SQM con algoritmo CAKE para eliminar picos de latencia',
      'Filtrado de publicidad y rastreadores a nivel de red mediante DNS',
      'Segmentación y ajuste de parámetros inalámbricos en entorno saturado',
    ],
    tags: ['OpenWrt', 'SQM / QoS', 'DNS Filtering', 'Networking'],
    repoLink: 'https://github.com/budasker',
    linkText: '>_ Ver perfil en GitHub',
  },
  {
    title: 'Entorno Linux & Aceleración por Hardware',
    category: 'Sistemas & Kernel',
    description: 'Configuración y mantenimiento de estación de trabajo sobre EndeavourOS (Arch Linux), integrando módulos de kernel propietarios y herramientas de diagnóstico.',
    metrics: [
      'Compilación automática de módulos con DKMS para GPU NVIDIA 940MX',
      'Integración funcional de entornos CUDA y OpenCL en Arch Linux',
      'Flasheo y depuración de Custom ROMs (PixelOS / Evolution X) vía ADB/Fastboot',
    ],
    tags: ['EndeavourOS', 'DKMS', 'CUDA / OpenCL', 'Android ROMs'],
    repoLink: 'https://github.com/budasker',
    linkText: '>_ Ver perfil en GitHub',
  },
  {
    title: 'Herramientas CLI y Algoritmos en C++',
    category: 'Desarrollo Bajo Nivel',
    description: 'Desarrollo de utilidades en línea de comandos y resolución de problemas algorítmicos en C++, compilados y depurados de forma nativa en Linux.',
    metrics: [
      'Plantillas y entorno de compilación rápida con GCC/G++ y Geany',
      'Ejecución ligera en terminal sin dependencias pesadas',
      'Práctica continua de seguridad y lógica en laboratorios OverTheWire (Bandit)',
    ],
    tags: ['C++', 'GCC', 'Linux CLI', 'Bash'],
    repoLink: 'https://github.com/budasker',
    linkText: '>_ Ver perfil en GitHub',
  },
];
