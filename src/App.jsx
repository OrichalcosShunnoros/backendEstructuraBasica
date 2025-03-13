import { useState, useEffect } from "react";
import './App.css'

export const App = () => {
  const [vista, setVista] = useState("/");
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);

  const [form, setForm] = useState({ id: "", nombre: "", email: "", contraseña: "", estudiando: false });
  const [formProducto, setFormProducto] = useState({ id: "", nombre: "", descripcion: "", cantidad: "", valor: "" });

  const fetchUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:3000/usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchProductos();
  }, []);

  const crearUsuario = async () => {
    await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: Date.now() }),
    });
    fetchUsuarios();
  };

  const actualizarUsuario = async (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) return;

    const nuevoNombre = prompt("Nuevo nombre:", usuario.nombre);
    const nuevoEmail = prompt("Nuevo email:", usuario.email);
    const nuevaContraseña = prompt("Nueva contraseña:", usuario.contraseña);
    const estudiando = confirm("¿Está estudiando actualmente?");

    if (!nuevoNombre || !nuevoEmail || !nuevaContraseña) return;

    const usuarioActualizado = {
      ...usuario,
      nombre: nuevoNombre,
      email: nuevoEmail,
      contraseña: nuevaContraseña,
      estudiando,
    };

    await fetch(`http://localhost:3000/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioActualizado),
    });

    fetchUsuarios();
  };

  const eliminarUsuario = async (id) => {
    await fetch(`http://localhost:3000/usuarios/${id}`, { method: "DELETE" });
    fetchUsuarios();
  };

  const crearProducto = async () => {
    await fetch("http://localhost:3000/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formProducto, id: Date.now(), cantidad: Number(formProducto.cantidad), valor: Number(formProducto.valor) }),
    });
    fetchProductos();
  };

  const actualizarProducto = async (id) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    const nuevoNombre = prompt("Nuevo nombre:", producto.nombre);
    const nuevaDescripcion = prompt("Nueva descripción:", producto.descripcion);
    const nuevaCantidad = prompt("Nueva cantidad:", producto.cantidad);
    const nuevoValor = prompt("Nuevo valor:", producto.valor);

    if (!nuevoNombre || !nuevaDescripcion || !nuevaCantidad || !nuevoValor) return;

    const productoActualizado = {
      ...producto,
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion,
      cantidad: Number(nuevaCantidad),
      valor: Number(nuevoValor),
    };

    await fetch(`http://localhost:3000/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productoActualizado),
    });

    fetchProductos();
  };

  const eliminarProducto = async (id) => {
    await fetch(`http://localhost:3000/productos/${id}`, { method: "DELETE" });
    fetchProductos();
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => setVista("formUsuarios")}>Formulario Usuarios</button>
        <button onClick={() => setVista("usuarios")}>Usuarios</button>
        <button onClick={() => setVista("formProductos")}>Formulario Productos</button>
        <button onClick={() => setVista("productos")}>Productos</button>
      </header>

      <div>
        {vista === "formUsuarios" && (
          <div className="form">
            <h2>Formulario Usuarios</h2>
            <input type="text" placeholder="Nombre" onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <input type="text" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Contraseña" onChange={(e) => setForm({ ...form, contraseña: e.target.value })} />
            <label>
              <input type="checkbox" onChange={(e) => setForm({ ...form, estudiando: e.target.checked })} /> Estudiando
            </label>
            <button className="crear" onClick={crearUsuario}>Crear Usuario</button>
          </div>
        )}

        {vista === "usuarios" && (
          <div className="tabla">
            <h2>Usuarios</h2>
            <table>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Contraseña</th>
                <th>Estudiando</th>
                <th>Acciones</th>
              </tr>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.contraseña}</td>
                  <td>{u.estudiando ? "Si" : "No"}</td>
                  <td>
                    <button className="act" onClick={() => actualizarUsuario(u.id)}>Actualizar Usuario</button>
                    <button className="del" onClick={() => eliminarUsuario(u.id)}>Eliminar Usuario</button>
                </td>
                </tr>
              ))}
            </table>
          </div>
        )}

        {vista === "formProductos" && (
            <div className="form">
              <h2>Formulario Productos</h2>
              <input type="text" placeholder="Nombre" onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })} />
              <input type="text" placeholder="Descripción" onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })} />
              <input type="text" placeholder="Cantidad" onChange={(e) => setFormProducto({ ...formProducto, cantidad: e.target.value })} />
              <input type="text" placeholder="Valor" onChange={(e) => setFormProducto({ ...formProducto, valor: e.target.value })} />
              <button className="crear" onClick={crearProducto}>Crear Producto</button>
            </div>
          )}

        {vista === "productos" && (
          <div className="tabla">
            <h2>Productos</h2>
            <table>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Valor</th>
                <th>Acciones</th>
              </tr>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.cantidad}</td>
                  <td>{p.valor}</td>
                  <td>
                    <button className="act" onClick={() => actualizarProducto(p.id)}>Actualizar poducto</button>
                    <button className="del" onClick={() => eliminarProducto(p.id)}>Eliminar producto</button>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
