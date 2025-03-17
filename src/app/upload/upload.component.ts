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

  upload() {
    // if (!this.selectedFile) {
    //   this.message = 'Por favor, selecione um arquivo!';
    //   return;
    // }

    this.uploadService.uploadFile(this.selectedFile, this.userName).subscribe({
      next: (response) => {
        this.message = 'Arquivo enviado com sucesso!';
        console.log(response);
      },
      error: (error) => {
        this.message = 'Erro ao enviar o arquivo!';
        console.error(error);
      }
    });
  }
}