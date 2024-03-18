const request = require("supertest");
const app = require("../src/app.js");

describe("Root path", () => {
  test("It should response the GET method", (done) => {
    request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe("Root path: Static content", () => {
  it("Response with html", async () => {
    const response = await request(app).get("/");

    expect(response.text).toMatch(/html/);
    expect(response.text).toMatch(/body/);
  });
});

describe("Structure: GET response", () => {
  it("should not accept an invalid path", async () => {
    const response = await request(app).get("/structure/example.json");

    console.log(response);

    // const json = JSON.parse(await response.text);

    expect(response.status).toEqual(404);
    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.text).toMatch(/File not found/);
  });

  it("should return a json file", async () => {
    const response = await request(app).get("/structure/example");

    const json = JSON.parse(response.text);

    expect(response.status).toEqual(200);
    expect(response.header["content-type"]).toMatch(/json/);
    expect(json).toBeDefined();
  });
});

describe("Structure: POST request", () => {
  it("should update a structure", async () => {
    const data = { value: "yes" };
    const response = await request(app).post(`/structure/test`).send(data);

    const json = JSON.parse(response.text);

    expect(response.status).toEqual(201);
    expect(json.status).toEqual("ok");
    expect(json.content.value).toEqual("yes");
  });
});
