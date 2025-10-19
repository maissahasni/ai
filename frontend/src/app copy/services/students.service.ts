import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Student } from "../models/student.model";
import { Injectable } from "@angular/core";
@Injectable({ providedIn: 'root' })
export class StudentService{
    private base='http://localhost:8082/api/students';
    constructor(private http:HttpClient){}
    getAll():Observable<Student[]>{
        return this.http.get<Student[]>(this.base);
    }
    getById(id: number): Observable<Student> {
        return this.http.get<Student>(`${this.base}/${id}`);
    }
    create(student: Student): Observable<Student> {

        const payload = {
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            dateOfBirth: student.dateOfBirth,
        };
        return this.http.post<Student>(this.base, payload);
    }
    update(id: number, student: Student): Observable<Student> {
        const payload = {
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            dateOfBirth: student.dateOfBirth,
        };
        return this.http.put<Student>(`${this.base}/${id}`, payload);
    }


    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}/${id}`);
    }
}