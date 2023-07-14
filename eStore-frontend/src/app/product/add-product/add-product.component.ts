import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductsService } from 'src/app/services/products.service';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements AfterViewInit {
  faAsterik = faAsterisk;
  selectedFile: any;
  productImage: any;
  @Input() dataTableApi: any;
  @Output() closeModalEvent = new EventEmitter<string>();

  faX = faX;

  addProductForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private notificationService: NotificationService
  ) {
    this.addProductForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
        ],
      ],
      barcode: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(10),
        ],
      ],
      quantity: ['', [Validators.required, Validators.minLength(1)]],
      file: ['', [Validators.required]],
    });
  }
  ngAfterViewInit(): void {
    document.getElementById('addModalButton')?.click();
  }
  closeModal() {
    this.closeModalEvent.emit('add');
  }
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        this.productImage = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  removeImage(): void {
    this.productImage = null;
  }
  onAddProduct() {
    if (this.addProductForm !== null && this.addProductForm.valid) {
      const formData: FormData = new FormData();
      Object.keys(this.addProductForm.value).forEach((key) => {
        if (key !== 'file')
          formData.append(key, this.addProductForm.value[key]);
      });
      formData.append('file', this.selectedFile);
      const userId = localStorage.getItem('userId');
      if (userId !== null) {
        formData.append('user_id', userId);
      }

      // Sending request
      this.productService.addProduct(formData).subscribe(
        (response) => {
          if (response.message == 'Product created!') {
            document.getElementById('addModalClose')?.click();
            this.notificationService.showNotification(
              'Success',
              'Product added successfully',
              'toast-success'
            );
            this.dataTableApi.ajax.reload();

            // form reset
            this.addProductForm.reset();
            // this.router.navigate(['/login']);
          }
        },
        (error) => {
          console.log(error);
          this.notificationService.showNotification(
            'Success',
            'An error occurred while adding the product',
            'toast-success'
          );
        }
      );

      // form reset
      // this.myForm.reset();
    }
  }
}
