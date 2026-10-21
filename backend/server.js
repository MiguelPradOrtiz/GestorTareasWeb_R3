
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "Servidor GestorTareasWeb R3 funcionando",
        estado: "correcto"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT DATABASE() AS base_datos, 1 AS conexion"
        );

        res.json({
            mensaje: "Conexión con MySQL exitosa",
            resultado: rows[0]
        });

    } catch (error) {
        console.error("Error de conexión:", error.message);

        res.status(500).json({
            mensaje: "No se pudo conectar con MySQL"
        });
    }
});

app.get("/api/tareas", async (req, res) => {
    try {
        const [tareas] = await pool.query(
            `SELECT id, descripcion, completada, fecha_creacion
             FROM tareas
             ORDER BY id DESC`
        );

        res.json(tareas);

    } catch (error) {
        console.error("Error al consultar tareas:", error.message);

        res.status(500).json({
            mensaje: "No se pudieron obtener las tareas"
        });
    }
});

app.post(
    "/api/tareas",
    [
        body("descripcion")
            .isString()
            .withMessage("La descripción debe ser texto")
            .trim()
            .notEmpty()
            .withMessage("La descripción no puede estar vacía")
            .isLength({ max: 100 })
            .withMessage("Máximo 100 caracteres")
    ],
    async (req, res) => {
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            return res.status(400).json({
                errores: errores.array()
            });
        }

        try {
            const descripcion = req.body.descripcion.trim();

            const [resultado] = await pool.execute(
                "INSERT INTO tareas (descripcion) VALUES (?)",
                [descripcion]
            );

            res.status(201).json({
                mensaje: "Tarea registrada correctamente",
                tarea: {
                    id: resultado.insertId,
                    descripcion,
                    completada: false
                }
            });

        } catch (error) {
            console.error("Error al registrar tarea:", error.message);

            res.status(500).json({
                mensaje: "No se pudo registrar la tarea"
            });
        }
    }
);


app.patch("/api/tareas/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { completada } = req.body;

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "ID de tarea no válido"
            });
        }

        if (typeof completada !== "boolean") {
            return res.status(400).json({
                mensaje: "El estado debe ser verdadero o falso"
            });
        }

        const [resultado] = await pool.execute(
            "UPDATE tareas SET completada = ? WHERE id = ?",
            [completada ? 1 : 0, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Tarea no encontrada"
            });
        }

        res.json({
            mensaje: "Estado de la tarea actualizado",
            id,
            completada
        });

    } catch (error) {
        console.error("Error al actualizar tarea:", error.message);

        res.status(500).json({
            mensaje: "No se pudo actualizar la tarea"
        });
    }
});


app.delete("/api/tareas/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "ID de tarea no válido"
            });
        }

        const [resultado] = await pool.execute(
            "DELETE FROM tareas WHERE id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Tarea no encontrada"
            });
        }

        res.json({
            mensaje: "Tarea eliminada correctamente",
            id
        });

    } catch (error) {
        console.error("Error al eliminar tarea:", error.message);

        res.status(500).json({
            mensaje: "No se pudo eliminar la tarea"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
