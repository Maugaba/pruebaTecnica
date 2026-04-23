# Back-end – Carrito de Compras Deportivo (Microservicios)

Proyecto Maven multi-módulo con 4 microservicios Spring Boot 4.0.5 / Java 21:

| Módulo        | Puerto | Descripción                                               |
|---------------|-------:|-----------------------------------------------------------|
| `api-gateway` | 8080   | Spring Cloud Gateway – enrutador único para el Front-end  |
| `ms-users`    | 8081   | Registro / Login con JWT, perfil del usuario              |
| `ms-products` | 8082   | Catálogo de productos deportivos (CRUD + seed inicial)    |
| `ms-orders`   | 8083   | Pedidos (guardar, listar) – llama a `ms-products`         |

## Requisitos

- **Java 21**
- **Maven 3.9+** (incluye `mvnw.cmd`)
- **MySQL** corriendo en `localhost:3306` con usuario `root` y sin contraseña.  
  El schema `pruebaTecnica` se crea automáticamente (`createDatabaseIfNotExist=true`).  
  Las tablas se generan con `spring.jpa.hibernate.ddl-auto=update` según las entidades.

## Arquitectura

```
React (5173)  ──►  api-gateway (8080)  ─┬─►  ms-users    (8081)  ──►  MySQL
                                        ├─►  ms-products (8082)  ──►  MySQL
                                        └─►  ms-orders   (8083)  ──►  MySQL
                                                            │
                                                            └── RestClient ──► ms-products
```

- El **frontend solo habla con el gateway** (`http://localhost:8080`).
- `ms-users` emite el JWT en `POST /api/auth/login`; los otros microservicios validan el token con el **mismo secreto** (`app.jwt.secret`).
- Comunicación interna con `RestClient` (Spring 6).

## Endpoints principales (a través del gateway)

### Autenticación / Usuarios
- `POST /api/auth/register` – público
- `POST /api/auth/login` – público → `{ token, tokenType, expiresIn, user }`
- `GET  /api/users/me` – JWT
- `PUT  /api/users/me` – JWT

### Productos
- `GET    /api/products` – público
- `GET    /api/products/{id}` – público
- `POST   /api/products` – JWT
- `PUT    /api/products/{id}` – JWT
- `DELETE /api/products/{id}` – JWT (soft delete)

### Pedidos
- `POST /api/orders` – JWT → crea el pedido, retorna el **ID**
- `GET  /api/orders` – JWT → lista pedidos del usuario
- `GET  /api/orders/{id}` – JWT

## Compilar todo

```powershell
cd Back-end
./mvnw.cmd clean install -DskipTests
```

## Ejecutar (4 terminales, una por microservicio)

Terminal 1 – `ms-users`:
```powershell
cd Back-end
./mvnw.cmd -pl ms-users spring-boot:run
```

Terminal 2 – `ms-products`:
```powershell
cd Back-end
./mvnw.cmd -pl ms-products spring-boot:run
```

Terminal 3 – `ms-orders`:
```powershell
cd Back-end
./mvnw.cmd -pl ms-orders spring-boot:run
```

Terminal 4 – `api-gateway`:
```powershell
cd Back-end
./mvnw.cmd -pl api-gateway spring-boot:run
```

> Orden recomendado de arranque: **ms-users → ms-products → ms-orders → api-gateway**.  
> La primera vez que levante `ms-products` se insertarán 8 productos deportivos de ejemplo automáticamente.

## Configuración clave

Todos los servicios comparten el mismo secreto JWT (`app.jwt.secret`) en sus `application.properties`. Cambia el valor en los tres servicios antes de llevarlo a un ambiente real.

## Estructura

```
Back-end/
├── pom.xml                  (parent – packaging=pom)
├── api-gateway/
├── ms-users/
├── ms-products/
└── ms-orders/
```
