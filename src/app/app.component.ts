import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraPreviewService } from './service/camera-preview.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    CameraPreviewService
  ]
})
export class AppComponent implements OnInit {

  videoElement = viewChild<ElementRef>('videoElement');

  videoStream: MediaStream | null = null;

  constructor(
    private cameraPreviewService: CameraPreviewService
  ) {}

  ngOnInit(): void {
    this.listenForChanges();
  }

  openCamera(): void {
    this.cameraPreviewService.openCamera();
  }

  closeCamera(): void {
    this.cameraPreviewService.closeCamera();
  }

  private listenForChanges(): void {
    const sub = this.cameraPreviewService.stream.subscribe({
      next: (stream) => {
        this.videoStream = stream;
        this.displayCamera();
      }
    });
  }

  private displayCamera() {
    if (!this.videoStream) { return; }

    const ele = this.videoElement()?.nativeElement as HTMLVideoElement;

    if (!ele) { 
      this.videoStream = null;
      this.closeCamera();
      return; 
    }

    ele.srcObject = this.videoStream;
    ele.onloadedmetadata = () => {
      ele.play();
    }
  }

}
