import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    @ViewChild('fileInput') 
    public fileInput!: ElementRef;
    public loading: boolean = false;
    public xml: string | undefined;
    


    onFileChange(event: Event) {

      const inputE = (event.target as HTMLInputElement);
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
 
}
