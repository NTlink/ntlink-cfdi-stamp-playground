import { Component, ElementRef, ViewChild } from '@angular/core';
import { tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { StampService } from './stamp.service';
interface User {
  wsUser: string;
  wsPassword: string;
}
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
  public result: string ="";

  private readonly USER ='EKU9003173C9@ntlink.com.mx';
  private readonly PWD ='Factura.2021*';
 users: User[] = [
    {
      wsUser: 'URE180429TM6@ntlink.com.mx',
      wsPassword: 'NTPruebas.2021*?'
    },
    {
      wsUser: 'EKU9003173C9@ntlink.com.mx',
      wsPassword: 'Factura.2021*'
    }
  ];
  selectedUser: User | null = this.users[0];
  isCustom: boolean = false;
  customUser: User = { wsUser: '', wsPassword: '' };

  selectUser(index: number) {
    this.isCustom = false;
    this.selectedUser = this.users[index];
  }

  toggleCustom() {
    this.isCustom = !this.isCustom;
    if (this.isCustom) {
      this.selectedUser = null;
    }else {
           this.selectUser(0); // Volver al primer usuario si se desmarca el checkbox
         }
  }
  constructor(private stampService: StampService){
  this.selectUser(0); // Seleccionar el primer usuario por defecto
                                                    }

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
  let user = this.selectedUser;
  if (this.isCustom){
  user=this.customUser;
  }
    if(this.xml){
    this.loading = true;
      this.stampService.stampInvoice(user!.wsUser, user!.wsPassword, this.xml).pipe(
        tap(response => console.log(response))
      ). subscribe({
        next: (data: any) => {
          console.log(data);
          this.loading = false;
          this.result=data;
        },
        error: (error: any) => {
            console.error(error);

            this.loading = false;
             this.result=this.parseSoapError((error.error));
        }
      });
    }
  }
  parseSoapError(error: string): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(error, "application/xml");

    // ¿Hay un error en el XML?
    if (xmlDoc.getElementsByTagName("parsererror").length) {
      console.error("Error al parsear el XML:", new XMLSerializer().serializeToString(xmlDoc));
      return "Error de formato XML";
    }

    const faultStringNode = xmlDoc.getElementsByTagName("faultstring")[0];
    return faultStringNode ? faultStringNode.textContent?.trim() || "Error desconocido" : "Error desconocido";
  }


}
