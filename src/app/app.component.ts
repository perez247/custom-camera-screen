import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraPreviewService } from './service/camera-preview.service';
import { Subscription } from 'rxjs';
import { BarcodeService } from './service/barcode.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    CameraPreviewService,
    BarcodeService,
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  videoElement = viewChild<ElementRef>('videoElement');

  videoStream: MediaStream | null = null;

  videoSubscription?: Subscription;
  qrCodeSubscription?: Subscription;

  timeInterval: any = null;

  constructor(
    private cameraPreviewService: CameraPreviewService,
    private barcodeService: BarcodeService
  ) {}

  ngOnInit(): void {
    this.listenForChanges();
  }

  openCamera(): void {
    this.cameraPreviewService.openCamera();
  }

  closeCamera(): void {
    this.cameraPreviewService.closeCamera();
    this.stopPeriodicaalScan();
  }

  private listenForChanges(): void {
    this.videoSubscription = this.cameraPreviewService.stream.subscribe({
      next: (stream) => {
        this.videoStream = stream;
        this.displayCamera();
      }
    });

    this.qrCodeSubscription = this.barcodeService.qrValue.subscribe({
      next: (code) => {
        alert(code);
        this.closeCamera();
      }
    })
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

    this.beginPeriodicalScan(ele);
  }

  private beginPeriodicalScan(ele: HTMLVideoElement): void {
    ele.addEventListener('pause', () => ele.play());
    this.timeInterval = setInterval(() => {
      this.barcodeService.captureFrame(ele);
    }, 1000)
  }

  private stopPeriodicaalScan(): void {
    if (this.timeInterval) { clearInterval(this.timeInterval); }
    
    const ele = this.videoElement()?.nativeElement as HTMLVideoElement;
    if (ele) {
      ele.removeEventListener('pause', () => {});
    }
  }

  ngOnDestroy(): void {
    this.videoSubscription?.unsubscribe();
    this.qrCodeSubscription?.unsubscribe();
    this.closeCamera();
  }
}
