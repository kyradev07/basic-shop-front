import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { NotificationService } from '../../services/util/notification.service';
import { User } from '../../models/user.interface';
import { UserService } from '../../services/user/user.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly userService: UserService = inject(UserService);
  private readonly notificationService: NotificationService = inject(NotificationService);

  userForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    const user: User = {
      name: this.userForm.controls.name.value,
      email: this.userForm.controls.email.value,
      password: this.userForm.controls.password.value
    }

    this.userService.createUser(user).subscribe({
      next: (user) => {
        this.notificationService.notificationSuccess(`Usuario '${user.name}' creado exitosamente`);
        this.reset();
      },
      error: (error) => this.notificationService.notificationError(error.error.message ?? error.message),
    });
  }

  reset(): void {
    this.userForm.reset();
  }

}
