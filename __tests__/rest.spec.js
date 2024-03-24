const request = require("supertest");
const app = require("../src/app.js");

describe("Root path with static content", () => {
  it("should response the GET request", (done) => {
    request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  it("should response with html", async () => {
    const response = await request(app).get("/");

    expect(response.text).toMatch(/html/);
    expect(response.text).toMatch(/body/);
  });
});

describe("Structure: GET response", () => {
  it("should not accept an invalid path", async () => {
    const response = await request(app).get("/structure/example.json");

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

  it("should not return a json file, if resource contains .", async () => {
    const response = await request(app).get("/structure/test/exa.mple");
    const json = JSON.parse(response.text);

    expect(response.status).toEqual(404);
    expect(response.header["content-type"]).toMatch(/json/);
    expect(json.status).toEqual("notok");
    expect(json).toBeDefined();
  });

  it("should not return a json file, if path contains .", async () => {
    const response = await request(app).get("/structure/te.st/example");
    const json = JSON.parse(response.text);

    expect(response.status).toEqual(404);
    expect(response.header["content-type"]).toMatch(/json/);
    expect(json.status).toEqual("notok");
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

  it("should not update an existing structure", async () => {
    const data = { value: "yes" };

    const response = await request(app).post(`/structure/test`).send(data);
    const json = JSON.parse(response.text);

    expect(response.status).toEqual(409);
    expect(json.status).toEqual("notok");
    expect(json.error.includes("exists")).toEqual(true);
  });
});

describe("Structure: PUT request", () => {
  it("should update a structure", async () => {
    const data = { value: "yes" };

    const response = await request(app).put(`/structure/test`).send(data);
    const json = JSON.parse(response.text);

    expect(response.status).toEqual(201);
    expect(json.status).toEqual("ok");
    expect(json.content.value).toEqual("yes");
  });
});

describe("Structure: DELETE request", () => {
  it("should delete a structure", async () => {
    const response = await request(app).delete(`/structure/test`);

    const json = JSON.parse(response.text);

    expect(response.status).toEqual(200);
    expect(json.status).toEqual("ok");
  });

  it("should throw an error if the resource does not exist", async () => {
    const response = await request(app).delete(`/structure/test2`);

    const json = JSON.parse(response.text);

    expect(response.status).toEqual(404);
    expect(json.status).toEqual("notok");
  });
});
