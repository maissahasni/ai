import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Enrollment } from '../models/enrollment.model';


@Injectable({ providedIn: 'root' })
export class EnrollmentService {
    private base='http://localhost:8082/api/enrollment';
    constructor(private http: HttpClient) {}
    getAll(): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(this.base);
    }


    getById(id: number): Observable<Enrollment> {
        return this.http.get<Enrollment>(`${this.base}/${id}`);
    }
    private toRequestPayload(e: Enrollment) {
        const studentId = e.studentId ?? e.student?.id;
        const courseId = e.courseId ?? e.course?.id;
        if (!studentId || !courseId) {
            throw new Error('Enrollment requires studentId and courseId');
        }
        return {
            studentId,
            courseId,
            enrollDate: e.enrollDate,
            completionStatus: e.completionStatus,
            grade: e.grade,
        };
    }
    create(e: Enrollment): Observable<Enrollment> {
        const payload = this.toRequestPayload(e);
        return this.http.post<Enrollment>(this.base, payload);
    }


    update(id: number, e: Enrollment): Observable<Enrollment> {
        const payload = this.toRequestPayload(e);
        return this.http.put<Enrollment>(`${this.base}/${id}`, payload);
    }


    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}/${id}`);
    }
}