import { Hono } from "hono";

const booksRoute = new Hono()
  .get("/", (c) => c.json("list books"))
  .post("/", (c) => c.json("create a book", 201))
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default booksRoute;
