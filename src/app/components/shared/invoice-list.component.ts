import {
    Component,
    OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FinanceService } from '../../services/finance.service';
import CONFIGURATION from '../../../configurations/configuration';
import { saveAs } from "file-saver";

@Component({
  selector: 'invoice-list',
  templateUrl: './invoice-list.html'
})
export class InvoiceListComponent implements OnInit {
    dialogModel: any;
    statementDates: Array<object>;
    public constructor(
        private _authService: AuthService,
        private _financeService: FinanceService,
        private datePipe: DatePipe,
      ) {

        this.statementDates = [];
      }
    
      ngOnInit() {
        this.getTaxInvoices().then((value) => {
          if(value.length != 0){
            for(var i = 0; i < value.length; i++){
              this.statementDates.push(value[i].date);
            }
          }
        });
      }

      getTaxInvoices(): Promise<any> {
        return new Promise((resolve, reject) => {
          this._financeService.getTaxInvoices(this._authService.getMemberId()).subscribe(
            response => {
              resolve(response.data)
            }
          );
        });
      }
    
      printTaxInvoice(date: string): void {
        const memberId = this._authService.getMemberId();
        const curDate = new Date(date);
        const yearDate = curDate.getFullYear();
        const monthDate = curDate.getMonth()+1;
        const dateFormat = 'yyyy-MM-dd';
        const formattedInvoiceDate = this.datePipe.transform(curDate, dateFormat);
        const token = this._authService.getBearerToken();
        this._financeService.getPDFTaxInvoice(
          memberId,
          yearDate,
          monthDate,
          token).subscribe(
          response => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const filename = `${this._authService.getUserName()}_${formattedInvoiceDate}_TaxInvoice.pdf`;
            saveAs(blob, filename);
          }
        );
      }
}
