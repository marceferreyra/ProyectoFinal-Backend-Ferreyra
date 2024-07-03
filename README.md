PROYECTO FINAL BACKEND

Usuario y contraseña del administrador:

USER_ADMIN=adminCoder@coder.com
PASS_ADMIN=adminCod3r123

Rutas de Productos 

- GET /api/products: Obtiene una lista paginada de productos con filtros opcionales.
- POST /api/products: Agrega un nuevo producto a la base de datos.
- GET /api/products/:id: Obtiene un producto específico por su ID.
- DELETE /api/products/:id: Elimina un producto específico por su ID.
- PUT /api/products/:id: Actualiza un producto específico por su ID.

Rutas de Carritos
- GET /: Obtiene todos los carritos existentes en la base de datos.
- POST /: Agrega un nuevo carrito a la base de datos.
- GET /:cid: Obtiene un carrito específico por su ID.
- PUT /:cid: Actualiza un carrito específico por su ID.
- DELETE /:cid: Elimina un carrito específico por su ID.
- POST /:cid/products/:pid: Agrega un producto al carrito específico identificado por :cid.
- PUT /:cid/products/:pid: Actualiza la cantidad de un producto en el carrito específico identificado por :cid.
- DELETE /:cid/products/:pid: Elimina un producto del carrito específico identificado por :cid.
- DELETE /:cid/clear: Elimina todos los productos del carrito específico identificado por :cid.
- POST /:cid/purchase: Realiza la compra del carrito específico identificado por :cid, marcándolo como adquirido.

Rutas de Sesiones
- GET /github: Inicia el proceso de autenticación con GitHub utilizando Passport.
- GET /callbackGithub: Callback de autenticación de GitHub que maneja el retorno después de la autenticación exitosa.
- POST /register: Registra un nuevo usuario.
- POST /login: Inicia sesión con las credenciales proporcionadas.
- POST /logout: Cierra la sesión actual del usuario.
- GET /current: Obtiene la sesión actual del usuario autenticado.
- GET /profile: Obtiene el perfil del usuario autenticado.
- POST /forgot-password: Envía un correo electrónico para restablecer la contraseña.
- POST /reset-password: Restablece la contraseña del usuario con el token proporcionado.

Rutas de Pagos
- POST /process-payment/:cid: Procesa el pago para el carrito especificado por su ID. Se espera que se envíe un token de Stripe en el cuerpo de la solicitud para realizar el pago.

Rutas de Chat
- GET /: Obtiene todos los mensajes del chat. Requiere autenticación para acceder. Renderiza la vista 'chat' con los mensajes obtenidos y el usuario actual.
- POST /: Crea un nuevo mensaje en el chat. 

Rutas de Usuarios
- GET /api/users: Obtiene todos los usuarios registrados.
- DELETE /api/users: Elimina usuarios inactivos que no han iniciado sesión en los últimos dos días. También envía un correo electrónico de notificación a cada usuario eliminado.
- GET /api/users/premium/:uid: Obtiene el rol del usuario específico identificado por su ID.
- PUT /api/users/premium/:uid: Actualiza el rol de un usuario específico identificado por su ID, verificando la documentación requerida si se actualiza a premium.
- POST /api/users/:uid/documents: Sube documentos asociados a un usuario específico identificado por su ID, incluyendo profile, product, Identificación, Comprobante de domicilio y Comprobante de estado de cuenta.
