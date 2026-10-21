# Hogar Peludo

Hogar Peludo es una aplicación web para ayudar a encontrar hogar a animales y poner en contacto a personas interesadas en adoptar con quienes publican. Permite explorar animales en adopción o con necesidad de rescate urgente, crear publicaciones y conversar mediante comentarios.

## Funcionalidades

- Listado de animales con búsqueda por nombre, ubicación, tipo, edad y etiquetas.
- Filtros por perros, gatos y publicaciones urgentes.
- Página de detalle para cada animal, con su historia, características y comentarios.
- Registro e inicio de sesión con correo y contraseña.
- Publicación de animales con foto, ubicación, estado y características.
- Perfil para actualizar el nombre, cambiar la contraseña y administrar las publicaciones propias.
- Comentarios y reportes de publicaciones o comentarios.

## Tecnologías

- [Next.js](https://nextjs.org/) 16 con App Router
- [React](https://react.dev/) 19
- [Supabase](https://supabase.com/) para autenticación, base de datos y almacenamiento de fotos
- [Tailwind CSS](https://tailwindcss.com/) 4

## Requisitos

- Node.js 20.9 o posterior
- npm
- Un proyecto de Supabase configurado para la aplicación

## Puesta en marcha

1. Clona el repositorio y entra en la carpeta del proyecto.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env.local` en la raíz con las credenciales de tu proyecto de Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publicable
   ```

   Puedes encontrar estos valores en la configuración de API de tu proyecto de Supabase. No publiques claves secretas ni subas `.env.local` al repositorio.

4. En Supabase, configura las tablas `animales`, `comentarios` y `reportes` que usa la aplicación, habilita las políticas de acceso (RLS) adecuadas y crea el bucket público `fotos-animales` para las imágenes. La aplicación espera que las tablas y políticas permitan las operaciones correspondientes a las funciones descritas arriba.
5. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

6. Abre [http://localhost:3000](http://localhost:3000).

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Next.js en modo desarrollo. |
| `npm run build` | Genera la compilación de producción. |
| `npm run start` | Sirve la compilación de producción. Ejecuta antes `npm run build`. |
| `npm run lint` | Ejecuta ESLint. |

## Rutas principales

| Ruta | Descripción |
| --- | --- |
| `/` | Explorar y buscar animales publicados. |
| `/animal/[id]` | Ver los detalles, comentarios y reportes de un animal. |
| `/publicar` | Crear una publicación (requiere iniciar sesión). |
| `/login` | Iniciar sesión o crear una cuenta. |
| `/perfil` | Administrar la cuenta y las publicaciones propias. |

## Estructura del proyecto

```text
app/          Rutas, páginas y estilos globales
components/   Componentes reutilizables de la interfaz
lib/          Cliente de Supabase y utilidades
public/       Recursos estáticos
```
