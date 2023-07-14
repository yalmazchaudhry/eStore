import {
  Component,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faAsterisk, faX } from '@fortawesome/free-solid-svg-icons';
import { ProductsService } from 'src/app/services/products.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() product: any;
  @Input() dataTableApi: any;
  @Output() closeModalEvent = new EventEmitter<string>();
  productValue: any;
  closeModal() {
    this.closeModalEvent.emit('edit');
  }
  faAsterik = faAsterisk;
  faX = faX;
  selectedFile: any;

  editProductForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private notificationService: NotificationService
  ) {
    this.editProductForm = this.fb.group({
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
      file: [''],
    });
  }
  ngAfterViewInit(): void {
    // this.editModalButtonRef.nativeElement.click();
    document.getElementById('editModalButton')?.click();

    this.productValue = this.product;
  }
  ngOnInit() {}
  ngOnChanges(changes: any) {
    this.populateForm();
  }

  removeImage(): void {
    this.product.image = null;
  }
  populateForm() {
    if (this.product) {
      this.editProductForm?.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        barcode: this.product.barcode,
        quantity: this.product.quantity,
        // file: this.product.image,
      });
      // this.editProductForm?.get('file')?.setValue(this.product.image);
    }
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        this.product.image = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onEditProduct() {
    if (this.editProductForm !== null && this.editProductForm.valid) {
      const formData: FormData = new FormData();
      Object.keys(this.editProductForm.value).forEach((key) => {
        if (key !== 'file')
          formData.append(key, this.editProductForm.value[key]);
      });
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
      const userId = localStorage.getItem('userId');
      if (userId !== null) {
        formData.append('user_id', userId);
      }

      // Sending request
      this.productService.editProduct(formData, this.product.id).subscribe(
        (response) => {
          if (response.message == 'Product updated!') {
            document.getElementById('editModalClose')?.click();

            this.notificationService.showNotification(
              'Success',
              'Product edited successfully',
              'toast-success'
            );
            this.dataTableApi.ajax.reload();

            // form reset
            // this.editProductForm.reset();
            // this.router.navigate(['/login']);
          }
        },
        (error) => {
          this.notificationService.showNotification(
            'Error',
            'An error occurred while editing the product',
            'toast-error'
          );
        }
      );

      // form reset
      // this.myForm.reset();
    }
  }
}
