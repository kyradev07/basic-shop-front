import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../services/util/notification.service';
import { User } from '../../models/user.interface';
import { UserService } from '../../services/user/user.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-users-list',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {

  userForm!: FormGroup;
  isEditing: boolean[] = [];
  usersDB: User[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  private findAll() {
    this.isEditing = [];
    this.userForm = this.fb.group({
      users: this.fb.array([])
    })
    this.usersDB = [];
    this.userService.findAll().subscribe({
      next: (users) => {
        this.usersDB = [...users];
        users.forEach((user) => {
          this.users.push(this.createForm(user));
          this.isEditing.push(false);
        });
      },
      error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
    });
  }

  get users(): FormArray {
    return this.userForm.get('users') as FormArray;
  }

  private createForm(user: User) {
    return this.fb.group({
      id: [user.id],
      name: [user.name, [Validators.required, Validators.minLength(3)]],
      email: [user.email, [Validators.required, Validators.email]],
      password: [user.password, [Validators.required, Validators.minLength(6)]],
    })
  }

  edit(index: number) {
    this.isEditing[index] = true;
  }

  save(index: number) {
    const userGroup: FormGroup = this.users.at(index) as FormGroup;
    const user: User = {
      name: userGroup.get('name')?.value,
      email: userGroup.get('email')?.value,
      password: userGroup.get('password')?.value,
    }

    this.userService.updateUser(userGroup.get('id')?.value, user).subscribe({
      next: (user: User) => {
        this.notificationService.notificationSuccess(`User con ID ${user.id} actualizado exitosamente`);
        this.findAll();
      },
      error: (error) => {
        this.cancel(index);
        this.notificationService.notificationError(error.error.message ?? error.message)
      }
    });

  }

  cancel(index: number) {
    this.isEditing[index] = false;
    this.users.at(index).reset(this.usersDB[index]);
  }

  delete(index: number) {
    const user = this.usersDB.at(index);
    this.notificationService.notificationDelete("este usuario").then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteById(user!.id!).subscribe({
          next: () => {
            this.findAll();
            this.notificationService.notificationSuccess(`Usuario ${user!.name} eliminado exitosamente`)
          },
          error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
        })
      }
    });
  }

}
