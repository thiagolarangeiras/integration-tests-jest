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

  describe("Listar Produtos", () => {
    it("Listar todos", async () => {
      await p
        .spec()
        .get(`${baseUrl}/products`)
        .inspect()
        .expectStatus(StatusCodes.OK);
    });
  });
});
