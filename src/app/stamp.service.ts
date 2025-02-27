import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StampService {
  private url = `${environment.ntlinkWs}/cfdi40/servicio-timbrado`;
  constructor(private http: HttpClient) {}

  stampInvoice(user: string, password: string, xml: string) {
    const headers = {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: '"https://ntlink.com.mx/IServicioTimbrado/IServicioTimbrado/TimbraCfdiSinSello"',
      'Access-Control-Allow-Origin': '*',
    };
    const options: any = {
      observe: 'body',
      headers,
      responseType: 'text',
    };
    const request = this.soapRequest(user, password, xml);

    return this.http.post(this.url, request, options);
  }

  private soapRequest(user: string, password: string, xml: string) {
    return `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <SOAP-ENV:Header/>
    <SOAP-ENV:Body>
        <TimbraCfdiSinSello xmlns="https://ntlink.com.mx/IServicioTimbrado">
            <userName>${user}</userName>
            <password>${password}</password>
            <comprobante><![CDATA[${xml}]]></comprobante>
        </TimbraCfdiSinSello>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
      `;
  }
}
