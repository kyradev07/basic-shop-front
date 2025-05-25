import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationSuccess(message: string): void {
    Swal.fire({
      title: "¡OK!",
      text: message,
      icon: "success"
    });
  }

  notificationError(message: string): void {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    });
  }
}
