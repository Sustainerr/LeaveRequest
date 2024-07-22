import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://localhost:7216/api';
  constructor(private http: HttpClient) {}

  getConges(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Conges/matricule/${userId}`);
  }

  getTypeConges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/TypeConges`);
  }

  getGroupMembers(groupeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Utilisateur/groupe/${groupeId}`);
  }

  getAllMembers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Utilisateur`);
  }

  getCongesByMatricule(matricule: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conges/matricule/${matricule}`);
  }

  getLeavesByStatus(statut: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Conges/statut/${statut}`);
  }

  updateCongeStatut(congeId: number, statut: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/conges/${congeId}/statut`, JSON.stringify(statut), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  updateCongeDates(conge_Id: number, dates: { date_Debut: string; date_Fin: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/Conges/${conge_Id}/dates`, dates, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteConge(conge_Id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Conges/${conge_Id}`);
  }
  getUserByMatricule(matricule: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Utilisateur/${matricule}`);
  }
}
