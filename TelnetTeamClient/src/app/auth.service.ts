import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  private token: string | null = null;
  private apiUrl = 'https://localhost:7216/api/Utilisateur'; // Replace with your actual API URL

  login(matricule: string, motDePasse: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { matricule, motDePasse });
  }

  setToken(token: string) {
    console.log('Setting token:', token);
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    const token = this.token || localStorage.getItem('token');
    console.log('Retrieved token:', token);
    return token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserById(userId: number) {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<any>(url);
  }

  logout() {
    localStorage.removeItem('token');
    this.token = null;
    this.router.navigate(['/login']);
  }
}
