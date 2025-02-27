import { Component, ElementRef, ViewChild } from '@angular/core';
import { tap } from 'rxjs';
import { StampService } from './stamp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('fileInput')
  public fileInput!: ElementRef;
  public loading: boolean = false;
  public xml: string | undefined;

  private readonly USER ='EKU9003173C9@ntlink.com.mx';
  private readonly PWD ='Factura.2021*';

  constructor(private stampService: StampService){}

  onFileChange(event: Event) {
    const inputE = event.target as HTMLInputElement;
    const file = inputE.files ? inputE.files[0] : undefined;
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        this.xml = reader?.result?.toString();
      };
      reader.onerror = () => {
        console.error('Error cargando el archivo');
        //this.resetFileInput();
      };
    }
  }

  stampXML() {
    if(this.xml){
      this.stampService.stampInvoice(this.USER, this.PWD, this.xml).pipe(
        tap(response => console.log(response))
      ). subscribe({
        next: (data: any) => {
          console.log(data);
        }, 
        error: (error: any) => {
            console.error(error);
        }
      });
    }
  }
}
