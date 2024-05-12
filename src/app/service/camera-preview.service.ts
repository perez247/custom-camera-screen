import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraPreviewService {
  private _stream = new Subject<MediaStream | null>();
  public stream = this._stream.asObservable();

  private internalStream: MediaStream | null = null;

  constructor() { }

  openCamera() {
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'
      }
    })
    .then(stream => {
      this._stream.next(stream);
      this.internalStream = stream;
    }).catch(error => {
      this._stream.next(null);
      this.internalStream = null;
      // Display error if need be
    });
  }

  closeCamera() {
    if (!this.internalStream) { return; }

    this.internalStream.getVideoTracks().forEach(x => x.stop());
    this.internalStream = null;
    this._stream.next(null);
  }
}
