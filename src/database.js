import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          if (value) {
            return row[key].toLowerCase().includes(value.toLowerCase());
          }
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      const task = this.#database[table][rowIndex];
      console.log({ task });
      this.#database[table][rowIndex] = {
        ...task,
        id,
        title: data.title ?? task.title,
        description: data.description ?? task.description,
        updated_at: new Date(),
      };
      this.#persist();
    }
  }

  verifyIdIfExists(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      return true;
    } else {
      return false;
    }
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    let isCompleted = null;

    const task = this.#database[table][rowIndex];

    if (task.completed_at === null) {
      isCompleted = new Date();
    } else {
      isCompleted = null;
    }

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...task,
        id,
        completed_at: isCompleted,
      };
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
