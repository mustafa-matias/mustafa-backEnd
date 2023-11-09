import chai from "chai";
import supertest from "supertest";
const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("test e-commerce", () => {
  describe("test produts", () => {
    it("GET api/products/ debe traer un array de productos", async () => {
      const { _body } = await requester.get("/api/products/");
      expect(_body).to.have.property("payload").that.is.an("object");
      expect(_body.payload).to.have.property("docs").that.is.an("array");
    }).timeout(1000);
    it("GET api/products/:id debe traer un producto por id", async () => {
      const idProduct = "654ab6721e1913e51d91a4bc";
      const { _body, statusCode } = await requester.get(
        "/api/products/" + idProduct
      );
      expect(_body.payload).to.have.property("_id").equal(idProduct);
      expect(statusCode).to.equal(200);
    }).timeout(1000);
  });
  describe("test carts", () => {
    it("GET api/carts/ debe traer un array de carritos", async () => {
      const { _body } = await requester.get("/api/carts/");
      expect(Array.isArray(_body.carts)).to.be.equal(true);
    }).timeout(1000);
    it("POST api/carts/ debe crear un carrito", async () => {
      const { _body } = await requester.post("/api/carts/");
      expect(_body.status).to.equal("success");
      expect(_body.cart).to.be.an("object");
      expect(_body.cart).to.have.property("products").that.is.an("array");
      expect(_body.cart.products).to.be.an("array").that.is.empty;
      expect(_body.cart).to.have.property("_id").that.is.a("string");
    }).timeout(1000);
    it("DELETE api/carts/:id debe todos los productos un carrito por ID y que quede un array vacio", async () => {
      const idCart = "654ab5f01e1913e51d91a49f";
      const { _body } = await requester.delete("/api/carts/" + idCart);
      expect(_body.status).to.equal("success");
    }).timeout(1000);
  });
  describe("test users", () => {
    it("GET /api/users Debe funcionar el CurrentUserDTO a la hora de obtener todos los usuarios ", async () => {
      const response = await requester.get("/api/users");
      const users = response.body.payload;
      for (const user of users) {
        expect(user).to.not.have.property("password");
        expect(user).to.not.have.property("_id");
        expect(user).to.not.have.property("age");
        expect(user).to.not.have.property("documents");
      }
    }).timeout(1000);
  });
  describe("test sessions", () => {
    it("POST /register debe crear un nuevo usuario con datos válidos y establecer la sesión", async () => {
      const newUser = {
        firstName: "lionel",
        lastName: "messi",
        email: "lm@example.com",
        age: 36,
        password: "123",
      };
      const response = await requester
        .post("/api/sessions/register")
        .send(newUser);
      expect(response.headers["set-cookie"]).to.be.an("array").that.is.not
        .empty;
      const cookies = response.headers["set-cookie"];
      const connectSidCookie = cookies.find((cookie) =>
        cookie.startsWith("connect.sid")
      );
      expect(connectSidCookie).to.exist;
    }).timeout(1000);
    it("POST /login debe crear un nuevo usuario con datos válidos y establecer la sesión", async () => {
      const user = {
        email: "lm@example.com",
        password: "123",
      };
      const { _body, statusCode } = await requester
        .post("/api/sessions/login")
        .send(user);
      expect(statusCode).to.equal(200);
      expect(_body.payload).to.have.property("_id");
      expect(_body.payload).to.have.property("name");
      expect(_body.payload).to.have.property("role");
      expect(_body.payload).to.have.property("cart");
      expect(_body.payload).to.have.property("premium");
      expect(_body.payload).to.have.property("age");
      expect(_body.payload).to.have.property("email");
    }).timeout(1000);
    it("GET /logout debe cerrar la sesión y redirigir al inicio de sesión", async () => {
      const response = await requester.get("/api/sessions/logout");
      expect(response.status).to.equal(200);
      expect(response._body).to.have.property("status").to.equal("success");
    }).timeout(1000);
  });
});
