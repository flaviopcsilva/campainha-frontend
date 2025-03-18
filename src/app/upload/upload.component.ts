import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../upload.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})

export class UploadComponent {
  selectedFile!: File | null;
  previewUrl: string | null = null;
  message = '';
  userName = ''; // Campo para armazenar o nome opcional
  userLocation: { latitude: string; longitude: string } | null = null;

  constructor(private uploadService: UploadService) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      this.previewFile(file);
    }
  }

  previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string; // Atualiza a URL de visualização
    };
    reader.readAsDataURL(file);
  }


  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          };
          this.upload()
        },
        (error) => {
          console.error('Erro ao obter localização', error);
          this.message = 'Não foi possível obter a localização.';
        }
      );
    } else {
      this.message = 'Geolocalização não suportada pelo navegador.';
    }
  }

  upload() {
    // if (!this.selectedFile) {
    //   this.message = 'Por favor, selecione um arquivo!';
    //   return;
    // }
    console.log(this.userLocation);
    if (!this.userLocation) {
      this.message = 'Localização não obtida. Por favor, ative o GPS.';
      return;
    }



    this.uploadService.uploadFile(this.selectedFile, this.userName, this.userLocation.latitude, this.userLocation.longitude).subscribe({
      next: (response) => {
        this.message = 'Arquivo enviado com sucesso!';
        console.log(response);
        // Limpar os campos após o envio
        this.selectedFile = null;
        this.previewUrl = null;
        this.userName = '';

        // Fazer a mensagem desaparecer após 10 segundos
        setTimeout(() => {
          this.message = '';
        }, 5000);
      },
      error: (error) => {
        this.message = 'Erro ao enviar o arquivo!';
        console.error(error);
        // Fazer a mensagem desaparecer após 10 segundos
        setTimeout(() => {
          this.message = '';
        }, 5000);
      }
    });
  }
}