import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../student';
import {StudentService} from "../student-service.service";
import {Subject} from "../Subject";


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  students: Student[] = [];
  selectedStudent: Student | null = null;
  studentForm: FormGroup;
  subjectName: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService
  ) {
    this.studentForm = this.formBuilder.group({
      name: ['', Validators.required],
      roll: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getAllStudents().subscribe(students => {
      this.students = students;
    });
  }

  selectStudent(student: Student): void {
    this.selectedStudent = student;
    this.studentForm.patchValue({
      name: student.name,
      roll: student.roll,
      email: student.email
    });
  }

  createStudent(): void {
    if (this.studentForm.invalid) {
      return;
    }

    const newStudent: Student = {
      id: 0,
      name: this.studentForm.value.name,
      roll: this.studentForm.value.roll,
      email: this.studentForm.value.email,
      subjects: []
    };

    this.studentService.createStudent(newStudent).subscribe(student => {
      this.students.push(student);
      this.studentForm.reset();
    });
  }

  updateStudent(): void {
    if (this.selectedStudent && this.studentForm.valid) {
      const updatedStudent: Student = {
        ...this.selectedStudent,
        name: this.studentForm.value.name,
        roll: this.studentForm.value.roll,
        email: this.studentForm.value.email
      };

      this.studentService.updateStudent(this.selectedStudent.id, updatedStudent)
        .subscribe(updatedStudent => {
          const index = this.students.findIndex(s => s.id === updatedStudent.id);
          if (index !== -1) {
            this.students[index] = updatedStudent;
          }
        });
    }
  }

  deleteStudent(): void {
    if (this.selectedStudent) {
      this.studentService.deleteStudent(this.selectedStudent.id).subscribe(() => {
        const index = this.students.findIndex(s => s.id === this.selectedStudent!.id);
        if (index !== -1) {
          this.students.splice(index, 1);
          this.selectedStudent = null;
        }
      });
    }
  }

  addSubjectToStudent(subjectName: string): void {
    if (this.selectedStudent) {
      const subject: Subject = {
        id: 0,
        name: subjectName
      };
      this.studentService.addSubjectToStudent(this.selectedStudent.id, subject).subscribe(updatedStudent => {
        this.selectedStudent = updatedStudent;
      });
    }
  }

  protected readonly Subject = Subject;
}
