import { CultivationCreateDto, CultivationDto } from '@forest-guard/api-interfaces';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { beforeEachAndAfterAll, createHttpHeader, HttpHeader, prisma } from './test-utils/test.utils';

dotenv.config();

const cultivationType = process.env.CULTIVATION_TYPE;

describe('/cultivations', () => {
  let httpHeader: HttpHeader;

  const givenCultivationCreateDto: CultivationCreateDto = {
    sort: 'Arabica',
  };

  beforeAll(async () => {
    httpHeader = await createHttpHeader();
  });

  beforeEachAndAfterAll();

  afterEach(async () => {
    await prisma.cultivation.deleteMany();
  });

  describe('POST /cultivations', () => {
    it('should create one cultivation', async () => {
      const actualResponse = await axios.post('/cultivations', givenCultivationCreateDto, httpHeader);

      const expectedResponse: CultivationDto = {
        id: actualResponse.data.id,
        type: cultivationType,
        sort: givenCultivationCreateDto.sort,
      };

      expect(actualResponse.status).toBe(201);
      expect(actualResponse.data).toEqual(expectedResponse);
    });
  });

  describe('GET /cultivations', () => {
    it('should get two cultivations', async () => {
      await axios.post(`/cultivations`, givenCultivationCreateDto, httpHeader);

      const givenCultivationCreateDto2: CultivationCreateDto = {
        sort: 'Robusta',
      };
      await axios.post(`/cultivations`, givenCultivationCreateDto2, httpHeader);

      const actualResponseFromGet = await axios.get('/cultivations', httpHeader);

      const expectedResponseFromGet: CultivationDto[] = [
        {
          id: actualResponseFromGet.data[0].id,
          type: cultivationType,
          sort: givenCultivationCreateDto.sort,
        },
        {
          id: actualResponseFromGet.data[1].id,
          type: cultivationType,
          sort: givenCultivationCreateDto2.sort,
        },
      ];

      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponseFromGet);
    });

    it('should get zero cultivations', async () => {
      const expectedResponse = [];
      const actualResponseFromGet = await axios.get('/cultivations', httpHeader);
      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponse);
    });
  });

  describe('GET/cultivations/types', () => {
    it('should get the declared types', async () => {
      const expectedResponse = [cultivationType];
      const actualResponseFromGet = await axios.get('/cultivations/types', httpHeader);
      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponse);
    });
  });
});
