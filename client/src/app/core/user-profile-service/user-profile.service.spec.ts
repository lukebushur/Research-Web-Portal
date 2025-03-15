import { TestBed } from '@angular/core/testing';

import { UserProfileService } from './user-profile.service';
import { firstValueFrom, of } from 'rxjs';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';


describe('UserProfileService', () => {
  const API_URL = environment.apiUrl;

  let httpTesting: HttpTestingController;
  let service: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserProfileService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UserProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a getAccountInfo request', async () => {
    const body = 'account info';

    const accountInfo$ = service.getAccountInfo();
    const accountInfoPromise = firstValueFrom(accountInfo$);

    const req = httpTesting.expectOne(`${API_URL}/accountManagement/getAccountInfo`);
    expect(req.request.method).toBe('GET');

    req.flush(body);
    expect(await accountInfoPromise).toEqual(body);
  });

  it('should fetch majors from the university retrieved from getAccountInfo', async () => {
    const university = 'account PFW';
    const accountInfo = {
      success: {
        accountData: {
          universityLocation: university,
        },
      },
    };
    const body = 'majors from account info';

    const majors$ = service.getMajors();
    const majorsPromise = firstValueFrom(majors$);

    const accountInfoReq = httpTesting.expectOne(`${API_URL}/accountManagement/getAccountInfo`);
    accountInfoReq.flush(accountInfo);

    const majorsReq = httpTesting.expectOne(`${API_URL}/getMajors?university=${university}`);
    expect(majorsReq.request.method).toBe('GET');

    majorsReq.flush(body);
    expect(await majorsPromise).toEqual(body);
  });

  it('should fetch majors from the given university', async () => {
    const university = 'PFW';
    const body = 'majors';

    const majors$ = service.getMajors(university);
    const majorsPromise = firstValueFrom(majors$);

    const req = httpTesting.expectOne(`${API_URL}/getMajors?university=${university}`);
    expect(req.request.method).toBe('GET');

    req.flush(body);
    expect(await majorsPromise).toEqual(body);
  });

  it('should send a submitProfileChanges request', async () => {
    const reqBody = {
      name: 'Name',
      GPA: 3,
      Major: 'Computer Science',
      universityLocation: 'Purdue University Fort Wayne'
    }
    const flushResponse = 'submit profile changes';

    const submitResponse$ = service.submitProfileChanges(reqBody);
    const submitResponse = firstValueFrom(submitResponse$);

    const req = httpTesting.expectOne(`${API_URL}/accountManagement/updateAccount`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(reqBody);

    req.flush(flushResponse);
    expect(await submitResponse).toEqual(flushResponse);
  });

  afterEach(() => {
    httpTesting.verify();
  });
});
