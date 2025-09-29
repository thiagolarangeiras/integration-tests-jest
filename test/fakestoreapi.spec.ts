import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Loja Falsa', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = "https://api.escuelajs.co/api/v1";
  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe("Produtos", () => {
    let id = Math.floor(Math.random() * 1000);
    let id_return = 0;

    it("Listar todos os produtos", async () => {
      await p
        .spec()
        .get(`${baseUrl}/products`)
        .expectStatus(StatusCodes.OK);
    });

    it("Criar um produto", async () => {
      id_return = await p.spec()
        .post(`${baseUrl}/products`)
        .withJson({
          "title": `New Product${id}`,
          "price": 10,
          "description": "A description",
          "categoryId": 1,
          "images": ["https://placehold.co/600x400"]
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
            "title": `New Product${id}`,
            "price": 10,
            "description": "A description",
        })
        .returns('id');
    });

    it("Recuperar o item adicionado", async () => {
      await p.spec()
        .get(`${baseUrl}/products/${id_return}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          "title": `New Product${id}`,
          "price": 10,
          "description": "A description",
      });
    });

    it("Atualizar o produto criado", async () => {
      await p.spec()
        .put(`${baseUrl}/products/${id_return}`)
        .withJson({
          "title": `Updated Product${id}`,
          "price": 15,
          "description": "Updated description",
          "categoryId": 1,
          "images": ["https://placehold.co/600x400"]
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          "title": `Updated Product${id}`,
          "price": 15,
          "description": "Updated description",
        });
    });

    it("Excluir o produto criado", async () => {
      await p.spec()
        .delete(`${baseUrl}/products/${id_return}`)
        .expectStatus(StatusCodes.OK);
    });

    it("Listar todos os produtos após exclusão", async () => {
      await p.spec()
        .get(`${baseUrl}/products`)
        .expectStatus(StatusCodes.OK);
    });
    
  });

  describe("Usuarios", ()=> {
    let id = Math.floor(Math.random() * 1000);
    it("Checar usuario 1", async () => {
      await pactum.spec()
        .get(`${baseUrl}/users/1`)
        .expectStatus(200)
        .expectJsonLike({
          "id": 1,
          "email": "john@mail.com",
          "password": "changeme",
          "name": "Jhon",
          "role": "customer",
        });
    });

    it("Listar todos os usuarios", async () => {
      await pactum.spec()
        .get(`${baseUrl}/users`)
        .expectStatus(StatusCodes.OK);
    });

    it("Criar um novo usuario", async () => {
      await pactum.spec()
        .post(`${baseUrl}/users`)
        .withJson({
          "name": `testuser${id}`,
          "email": `testuser${id}@gmail.com`,
          "password": "1234",
          "avatar": "https://picsum.photos/800"
        })
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          "name": `testuser${id}`,
          "email": `testuser${id}@gmail.com`,
          "password": "1234",
        });
    });

    it("Buscar usuário inexistente, erro 400", async () => {
      await pactum.spec()
        .get(`${baseUrl}/users/999999`)
        .expectStatus(StatusCodes.BAD_REQUEST);
    });
  });
});
