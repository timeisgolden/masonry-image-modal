import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IpDetectService {

  constructor(private http: HttpClient) { }
  public getIPAddress() {
    return this.http.get("https://api.ipify.org/?format=json");
  }
}
