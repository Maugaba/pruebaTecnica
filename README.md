# Prueba Técnica – Carrito de Compras Deportivo

Aplicación web full-stack de carrito de compras para artículos deportivos, construida con **arquitectura de microservicios** en Spring Boot + un frontend React responsive.

## Arquitectura

```
React + Vite + Tailwind (5173)
          │
          ▼
   api-gateway (8080)  ── Spring Cloud Gateway
     │        │        │
     │        │        └──────────► ms-orders   (8083)  ──► MySQL
     │        └───────────────────► ms-products (8082)  ──► MySQL
     └────────────────────────────► ms-users    (8081)  ──► MySQL
                                              (schema: pruebaTecnica)
```

- **Autenticación** vía **JWT** emitido por `ms-users` y validado por cada microservicio con un secreto compartido.
- **Comunicación inter-servicios** con `RestClient` (Spring 6).
- **Base de datos única** (`pruebaTecnica`) con tablas por microservicio, generadas automáticamente con `spring.jpa.hibernate.ddl-auto=update`.

## Requisitos

- Java 21
- Maven 3.9+ (incluye `mvnw.cmd`)
- Node.js 18+ y npm
- MySQL 8 en `localhost:3306`, usuario `root` sin contraseña

## Ejecución rápida

### 1. Backend (4 terminales, una por microservicio)

```powershell
cd Back-end
./mvnw.cmd clean install -DskipTests   # solo la primera vez

# en 4 terminales distintas:
./mvnw.cmd -pl ms-users     spring-boot:run
./mvnw.cmd -pl ms-products  spring-boot:run
./mvnw.cmd -pl ms-orders    spring-boot:run
./mvnw.cmd -pl api-gateway  spring-boot:run
```

La primera vez que levantes `ms-products` se cargarán 8 artículos deportivos de muestra. El esquema `pruebaTecnica` y todas las tablas se crean solos.

### 2. Frontend

```powershell
cd Front-end
npm install
npm run dev   # http://localhost:5173
```

## Flujo funcional

1. `/register` – Crear cuenta (nombres, apellidos, dirección de envío, email, fecha de nacimiento, contraseña).
2. `/login` – Iniciar sesión → token JWT almacenado en `localStorage`.
3. `/` – Catálogo responsive con búsqueda y filtro por categoría.
4. Agregar al carrito (requiere login). El carrito se persiste por usuario en `localStorage`.
5. `/cart` – Ver resumen, eliminar o ajustar cantidades, finalizar compra.
6. `/order/:id` – Confirmación con el **ID de la orden**.
7. `/profile` – Ver / actualizar datos del usuario.

## Endpoints

| Método | Endpoint                 | Auth | Microservicio |
|-------:|--------------------------|:----:|---------------|
| POST   | `/api/auth/register`     |  –   | ms-users      |
| POST   | `/api/auth/login`        |  –   | ms-users      |
| GET    | `/api/users/me`          | JWT  | ms-users      |
| PUT    | `/api/users/me`          | JWT  | ms-users      |
| GET    | `/api/products`          |  –   | ms-products   |
| GET    | `/api/products/{id}`     |  –   | ms-products   |
| POST   | `/api/products`          | JWT  | ms-products   |
| PUT    | `/api/products/{id}`     | JWT  | ms-products   |
| DELETE | `/api/products/{id}`     | JWT  | ms-products   |
| POST   | `/api/orders`            | JWT  | ms-orders     |
| GET    | `/api/orders`            | JWT  | ms-orders     |
| GET    | `/api/orders/{id}`       | JWT  | ms-orders     |

## Estructura

```
Prueba tecnica/
├── Back-end/                       (Maven padre multi-módulo)
│   ├── pom.xml
│   ├── api-gateway/     (8080)
│   ├── ms-users/        (8081)
│   ├── ms-products/     (8082)
│   └── ms-orders/       (8083)
└── Front-end/                      (Vite + React + Tailwind)
    ├── package.json
    └── src/
```

Para detalles de cada lado, consultar los README específicos:
- [Back-end/README.md](Back-end/README.md)
- [Front-end/README.md](Front-end/README.md)

## Tecnologías

| Capa      | Tecnologías                                                                 |
|-----------|-----------------------------------------------------------------------------|
| Backend   | Spring Boot 4.0.5, Spring Cloud Gateway 2025.1, Spring Security, Spring Data JPA, JWT (jjwt 0.12), Lombok, MySQL, Java 21 |
| Frontend  | React 18, Vite 5, TailwindCSS 3, React Router 6, Axios, lucide-react        |
| Base datos| MySQL 8 (schema `pruebaTecnica`, tablas autogeneradas por JPA)              |
