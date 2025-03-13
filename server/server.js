import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

let usuarios = [];
let productos = [];

// Middleware para validar estructura de usuario
const validarUsuario = (req, res, next) => {
  const { nombre, email, estudiando, contraseña } = req.body;

  if (!nombre || typeof nombre !== "string") {
    return res.status(400).json({ error: "El nombre es obligatorio y debe ser un string." });
  }
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "El email es obligatorio y debe ser un string." });
  }
  if (typeof estudiando !== "boolean") {
    return res.status(400).json({ error: "El campo estudiando debe ser un booleano (true o false)." });
  }
  if (!contraseña || typeof contraseña !== "string") {
    return res.status(400).json({ error: "La contraseña es obligatoria y debe ser un string." });
  }

  next();
};

// Middleware para validar estructura de producto
const validarProducto = (req, res, next) => {
  const { nombre, descripcion, cantidad, valor } = req.body;

  if (!nombre || typeof nombre !== "string") {
    return res.status(400).json({ error: "El nombre es obligatorio y debe ser un string." });
  }
  if (!descripcion || typeof descripcion !== "string") {
    return res.status(400).json({ error: "La descripción es obligatoria y debe ser un string." });
  }
  if (typeof cantidad !== "number" || cantidad < 0) {
    return res.status(400).json({ error: "La cantidad debe ser un número mayor o igual a 0." });
  }
  if (typeof valor !== "number" || valor < 0) {
    return res.status(400).json({ error: "El valor debe ser un número mayor o igual a 0." });
  }

  next();
};

// CRUD USUARIOS
app.get("/usuarios", (req, res) => res.json(usuarios));

app.post("/usuarios", validarUsuario, (req, res) => {
  usuarios.push(req.body);
  res.status(201).json({ message: "Usuario agregado" });
});

app.put("/usuarios/:id", validarUsuario, (req, res) => {
  const { id } = parseInt(req.params.id);
  const index = usuarios.findIndex((u) => u.id == id);
  if (index !== -1) {
    usuarios[index] = req.body;
    res.json({ message: "Usuario actualizado" });
  } else {
    res.status(404).json({ error: "Usuario no encontrado", usuarios });
  }
});

app.delete("/usuarios/:id", (req, res) => {
  usuarios = usuarios.filter((u) => u.id != req.params.id);
  res.json({ message: "Usuario eliminado" });
});

// CRUD PRODUCTOS
app.get("/productos", (req, res) => res.json(productos));

app.post("/productos", validarProducto, (req, res) => {
  productos.push(req.body);
  res.status(201).json({ message: "Producto agregado" });
});

app.put("/productos/:id", validarProducto, (req, res) => {
  const { id } = req.params;
  const index = productos.findIndex((p) => p.id == id);
  if (index !== -1) {
    productos[index] = req.body;
    res.json({ message: "Producto actualizado" });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.delete("/productos/:id", (req, res) => {
  productos = productos.filter((p) => p.id != req.params.id);
  res.json({ message: "Producto eliminado" });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
