import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { SystemUser } from './systemUser';
import { SystemUserService } from '../../services/systemUser.service';

describe('SystemUser', () => {
  let component: SystemUser;
  let fixture: ComponentFixture<SystemUser>;
  let userServiceSpy: jasmine.SpyObj<SystemUserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('SystemUserService', ['getAllSystemUsers', 'getSystemUserByUsername', 'getSystemUserByEmail', 'addSystemUser', 'updateSystemUser']);

    userServiceSpy.getAllSystemUsers.and.returnValue(of([]));
    userServiceSpy.getSystemUserByUsername.and.returnValue(of(null as any));
    userServiceSpy.getSystemUserByEmail.and.returnValue(of(null as any));
    userServiceSpy.addSystemUser.and.returnValue(of({} as any));
    userServiceSpy.updateSystemUser.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [SystemUser, RouterTestingModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: SystemUserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SystemUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads users on loadUsers success', () => {
    const mock = [{ Code: 'U1', Username: 'u1', Email: 'u1@x.com' } as any];
    userServiceSpy.getAllSystemUsers.and.returnValue(of(mock));

    component.loadUsers();

    expect(userServiceSpy.getAllSystemUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(1);
    expect(component.filteredUsers.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  });

  it('handles error when loadUsers fails', () => {
    userServiceSpy.getAllSystemUsers.and.returnValue(throwError(() => new Error('uh-oh')));

    component.loadUsers();

    expect(component.isLoading).toBeFalse();
    expect(component.searchError).toBeTruthy();
  });

  it('applyFilter finds local match and clears search error', () => {
    component.users = [{ code: 'C1', username: 'bob', email: 'b@x' } as any];
    component.applyFilter('bob');

    expect(component.filteredUsers.length).toBe(1);
    expect(component.searchError).toBe('');
  });

  it('applyFilter falls back to username search then email', fakeAsync(() => {
    // no local match
    component.users = [];
    userServiceSpy.getSystemUserByUsername.and.returnValue(of({ Username: 'found', Email: 'f@x' } as any));

    component.applyFilter('found');
    tick();

    expect(userServiceSpy.getSystemUserByUsername).toHaveBeenCalledWith('found');
    expect(component.filteredUsers.length).toBe(1);
  }));

  it('onSaveNewUser validates and calls addSystemUser', () => {
    component.newUser = { code: 'N1', username: 'nu', email: 'nu@x', role: 'Admin', status: 'Deactivated', isActive: false } as any;
    userServiceSpy.addSystemUser.and.returnValue(of({ code: 'N1' } as any));

    component.onSaveNewUser();

    expect(userServiceSpy.addSystemUser).toHaveBeenCalled();
    expect(component.statusMessageType).toBe('success');
  });

  it('onSaveNewUser sets modalErrorMessage when validation fails', () => {
    component.newUser = { code: '', username: '', email: '' } as any;
    component.onSaveNewUser();
    expect(component.modalErrorMessage).toBeTruthy();
  });
});
