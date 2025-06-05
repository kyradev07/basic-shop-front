import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/util/notification.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly notificationService: NotificationService = inject(NotificationService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    const email: string = this.loginForm.value.email!;
    const password: string = this.loginForm.value.password!;

    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['/']).then(),
      error: (err) => this.notificationService.notificationError(err.message),
    })

  }
}
