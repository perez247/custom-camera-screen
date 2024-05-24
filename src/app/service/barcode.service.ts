import { Injectable } from '@angular/core';
import jsQR from 'jsqr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {
  private _qrValue = new Subject<string | null>();
  public qrValue = this._qrValue.asObservable();

  constructor() { }

  captureFrame(videoElement: HTMLVideoElement): void {
    try {
      // Create a canvas to draw image
      const canvas = document.createElement("canvas");
      const context: CanvasRenderingContext2D  = canvas.getContext("2d") || {} as CanvasRenderingContext2D ;

      // Start drawing the image
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context?.drawImage(videoElement, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // scan the image created
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        console.log("Decoded QR code:", code.data);
        this._qrValue.next(code.data);
        // Stop capturing frames (implementation omitted for brevity)
      }
      
    } catch (error) {
      
    }
  }
}
