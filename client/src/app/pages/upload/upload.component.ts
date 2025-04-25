import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { TorrentService } from '../../services/torrent.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, IftaLabelModule, MultiSelectModule, TextareaModule, ReactiveFormsModule, FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, SelectModule, ButtonModule, FileUploadModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit {
  uploadForm!: FormGroup;

  // TODO: use categories coming from backend
  categories = [
    { name: 'Software', code: 'SOFTWARE' },
    { name: 'Game', code: 'GAME' },
    { name: 'Movie', code: 'MOVIE' },
    { name: 'Music', code: 'MUSIC' }
  ];

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private torrentService: TorrentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.uploadForm = new FormGroup({
      title: new FormControl<string | null>(null, Validators.required),
      description: new FormControl<string | null>(null, Validators.required),
      selectedCategories: new FormControl<string[] | null>(null, Validators.required),
      file: new FormControl<File | null>(null, Validators.required)
    });
    this.cdr.detectChanges();
  }

  onSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.uploadForm.get('file')?.setValue(event.files[0]);
      this.uploadForm.get('file')?.markAsTouched();
    }
  }

  onClear() {
    this.uploadForm.get('file')?.setValue(null);
  }

  onUpload() {
    if (!this.uploadForm.invalid) {
      this.torrentService.upload(this.uploadForm.value).subscribe({
        next: (data) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully' });
          this.router.navigate(['home']);
          this.uploadForm.reset();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file' });
        }
      });
    }
  }
}
