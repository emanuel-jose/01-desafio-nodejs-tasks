import fs from "node:fs";
import { parse } from "csv-parse";

const csvFilePath = new URL("../../example-tasks.csv", import.meta.url);

export async function importCsv() {
  const parser = fs
    .createReadStream(csvFilePath)
    .pipe(parse({ columns: true }));

  for await (const record of parser) {
    const { title, description } = record;
    console.log({ title, description });

    try {
      await fetch("http://localhost:3333/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
    } catch (error) {
      console.log("Erro ao realizar tarefa: " + error);
    }
  }
}

importCsv();
