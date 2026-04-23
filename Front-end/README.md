# Front-end – Carrito de Compras Deportivo

Aplicación **React 18 + Vite + TailwindCSS** consumiendo el API Gateway de los microservicios Spring Boot.

## Stack

- **Vite 5** + **React 18**
- **React Router v6**
- **Axios** con interceptor JWT
- **TailwindCSS 3**
- **lucide-react** (iconos)
- Context API para **Auth**, **Cart** y **Toast**

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

## Variables de entorno (`.env`)

```
VITE_API_URL=http://localhost:8080/api
```

## Estructura

```
src/
  api/            axiosClient + authApi, productsApi, ordersApi
  context/        AuthContext, CartContext, ToastContext
  components/     Navbar, ProtectedRoute, ProductCard, FormField, Loader, EmptyState
  pages/          LoginPage, RegisterPage, CatalogPage, CartPage, ProfilePage, OrderSuccessPage, NotFoundPage
  utils/          formatters, errors
  App.jsx         Rutas y layout
  main.jsx        Providers + BrowserRouter
```

## Flujo

1. Registro / Login → JWT guardado en `localStorage`.
2. Catálogo público → agrega al carrito (exige login).
3. Carrito (con persistencia por usuario en `localStorage`) → eliminar items o ajustar cantidades.
4. Finalizar compra → `POST /api/orders` → muestra **ID de la orden** en `/order/:id`.
5. Perfil editable en `/profile`.

## Responsive

- Mobile-first. Grid del catálogo `1 / 2 / 3 / 4` columnas en breakpoints `sm / lg / xl`.
- Navbar con menú hamburguesa en móviles.
- Carrito con layout 1 columna en mobile y 2/3 + sidebar en desktop.
