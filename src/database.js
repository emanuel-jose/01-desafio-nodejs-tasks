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

  select(table, searchTitle, searchDescription) {
    let data = this.#database[table] ?? [];

    if (searchTitle) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    // veriificar a parte de search da descrição da task
    console.log(data);
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
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }

  complete(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    let isCompleted = null;

    if (data.completed_at === null) {
      isCompleted = new Date();
    } else {
      isCompleted = null;
    }

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        id,
        completed_at: isCompleted,
        ...data,
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
