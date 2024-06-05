import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { UserDto, UserUpdateDto } from '@forrest-guard/api-interfaces';

describe('UserService', (): void => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let usersMock: UserDto[];
  let userMock: UserDto;
  let updateUserMock: UserUpdateDto;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UserService,
        HttpClient,
        HttpHandler
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    usersMock =  [
      {
        id: '3443-fe56-4dbe-8d6d-23233432435',
        employeeId : '1',
        firstName: 'Pascal',
        lastName: 'Lohse',
        email: 'user@example.com',
        role: 'FARMER',
        mobilePhoneNumber: '+5114841700'
      },
      {
        id: '3443-fe56-4dbe-8d6d-4354365465',
        employeeId : '2',
        firstName: 'Stein',
        lastName: 'Jasmin',
        email: 'user@example.com',
        role: 'EMPLOYEE',
        mobilePhoneNumber: '+454655676'
      }
    ];

    userMock = {
      id: '3443-fe56-4dbe-8d6d-23233432435',
      employeeId : '1',
      firstName: 'Pascal',
      lastName: 'Lohse',
      email: 'user@example.com',
      role: 'FARMER',
      mobilePhoneNumber: '+5114841700'
    }

    updateUserMock = {
      firstName: 'Pascal',
      lastName: 'Lohse',
      email: 'user@example.com',
      role: 'FARMER',
      mobilePhoneNumber: '+5114841700'
    }
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', (): void => {
    expect(service).toBeTruthy();
  });

  it('should get all users', () => {
    service.getUsers().subscribe(res => {
      expect(res).toEqual(usersMock);
    });
  });

  it('should retrieve all users', () => {
    service.getUsers().subscribe(res => {
      expect(res.length).toBe(2);
      expect(res).toEqual(usersMock);
    });
  });

  it('should get user by id', () => {
    const id = '3443-fe56-4dbe-8d6d-23233432435';
    service.getUserById(id).subscribe(res => {
      expect(res).toEqual(userMock);
    });
  });

  it('should update a user', () => {
    service.createUser(updateUserMock).subscribe(res => {
      expect(res).toEqual(userMock);
    });
  });
});



