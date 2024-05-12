import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraPreviewService } from './service/camera-preview.service';
import { Subscription } from 'rxjs';

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
export class AppComponent implements OnInit, OnDestroy {

  videoElement = viewChild<ElementRef>('videoElement');

  videoStream: MediaStream | null = null;

  videoSubscription?: Subscription;

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
    this.videoSubscription = this.cameraPreviewService.stream.subscribe({
      next: (stream) => {
        this.videoStream = stream;
        this.displayCamera();
      }
    });
  }

  private displayCamera() {
    const ele = this.videoElement()?.nativeElement as HTMLVideoElement;

    if (!this.videoStream || !ele) { 
      this.closeCamera();
      return; 
    }

    ele.srcObject = this.videoStream;
    ele.onloadedmetadata = () => {
      ele.play();
    }
  }

  ngOnDestroy(): void {
    this.videoSubscription?.unsubscribe();
  }
}
