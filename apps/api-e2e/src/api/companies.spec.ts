import { CompanyCreateDto, CompanyDto, FarmerCreateDto, RoleType } from '@forest-guard/api-interfaces';
import axios from 'axios';
import { beforeAllAndAfterAll, prisma } from './test.utils';

describe('/companies', () => {
  const givenCompanyCreateDto: CompanyCreateDto = {
    name: 'Acme Corp',
    address: {
      street: '123 Elm Street',
      postalCode: '54321',
      city: 'Springfield',
      state: 'IL',
      country: 'USA',
    },
  };

  beforeAllAndAfterAll();

  afterEach(async () => {
    await prisma.company.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /companies', () => {
    it('should create a company', async () => {
      const actualResponse = await axios.post(`/companies`, givenCompanyCreateDto);

      const expectedResponse: CompanyDto = {
        id: actualResponse.data.id,
        ...givenCompanyCreateDto,
        address: {
          id: actualResponse.data.address.id,
          ...givenCompanyCreateDto.address,
        },
      };

      expect(actualResponse.status).toBe(201);
      expect(actualResponse.data).toEqual(expectedResponse);
    });

    it('should not create a company because name already exists', async () => {
      await axios.post(`/companies`, givenCompanyCreateDto);

      try {
        await axios.post(`/companies`, givenCompanyCreateDto);
      } catch (err) {
        expect(err.response.data.timestamp).toBeDefined();
        expect(err.response.data.status).toBe(409);
        expect(err.response.data.message).toBe(`Company with name '${givenCompanyCreateDto.name}' already exists.`);
        expect(err.response.data.requestDetails).toBeDefined();
      }
    });
  });

  describe('GET /companies/:id', () => {
    it('should get a company', async () => {
      const actualResponseFromPost = await axios.post(`/companies`, givenCompanyCreateDto);

      const actualResponseFromGet = await axios.get(`/companies/${actualResponseFromPost.data.id}`);

      const expectedResponse: CompanyDto = {
        id: actualResponseFromGet.data.id,
        ...givenCompanyCreateDto,
        employees: [],
        farmers: [],
        address: {
          id: actualResponseFromGet.data.address.id,
          ...givenCompanyCreateDto.address,
        },
      };

      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponse);
    });

    it('should not get a company because id does not exist', async () => {
      const givenCompanyId = '123';

      try {
        await axios.get(`/companies/${givenCompanyId}`);
      } catch (err) {
        expect(err.response.data.timestamp).toBeDefined();
        expect(err.response.data.status).toBe(404);
        expect(err.response.data.message).toBe(`Company with id '${givenCompanyId}' not found.`);
        expect(err.response.data.requestDetails).toBeDefined();
      }
    });
  });

  describe('GET /companies', () => {
    it('should get two companies', async () => {
      const givenCompanyCreateDtos: CompanyCreateDto[] = [
        givenCompanyCreateDto,
        {
          name: 'Acme Corp2',
          address: {
            street: '456 Elm Street',
            postalCode: '987654',
            city: 'Springfield',
            state: 'IL',
            country: 'USA',
          },
        },
      ];

      await axios.post(`/companies`, givenCompanyCreateDtos[0]);
      await axios.post(`/companies`, givenCompanyCreateDtos[1]);

      const actualResponseFromGet = await axios.get('/companies');

      const expectedResponseFromGet: CompanyDto[] = [
        {
          id: actualResponseFromGet.data[0].id,
          ...givenCompanyCreateDtos[0],
          employees: [],
          farmers: [],
          address: {
            id: actualResponseFromGet.data[0].address.id,
            ...givenCompanyCreateDtos[0].address,
          },
        },
        {
          id: actualResponseFromGet.data[1].id,
          ...givenCompanyCreateDtos[1],
          employees: [],
          farmers: [],
          address: {
            id: actualResponseFromGet.data[1].address.id,
            ...givenCompanyCreateDtos[1].address,
          },
        },
      ];

      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponseFromGet);
    });

    it('should get no companies because table is empty', async () => {
      const expectedResponse = [];
      const actualResponseFromGet = await axios.get('/companies');
      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponse);
    });
  });

  describe('GET /companies/:id/farmers', () => {
    it('should get one farmer of a specific company', async () => {
      const givenFarmerCreateDto: FarmerCreateDto = {
        employeeId: 'e1',
        firstName: 'fn',
        lastName: 'ln',
        email: 'fn.ln@coffee-beans.com',
        mobilePhoneNumber: '555-123456789',
        role: RoleType.FARMER,
        personalId: 'p1',
        address: {
          street: 's1',
          postalCode: 'pc1',
          city: 'c1',
          state: 'S1',
          country: 'C1',
        },
      };

      const actualResponseFromPostFarmers = await axios.post(`/users/farmers`, givenFarmerCreateDto);
      const actualResponseFromPostCompanies = await axios.post(`/companies`, givenCompanyCreateDto);

      await prisma.user.update({
        where: { id: actualResponseFromPostFarmers.data.id },
        data: {
          companyId: actualResponseFromPostCompanies.data.id,
        },
      });

      // TODO-MP: FarmerDto.plotOfLands -> response...plotsOfLand
      const expectedResponse = [
        {
          id: actualResponseFromPostFarmers.data.id,
          employeeId: givenFarmerCreateDto.employeeId,
          firstName: givenFarmerCreateDto.firstName,
          lastName: givenFarmerCreateDto.lastName,
          email: givenFarmerCreateDto.email,
          role: givenFarmerCreateDto.role,
          mobilePhoneNumber: givenFarmerCreateDto.mobilePhoneNumber,
          personalId: givenFarmerCreateDto.personalId,
          address: {
            id: actualResponseFromPostFarmers.data.address.id,
            ...givenFarmerCreateDto.address,
          },
          plotsOfLand: [],
        },
      ];

      const actualResponseFromGet = await axios.get(`/companies/${actualResponseFromPostCompanies.data.id}/farmers`);
      expect(actualResponseFromGet.status).toBe(200);
      expect(actualResponseFromGet.data).toEqual(expectedResponse);
    });
  });
});
