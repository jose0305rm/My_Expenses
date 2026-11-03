# Control de Gastos

Aplicación para controlar gastos por billeteras, tarjetas y efectivo, en colones costarricenses (₡).

**Stack:** React + TypeScript + Vite · Tailwind CSS v4 · Bootstrap Icons

## Ejecutar

```bash
npm install   # solo la primera vez
npm run dev
```

## Funcionalidades

- Billeteras (crear, editar, eliminar) con su saldo total.
- Varias tarjetas por billetera y **una sola** cuenta de efectivo, cada una con un monto inicial.
- Registrar gastos (rojo) y agregar saldo/abonos (verde) con monto, fecha y descripción; editarlos o eliminarlos.
- Historial con filtros (todos / gastos / abonos) y resumen de totales.
- Nunca se permite saldo negativo (al crear un gasto, editar montos o eliminar abonos).

## Privacidad

No hay servidor ni base de datos: todo se guarda en el `localStorage` del navegador de cada visitante
(clave `control-gastos:data:v1`). Si alguien abre el proyecto desde el portafolio, ve solo sus propios
datos, y tú solo ves los tuyos.

Los datos se pierden si el usuario borra los datos del navegador, y no se comparten entre dispositivos.
