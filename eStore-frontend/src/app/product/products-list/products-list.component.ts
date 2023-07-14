import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { ImportService } from 'src/app/services/import.service';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private renderer: Renderer2,
    private productsService: ProductsService,
    private importService: ImportService,
    private navbarService: NavbarService
  ) {}
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  userId: any = localStorage.getItem('userId');
  products: Array<any> = [];
  product: object = {};
  dataTableApi: any;
  isEditting: boolean = false;
  isDeleting: boolean = false;
  isViewing: boolean = false;
  isAdding: boolean = false;

  closeModal(type: string) {
    switch (type) {
      case 'edit':
        this.isEditting = false;
        break;
      case 'delete':
        this.isDeleting = false;
        break;
      case 'view':
        this.isViewing = false;
        break;
      case 'add':
        this.isAdding = false;
        break;
    }
  }
  ngOnInit(): void {
    this.importService.importRequested$.subscribe((event: Event) => {
      this.importData(event);
    });
    this.navbarService.isAdding$.subscribe((isAdding) => {
      this.isAdding = isAdding;
    });

    this.renderer.listen('document', 'click', (event) => {
      if (event.target.id == 'edit-btn') {
        const productId = event.target.dataset.id;
        const product = this.findProductById(productId);
        this.product = product;
        this.isEditting = true;
      } else if (event.target.id == 'delete-btn') {
        const productId = event.target.dataset.id;
        const product = this.findProductById(productId);
        this.product = product;
        this.isDeleting = true;
      } else if (event.target.id == 'view-btn') {
        const productId = event.target.dataset.id;
        const product = this.findProductById(productId);
        this.product = product;
        this.isViewing = true;
      }
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      searching: true,
      ordering: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback: any, settings: any) => {
        var api = new $.fn.dataTable.Api(settings);
        this.dataTableApi = api;
        const params: any = {
          pageNumber: api.page(), // <---- get page number
          pageSize: api.page.len(), //<--- get page length
          search: dataTablesParameters.search?.value, //<--- get search value
          userId: this.userId,
          sortColumn: dataTablesParameters.order[0].column,
          sortDirection: dataTablesParameters.order[0].dir,
        };
        this.productsService
          .getAllProducts(this.userId, params)
          .subscribe((response: any) => {
            this.products = response.rows;
            callback({
              data: response.rows,
              recordsTotal: response.rows.length,
              recordsFiltered: response.count,
            });

            this.dtTrigger.next(null);
          });
      },
      // initComplete: function () {},
      responsive: true,
      lengthMenu: [4, 8, 16],
      dom: 'Blfrtip',
      // dom:
      //   "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'<'search-container'f>>>" +
      //   "<'row'<'col-sm-12'tr>>" +
      //   "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      buttons: [
        {
          extend: 'excel',
          text: 'Excel',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5],
          },
        },
        {
          extend: 'print',
          text: 'PDF',
          title: 'e-Store Table',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5],
          },
        },
        {
          extend: 'csv',
          text: 'CSV',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5],
          },
        },
        {
          extend: 'copy',
          text: 'Copy',
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5],
          },
        },
      ],
      columns: [
        {
          title: 'Id',
          data: 'id',
        },
        {
          title: 'Name',
          data: 'name',
        },
        {
          title: 'Barcode',
          data: 'barcode',
        },
        {
          title: 'Price',
          data: 'price',
        },
        {
          title: 'Quantity',
          data: 'quantity',
        },
        {
          title: 'Description',
          data: 'description',
        },
        {
          title: 'Image',
          data: 'image',
          orderable: false,
          render: function (data: any) {
            return `<img src='${data}' class="w-100" style="max-width: 170px;">`;
          },
        },
        {
          title: 'View',
          orderable: false,
          render: function (data: any, type: any, full: any) {
            return `
              <button class="btn btn-primary"  id='view-btn' data-id="${full.id}">View</button>
            `;
          },
        },
        {
          title: 'Edit',
          orderable: false,
          render: function (data: any, type: any, full: any) {
            return `
              <button 
              class="btn btn-warning" 
               id='edit-btn' data-id="${full.id}">Edit</button>
            `;
          },
        },
        {
          title: 'Delete',
          orderable: false,
          render: function (data: any, type: any, full: any) {
            return ` 
              <button  class="btn btn-danger"  id='delete-btn'  data-id="${full.id}">Delete</button>
            `;
          },
        },
      ],
    };
  }
  importData(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const contents: ArrayBuffer | null = e.target
          ?.result as ArrayBuffer | null;
        if (contents) {
          let parsedData: any[];

          if (file.name.endsWith('.csv')) {
            parsedData = this.parseCSV(contents);
          } else if (
            file.name.endsWith('.xlsx') ||
            file.name.endsWith('.xls')
          ) {
            parsedData = this.parseExcel(contents);
          } else {
            console.error(
              'Invalid file format. Only CSV and Excel files are supported.'
            );
            return;
          }

          this.sendDataToBackend(parsedData);
        } else {
          console.error('Failed to read file contents.');
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      console.error('No file selected.');
    }
  }

  sendDataToBackend(parsedData: any[]) {
    this.productsService.importProducts(parsedData, this.userId).subscribe(
      (response) => {
        if (response.message === 'Products imported!') {
          this.dataTableApi.ajax.reload();
        }
      },
      (error) => {
        console.error('Error sending data to backend:', error);
      }
    );
  }

  parseCSV(contents: ArrayBuffer): any[] {
    const parsedData = [];
    const textDecoder = new TextDecoder('utf-8');
    const csvString = textDecoder.decode(contents);
    const lines = csvString.split('\n');
    const headers = lines[0]
      .split(',')
      .map((header) => header.replace(/["\r]/g, ''));

    for (let i = 1; i < lines.length; i++) {
      const data = lines[i]
        .split(',')
        .map((value) => value.replace(/["\r]/g, ''));
      const row: { [key: string]: string } = {};

      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = data[j];
      }

      parsedData.push(row);
    }

    console.log('CSV file parsed successfully:', parsedData);

    return parsedData;
  }

  parseExcel(contents: ArrayBuffer): any[] {
    const workbook = XLSX.read(new Uint8Array(contents), { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const parsedData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
    });

    const headers = parsedData[0];
    const data = parsedData.slice(1);

    const parsedRows = data.map((row: any[]) => {
      const parsedRow: { [key: string]: string } = {};
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        const cellValue = row[i];
        parsedRow[header] = cellValue;
      }
      return parsedRow;
    });

    console.log('Excel file parsed successfully:', parsedRows);

    return parsedRows;
  }

  ngAfterViewInit(): void {}
  findProductById(productId: any): any {
    return this.products.find((product) => {
      return product.id === parseInt(productId, 10);
    });
  }

  deleteProduct() {}
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
