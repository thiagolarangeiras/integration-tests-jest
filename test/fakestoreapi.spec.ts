import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('Loja Falsa', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = "https://fakestoreapi.com";
  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe("Listar Produtos", () => {
    it("Listar todos", async () => {
      await p
        .spec()
        .get(`${baseUrl}/products`)
        .withHeaders('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
        .inspect()
        .expectStatus(StatusCodes.OK);
    });
  });
});
