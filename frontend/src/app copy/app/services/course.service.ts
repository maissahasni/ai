import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../models/course.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CourseSearchRequest, CourseSearchResponse } from "../models/course-search.models";

@Injectable({ providedIn: 'root' })
export class CourseService {
    private base='http://localhost:8082/api/course';
    constructor(private http: HttpClient) {}
    getAll(): Observable<Course[]> {
        return this.http.get<Course[]>(this.base);
    }


    getById(id: number): Observable<Course> {
        return this.http.get<Course>(`${this.base}/${id}`);
    }


    create(course: Course): Observable<Course> {
        const payload = {
            courseName: course.courseName,
            description: course.description,
            duration: course.duration,
            startDate: course.startDate,
            endDate: course.endDate,
        };
        return this.http.post<Course>(this.base, payload);
    }


    update(id: number, course: Course): Observable<Course> {
        const payload = {
            courseName: course.courseName,
            description: course.description,
            duration: course.duration,
            startDate: course.startDate,
            endDate: course.endDate,
        };
        return this.http.put<Course>(`${this.base}/${id}`, payload);
    }


    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}/${id}`);
    }
     /**
   * Recommended: POST /api/course/search
   * (Change your Spring controller method to @PostMapping("/search"))
   */
  searchByPost(req: CourseSearchRequest): Observable<CourseSearchResponse> {
    return this.http.post<CourseSearchResponse>(`${this.base}/search`, req);
  }

  
}