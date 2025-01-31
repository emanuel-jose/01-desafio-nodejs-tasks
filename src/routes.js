import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from "node:crypto";
import { Database } from "./database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.query;

      const tasks = database.select(
        "tasks",
        title || description
          ? {
              title,
              description,
            }
          : null
      );

      res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message:
              "Dados obrigatórios não foram passados: title, description",
          })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);

      return res
        .writeHead(201)
        .end(JSON.stringify({ message: "Tarefa criada com sucesso!" }));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const idVerification = database.verifyIdIfExists("tasks", id);

      if (!idVerification) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: "Tarefa não encontrada!",
          })
        );
      }

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message:
              "Dados obrigatórios não foram passados: title, description",
          })
        );
      }

      database.update("tasks", id, { title, description });
      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const idVerification = database.verifyIdIfExists("tasks", id);

      if (!idVerification) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: "Tarefa não encontrada!",
          })
        );
      }

      database.complete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const idVerification = database.verifyIdIfExists("tasks", id);

      if (!idVerification) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: "Tarefa não encontrada!",
          })
        );
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
];
