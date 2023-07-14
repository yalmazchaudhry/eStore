import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css'],
})
export class DeleteProductComponent implements AfterViewInit {
  @Input() product: any;
  @Input() dataTableApi: any;
  @Output() closeModalEvent = new EventEmitter<string>();

  constructor(
    private productService: ProductsService,
    private notificationService: NotificationService
  ) {}
  closeModal() {
    this.closeModalEvent.emit('delete');
  }
  ngAfterViewInit(): void {
    document.getElementById('deleteModalButton')?.click();
  }
  onDeleteProduct() {
    // Sending request
    this.productService.deleteProduct(this.product.id).subscribe(
      (response) => {
        if (response.message == 'Product deleted!') {
          document.getElementById('deleteModalClose')?.click();

          this.notificationService.showNotification(
            'Success',
            'Product deleted successfully',
            'toast-success'
          );
          this.dataTableApi.ajax.reload();
        }
      },
      (error) => {
        this.notificationService.showNotification(
          'Error',
          'An error occurred while deleting the product',
          'toast-error'
        );
        console.log(error);
      }
    );
  }
}
