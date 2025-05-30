import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationSuccess(message: string): void {
    Swal.fire({
      icon: "success",
      title: "¡OK!",
      text: message
    });
  }

  notificationError(message: string): void {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    });
  }

  notificationWarning(message: string): void {
    Swal.fire({
      icon: "warning",
      title: "!Attention!",
      text: message,
    });
  }
}
