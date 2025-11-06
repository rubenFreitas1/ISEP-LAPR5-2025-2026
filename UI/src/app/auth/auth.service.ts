import { Injectable, inject } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = inject(Keycloak);

  async isLoggedIn(): Promise<boolean> {
    return this.keycloak.authenticated ?? false;
  }

  async loadUserProfile() {
    return await this.keycloak.loadUserProfile();
  }

  async getUserName(): Promise<string> {
    try {
      const profile = await this.loadUserProfile();
      return profile.firstName || profile.username || 'User';
    } catch (err) {
      console.error('Error loading Keycloak profile', err);
      return 'User';
    }
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  async getToken(): Promise<string | undefined> {
    if (!this.keycloak.token) {
      await this.keycloak.updateToken(30);
    }
    return this.keycloak.token;
  } 
}
